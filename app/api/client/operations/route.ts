import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    let operations
    if (month && year) {
      // Filter by specific month
      operations = await sql`
        SELECT 
          id,
          operation_date::text,
          vendas,
          valor_vendas,
          adspend,
          cogs
        FROM daily_operations
        WHERE client_id = ${clientId}::uuid
          AND EXTRACT(MONTH FROM operation_date) = ${parseInt(month)}
          AND EXTRACT(YEAR FROM operation_date) = ${parseInt(year)}
        ORDER BY operation_date ASC
      `
    } else {
      // Get all operations
      operations = await sql`
        SELECT 
          id,
          operation_date::text,
          vendas,
          valor_vendas,
          adspend,
          cogs
        FROM daily_operations
        WHERE client_id = ${clientId}::uuid
        ORDER BY operation_date DESC
      `
    }

    return NextResponse.json({ operations: operations || [] })
  } catch (error) {
    console.error("Error fetching operations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { clientId, operations } = await request.json()

    if (!clientId || !operations || !Array.isArray(operations)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const savedOperations = []

    for (const op of operations) {
      // Check if record exists for this date
      const existing = await sql`
        SELECT id FROM daily_operations
        WHERE client_id = ${clientId}::uuid AND operation_date = ${op.operation_date}::date
      `

      if (existing && existing.length > 0) {
        // Update existing record
        const result = await sql`
          UPDATE daily_operations
          SET 
            vendas = ${op.vendas || 0},
            valor_vendas = ${op.valor_vendas || 0},
            adspend = ${op.adspend || 0},
            cogs = ${op.cogs || 0},
            updated_at = NOW()
          WHERE client_id = ${clientId}::uuid AND operation_date = ${op.operation_date}::date
          RETURNING id, operation_date::text, vendas, valor_vendas, adspend, cogs
        `
        if (result[0]) {
          savedOperations.push(result[0])
        }
      } else {
        // Insert new record
        const result = await sql`
          INSERT INTO daily_operations (client_id, operation_date, vendas, valor_vendas, adspend, cogs)
          VALUES (${clientId}::uuid, ${op.operation_date}::date, ${op.vendas || 0}, ${op.valor_vendas || 0}, ${op.adspend || 0}, ${op.cogs || 0})
          RETURNING id, operation_date::text, vendas, valor_vendas, adspend, cogs
        `
        if (result[0]) {
          savedOperations.push(result[0])
        }
      }
    }

    return NextResponse.json({ success: true, operations: savedOperations })
  } catch (error) {
    console.error("Error saving operations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
