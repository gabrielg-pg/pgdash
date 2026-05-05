import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { OperationalCosts } from "@/components/client/operational-costs"

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

export default async function CustosPage({ params }: { params: Promise<{ slug: string }> }) {
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

  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">Custos Operacionais</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Registre mensalmente os custos operacionais para melhor performance e controle da sua operação
        </p>
      </div>

      <OperationalCosts clientId={client.id} />
    </div>
  )
}
