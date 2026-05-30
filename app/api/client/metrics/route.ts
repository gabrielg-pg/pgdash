import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const clientId = searchParams.get("clientId") // UUID for Neon daily_operations
  const clientSlug = searchParams.get("clientSlug") // Slug for Supabase tables
  const month = parseInt(searchParams.get("month") || "1")
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString())

  if (!clientId || !clientSlug) {
    return NextResponse.json({ error: "clientId and clientSlug are required" }, { status: 400 })
  }

  const daysInMonth = new Date(year, month, 0).getDate()

  // Initialize arrays with zeros
  const salesByDay = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
  const adspendByDay = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
  const refundsByDay = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
  const costsByDay = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))

  // Calculate date range for the month
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = month === 12 
    ? `${year + 1}-01-01` 
    : `${year}-${String(month + 1).padStart(2, '0')}-01`

  try {
    // Fetch sales and adspend data from NEON (daily_operations table)
    const sales = await sql`
      SELECT operation_date, valor_vendas, adspend
      FROM daily_operations
      WHERE client_id = ${clientId}::uuid
        AND operation_date >= ${startDate}::date
        AND operation_date < ${endDate}::date
    `

    if (sales && sales.length > 0) {
      sales.forEach((row: { operation_date: string | Date; valor_vendas: string | number; adspend: string | number }) => {
        const day = new Date(row.operation_date).getDate()
        if (salesByDay[day - 1]) {
          salesByDay[day - 1].value += parseFloat(String(row.valor_vendas)) || 0
        }
        if (adspendByDay[day - 1]) {
          adspendByDay[day - 1].value += parseFloat(String(row.adspend)) || 0
        }
      })
    }

    // Fetch refunds and costs from SUPABASE
    const supabase = await createClient()

    // Fetch refunds data - NOTE: client_slug in refunds table stores the UUID, not the slug
    const { data: refunds } = await supabase
      .from('refunds')
      .select('data_compra, valor_reembolsado')
      .eq('client_slug', clientId)  // Use clientId (UUID) because that's what's stored

    if (refunds && refunds.length > 0) {
      refunds.forEach(row => {
        const parts = row.data_compra?.split('/')
        if (parts && parts.length === 3) {
          const refundDay = parseInt(parts[0])
          const refundMonth = parseInt(parts[1])
          const refundYear = parseInt(parts[2])
          
          if (refundMonth === month && refundYear === year && refundsByDay[refundDay - 1]) {
            // Parse valor_reembolsado - remove € symbol and convert comma to dot
            const valueStr = row.valor_reembolsado?.replace('€', '').replace(',', '.').replace(/\s/g, '').trim()
            refundsByDay[refundDay - 1].value += parseFloat(valueStr) || 0
          }
        }
      })
    }

    // Fetch costs data - NOTE: client_slug may also store UUID
    const { data: costs } = await supabase
      .from('operational_costs')
      .select('value')
      .eq('client_slug', clientId)  // Try with clientId (UUID) first
      .eq('month', month)
      .eq('year', year)

    // Costs are monthly totals - distribute evenly or show in first day
    if (costs && costs.length > 0) {
      const totalCostsValue = costs.reduce((sum, row) => sum + (parseFloat(String(row.value)) || 0), 0)
      // Put total in first day for display purposes
      if (costsByDay[0]) {
        costsByDay[0].value = totalCostsValue
      }
    }

    // Calculate totals
    const totalSales = salesByDay.reduce((sum, d) => sum + d.value, 0)
    const totalAdspend = adspendByDay.reduce((sum, d) => sum + d.value, 0)
    const totalRefunds = refundsByDay.reduce((sum, d) => sum + d.value, 0)
    const totalCosts = costsByDay.reduce((sum, d) => sum + d.value, 0)

    return NextResponse.json({
      salesData: salesByDay,
      adspendData: adspendByDay,
      refundsData: refundsByDay,
      costsData: costsByDay,
      totalSales,
      totalAdspend,
      totalRefunds,
      totalCosts,
    })
  } catch (error) {
    console.error("[v0] Error fetching metrics:", error)
    return NextResponse.json({ 
      error: "Failed to fetch metrics",
      salesData: salesByDay,
      adspendData: adspendByDay,
      refundsData: refundsByDay,
      costsData: costsByDay,
      totalSales: 0,
      totalAdspend: 0,
      totalRefunds: 0,
      totalCosts: 0,
    }, { status: 500 })
  }
}
