"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface RefundData {
  id?: string
  client_slug: string
  id_reembolso: string
  data_compra: string
  nome_cliente: string
  email: string
  num_encomenda: string
  nome_peca: string
  tamanho: string
  preco_pago: string
  motivo_devolucao: string
  tipo_resolucao: string
  valor_reembolsado: string
  estado: string
}

export async function getRefunds(clientSlug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("refunds")
    .select("*")
    .eq("client_slug", clientSlug)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching refunds:", error)
    return []
  }
  
  return data || []
}

export async function createRefund(refund: RefundData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("refunds")
    .insert({
      client_slug: refund.client_slug,
      id_reembolso: refund.id_reembolso,
      data_compra: refund.data_compra,
      nome_cliente: refund.nome_cliente,
      email: refund.email,
      num_encomenda: refund.num_encomenda,
      nome_peca: refund.nome_peca,
      tamanho: refund.tamanho,
      preco_pago: refund.preco_pago,
      motivo_devolucao: refund.motivo_devolucao,
      tipo_resolucao: refund.tipo_resolucao,
      valor_reembolsado: refund.valor_reembolsado,
      estado: refund.estado
    })
    .select()
    .single()
  
  if (error) {
    console.error("Error creating refund:", error)
    return { error: error.message }
  }
  
  revalidatePath(`/dashboards/${refund.client_slug}/reembolsos`)
  return { data }
}

export async function updateRefund(id: string, updates: Partial<RefundData>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("refunds")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()
  
  if (error) {
    console.error("Error updating refund:", error)
    return { error: error.message }
  }
  
  return { data }
}

export async function deleteRefund(id: string, clientSlug: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("refunds")
    .delete()
    .eq("id", id)
  
  if (error) {
    console.error("Error deleting refund:", error)
    return { error: error.message }
  }
  
  revalidatePath(`/dashboards/${clientSlug}/reembolsos`)
  return { success: true }
}

export async function saveAllRefunds(clientSlug: string, refunds: RefundData[]) {
  const supabase = await createClient()
  
  // First, delete all existing refunds for this client
  const { error: deleteError } = await supabase
    .from("refunds")
    .delete()
    .eq("client_slug", clientSlug)
  
  if (deleteError) {
    console.error("Error deleting old refunds:", deleteError)
    return { error: deleteError.message }
  }
  
  // Then insert all new refunds
  if (refunds.length > 0) {
    const refundsToInsert = refunds.map(r => ({
      client_slug: clientSlug,
      id_reembolso: r.id_reembolso,
      data_compra: r.data_compra,
      nome_cliente: r.nome_cliente,
      email: r.email,
      num_encomenda: r.num_encomenda,
      nome_peca: r.nome_peca,
      tamanho: r.tamanho,
      preco_pago: r.preco_pago,
      motivo_devolucao: r.motivo_devolucao,
      tipo_resolucao: r.tipo_resolucao,
      valor_reembolsado: r.valor_reembolsado,
      estado: r.estado
    }))
    
    const { error: insertError } = await supabase
      .from("refunds")
      .insert(refundsToInsert)
    
    if (insertError) {
      console.error("Error inserting refunds:", insertError)
      return { error: insertError.message }
    }
  }
  
  revalidatePath(`/dashboards/${clientSlug}/reembolsos`)
  return { success: true }
}
