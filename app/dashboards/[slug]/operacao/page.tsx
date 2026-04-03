import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { OperationsSpreadsheet } from "@/components/client/operations-spreadsheet"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  try {
    const result = await sql`
      SELECT id, name, slug, plan FROM clients WHERE slug = ${slug}
    `
    return result[0] || null
  } catch {
    return null
  }
}

async function getOperations(clientId: string) {
  try {
    const result = await sql`
      SELECT id, operation_date, obs, vendas, valor_vendas, adspend, cogs, created_at, updated_at
      FROM daily_operations
      WHERE client_id = ${clientId}::uuid
      ORDER BY operation_date DESC
    `
    return result || []
  } catch (error) {
    console.error("Error fetching operations:", error)
    return []
  }
}

export default async function OperacaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  const client = await getClientBySlug(slug)
  
  if (!client) {
    redirect("/login")
  }

  // Check if client has SCALE plan
  if (client.plan?.toUpperCase() !== "SCALE") {
    redirect(`/dashboards/${slug}`)
  }

  const operations = await getOperations(client.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7]">Operação</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Gerencie os dados diários da sua operação
        </p>
      </div>

      <OperationsSpreadsheet 
        clientId={client.id} 
        initialData={operations as any[]} 
      />
    </div>
  )
}
