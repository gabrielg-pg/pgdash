import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { RefundsManagement } from "@/components/client/refunds-management"

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

export default async function ReembolsosPage({ params }: { params: Promise<{ slug: string }> }) {
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
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">Reembolsos</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Gerencie os pedidos de reembolso e devoluções
        </p>
      </div>

      <RefundsManagement clientId={client.id} />
    </div>
  )
}
