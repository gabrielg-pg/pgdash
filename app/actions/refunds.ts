"use server"

import { sql } from "@/lib/db"
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
  try {
    const data = await sql`
      SELECT * FROM refunds
      WHERE client_slug = ${clientSlug}
      ORDER BY created_at DESC
    `
    return data || []
  } catch (error) {
    console.error("Error fetching refunds:", error)
    return []
  }
}

export async function createRefund(refund: RefundData) {
  try {
    const rows = await sql`
      INSERT INTO refunds (
        client_slug, id_reembolso, data_compra, nome_cliente, email,
        num_encomenda, nome_peca, tamanho, preco_pago, motivo_devolucao,
        tipo_resolucao, valor_reembolsado, estado
      ) VALUES (
        ${refund.client_slug}, ${refund.id_reembolso}, ${refund.data_compra}, ${refund.nome_cliente}, ${refund.email},
        ${refund.num_encomenda}, ${refund.nome_peca}, ${refund.tamanho}, ${refund.preco_pago}, ${refund.motivo_devolucao},
        ${refund.tipo_resolucao}, ${refund.valor_reembolsado}, ${refund.estado}
      )
      RETURNING *
    `
    revalidatePath(`/dashboards/${refund.client_slug}/reembolsos`)
    return { data: rows[0] }
  } catch (error) {
    console.error("Error creating refund:", error)
    return { error: (error as Error).message }
  }
}

export async function updateRefund(id: string, updates: Partial<RefundData>) {
  try {
    const rows = await sql`
      UPDATE refunds SET
        id_reembolso = COALESCE(${updates.id_reembolso ?? null}, id_reembolso),
        data_compra = COALESCE(${updates.data_compra ?? null}, data_compra),
        nome_cliente = COALESCE(${updates.nome_cliente ?? null}, nome_cliente),
        email = COALESCE(${updates.email ?? null}, email),
        num_encomenda = COALESCE(${updates.num_encomenda ?? null}, num_encomenda),
        nome_peca = COALESCE(${updates.nome_peca ?? null}, nome_peca),
        tamanho = COALESCE(${updates.tamanho ?? null}, tamanho),
        preco_pago = COALESCE(${updates.preco_pago ?? null}, preco_pago),
        motivo_devolucao = COALESCE(${updates.motivo_devolucao ?? null}, motivo_devolucao),
        tipo_resolucao = COALESCE(${updates.tipo_resolucao ?? null}, tipo_resolucao),
        valor_reembolsado = COALESCE(${updates.valor_reembolsado ?? null}, valor_reembolsado),
        estado = COALESCE(${updates.estado ?? null}, estado),
        updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `
    return { data: rows[0] }
  } catch (error) {
    console.error("Error updating refund:", error)
    return { error: (error as Error).message }
  }
}

export async function deleteRefund(id: string, clientSlug: string) {
  try {
    await sql`DELETE FROM refunds WHERE id = ${id}`
    revalidatePath(`/dashboards/${clientSlug}/reembolsos`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting refund:", error)
    return { error: (error as Error).message }
  }
}

export async function saveAllRefunds(clientSlug: string, refunds: RefundData[]) {
  try {
    // Substitui todos os reembolsos do cliente: apaga e reinsere.
    await sql`DELETE FROM refunds WHERE client_slug = ${clientSlug}`

    for (const r of refunds) {
      await sql`
        INSERT INTO refunds (
          client_slug, id_reembolso, data_compra, nome_cliente, email,
          num_encomenda, nome_peca, tamanho, preco_pago, motivo_devolucao,
          tipo_resolucao, valor_reembolsado, estado
        ) VALUES (
          ${clientSlug}, ${r.id_reembolso}, ${r.data_compra}, ${r.nome_cliente}, ${r.email},
          ${r.num_encomenda}, ${r.nome_peca}, ${r.tamanho}, ${r.preco_pago}, ${r.motivo_devolucao},
          ${r.tipo_resolucao}, ${r.valor_reembolsado}, ${r.estado}
        )
      `
    }

    revalidatePath(`/dashboards/${clientSlug}/reembolsos`)
    return { success: true }
  } catch (error) {
    console.error("Error saving refunds:", error)
    return { error: (error as Error).message }
  }
}
