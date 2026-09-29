import { redirect } from "next/navigation"
import { getClientBySlugCached } from "@/lib/db"
import { OperationalCosts } from "@/components/client/operational-costs"
import { getOperationalCostsForYear } from "@/app/actions/operational-costs"

export const dynamic = 'force-dynamic'

export default async function CustosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // O layout já garante a autenticação, então dispensamos o getSession() aqui.
  // Usamos o cliente cacheado (deduplicado) em vez de refazer a query.
  const client = await getClientBySlugCached(slug)
  
  if (!client) {
    redirect("/login")
  }

  // Scale Global usa moeda internacional (€ padrão); planos nacionais usam R$
  const isGlobal = client.plan === "SCALE_GLOBAL"

  // Busca TODOS os custos do ano numa única query.
  // A troca de mês passa a ser instantânea no cliente (sem novas chamadas).
  const currentMonth = new Date().getMonth() + 1 // 1-12
  const currentYear = new Date().getFullYear()
  const yearCosts = await getOperationalCostsForYear(client.id, currentYear)

  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">Custos Operacionais</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Registre mensalmente os custos operacionais para melhor performance e controle da sua operação
        </p>
      </div>

      <OperationalCosts 
        clientId={client.id} 
        initialData={yearCosts as any[]}
        initialMonth={currentMonth}
        initialYear={currentYear}
        isGlobal={isGlobal}
      />
    </div>
  )
}
