import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { getConnections } from "@/app/actions/connections"
import { ConnectionsManager } from "@/components/client/connections-manager"

export const dynamic = "force-dynamic"

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

export default async function ConexoesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const client = await getClientBySlug(slug)

  if (!client) {
    redirect("/login")
  }

  // Conexões são exclusivas do Scale Global
  if (client.plan !== "SCALE_GLOBAL") {
    redirect(`/dashboards/${slug}`)
  }

  const connections = await getConnections(client.id)

  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2 text-balance">Conexões</h1>
        <p className="text-[rgba(245,245,247,0.52)] text-pretty">
          Conecte sua loja Shopify e sua conta de anúncios do Meta Ads para sincronizar
          automaticamente as vendas e os investimentos em tráfego.
        </p>
      </div>

      <ConnectionsManager
        clientId={client.id}
        slug={client.slug}
        initialConnections={connections}
      />
    </div>
  )
}
