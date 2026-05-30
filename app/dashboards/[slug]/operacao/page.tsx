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

async function getOperations(clientId: string, month: number, year: number) {
  try {
    const result = await sql`
      SELECT id, operation_date::text, vendas, valor_vendas, adspend, cogs
      FROM daily_operations
      WHERE client_id = ${clientId}::uuid
        AND EXTRACT(MONTH FROM operation_date) = ${month}
        AND EXTRACT(YEAR FROM operation_date) = ${year}
      ORDER BY operation_date ASC
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

  // Check if client has SCALE_GLOBAL plan
  if (client.plan !== "SCALE_GLOBAL") {
    redirect(`/dashboards/${slug}`)
  }

  // Get current month data for initial load
  const currentMonth = new Date().getMonth() + 1 // 1-12
  const currentYear = 2026
  const operations = await getOperations(client.id, currentMonth, currentYear)

  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">Operação</h1>
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
