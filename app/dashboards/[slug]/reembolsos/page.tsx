import { redirect } from "next/navigation"
import { getClientBySlugCached } from "@/lib/db"
import { RefundsManagement } from "@/components/client/refunds-management"
import { getRefunds } from "@/app/actions/refunds"

export const dynamic = 'force-dynamic'

export default async function ReembolsosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // O layout já garante a autenticação, então dispensamos o getSession() aqui.
  // Usamos o cliente cacheado (deduplicado) em vez de refazer a query.
  const client = await getClientBySlugCached(slug)

  if (!client) {
    redirect("/login")
  }

  // Scale Global usa € ; planos nacionais usam R$.
  const isGlobal = client.plan === "SCALE_GLOBAL"

  // Busca os reembolsos no servidor para renderizar sem spinner no cliente.
  const initialRefunds = await getRefunds(client.id)

  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">Reembolsos</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Gerencie os pedidos de reembolso e devoluções
        </p>
      </div>

      <RefundsManagement clientId={client.id} initialData={initialRefunds as any[]} isGlobal={isGlobal} />
    </div>
  )
}
