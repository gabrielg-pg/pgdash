import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OperationalCosts } from "@/components/client/operational-costs"

export const metadata: Metadata = {
  title: "Custos Operacionais | PG Dash",
  description: "Registre mensalmente os custos operacionais para melhor performance e controle da sua operação",
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getClient(slug: string) {
  const supabase = await createClient()
  
  const { data: client } = await supabase
    .from("pg_clients")
    .select("*")
    .eq("slug", slug)
    .single()
  
  return client
}

export default async function CustosPage({ params }: PageProps) {
  const { slug } = await params
  const client = await getClient(slug)

  if (!client) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F5F5F7]">Custos Operacionais</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Registre mensalmente os custos operacionais para melhor performance e controle da sua operação
        </p>
      </div>

      <OperationalCosts clientId={slug} />
    </div>
  )
}
