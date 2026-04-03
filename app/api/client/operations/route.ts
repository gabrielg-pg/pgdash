import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

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
      if (op.id) {
        // Update existing record
        const result = await sql`
          UPDATE daily_operations
          SET 
            operation_date = ${op.operation_date}::date,
            obs = ${op.obs || ''},
            vendas = ${op.vendas || 0},
            valor_vendas = ${op.valor_vendas || 0},
            adspend = ${op.adspend || 0},
            cogs = ${op.cogs || 0},
            updated_at = NOW()
          WHERE id = ${op.id}::uuid AND client_id = ${clientId}::uuid
          RETURNING *
        `
        if (result[0]) {
          savedOperations.push(result[0])
        }
      } else {
        // Insert new record
        const result = await sql`
          INSERT INTO daily_operations (client_id, operation_date, obs, vendas, valor_vendas, adspend, cogs)
          VALUES (${clientId}::uuid, ${op.operation_date}::date, ${op.obs || ''}, ${op.vendas || 0}, ${op.valor_vendas || 0}, ${op.adspend || 0}, ${op.cogs || 0})
          RETURNING *
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
