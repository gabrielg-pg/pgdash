import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const clientSlug = searchParams.get("clientSlug")
  const month = parseInt(searchParams.get("month") || "1")
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString())

  if (!clientSlug) {
    return NextResponse.json({ error: "clientSlug is required" }, { status: 400 })
  }

  const supabase = await createClient()
  const daysInMonth = new Date(year, month, 0).getDate()

  // Initialize arrays with zeros
  const salesByDay = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
  const refundsByDay = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
  const costsByDay = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))

  // Fetch sales data
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = month === 12 
    ? `${year + 1}-01-01` 
    : `${year}-${String(month + 1).padStart(2, '0')}-01`
  
  const { data: sales } = await supabase
    .from('daily_operations')
    .select('operation_date, valor_vendas')
    .eq('client_id', clientSlug)
    .gte('operation_date', startDate)
    .lt('operation_date', endDate)

  if (sales) {
    sales.forEach(row => {
      const day = new Date(row.operation_date).getDate()
      if (salesByDay[day - 1]) {
        salesByDay[day - 1].value += parseFloat(row.valor_vendas) || 0
      }
    })
  }

  // Fetch refunds data
  const { data: refunds } = await supabase
    .from('refunds')
    .select('data_compra, valor_reembolsado')
    .eq('client_slug', clientSlug)

  if (refunds) {
    refunds.forEach(row => {
      const parts = row.data_compra?.split('/')
      if (parts && parts.length === 3) {
        const refundMonth = parseInt(parts[1])
        const refundYear = parseInt(parts[2])
        const refundDay = parseInt(parts[0])
        
        if (refundMonth === month && refundYear === year && refundsByDay[refundDay - 1]) {
          const value = row.valor_reembolsado?.replace('€', '').replace(',', '.').trim()
          refundsByDay[refundDay - 1].value += parseFloat(value) || 0
        }
      }
    })
  }

  // Fetch costs data
  const { data: costs } = await supabase
    .from('operational_costs')
    .select('value, created_at')
    .eq('client_slug', clientSlug)
    .eq('month', month)
    .eq('year', year)

  if (costs) {
    const totalCostsValue = costs.reduce((sum, row) => sum + (parseFloat(row.value) || 0), 0)
    if (costsByDay[0]) {
      costsByDay[0].value = totalCostsValue
    }
  }

  // Calculate totals
  const totalSales = salesByDay.reduce((sum, d) => sum + d.value, 0)
  const totalRefunds = refundsByDay.reduce((sum, d) => sum + d.value, 0)
  const totalCosts = costsByDay.reduce((sum, d) => sum + d.value, 0)

  return NextResponse.json({
    salesData: salesByDay,
    refundsData: refundsByDay,
    costsData: costsByDay,
    totalSales,
    totalRefunds,
    totalCosts,
  })
}
