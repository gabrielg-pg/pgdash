import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { StructuresGrid } from "@/components/client/structures-grid"

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

export default async function EstruturasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const client = await getClientBySlug(slug)

  if (!client) {
    redirect("/login")
  }

  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2 text-balance">
          Estruturas disponíveis para sua operação
        </h1>
      </div>

      <StructuresGrid plan={client.plan} />
    </div>
  )
}
