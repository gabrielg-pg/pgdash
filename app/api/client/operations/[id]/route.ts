import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Operation ID required" }, { status: 400 })
    }

    await sql`
      DELETE FROM daily_operations WHERE id = ${id}::uuid
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting operation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
