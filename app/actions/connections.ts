"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type ConnectionProvider = "shopify" | "meta_ads"
export type ConnectionStatus = "connected" | "disconnected" | "error"

export interface ClientConnection {
  id: string
  client_id: string
  provider: ConnectionProvider
  status: ConnectionStatus
  account_name: string | null
  account_id: string | null
  last_synced_at: string | null
  updated_at: string
}

// Busca todas as conexões de um cliente
export async function getConnections(clientId: string): Promise<ClientConnection[]> {
  try {
    const result = await sql`
      SELECT id, client_id, provider, status, account_name, account_id,
             last_synced_at::text, updated_at::text
      FROM client_connections
      WHERE client_id = ${clientId}::uuid
    `
    return result as ClientConnection[]
  } catch (error) {
    console.error("[v0] Error fetching connections:", error)
    return []
  }
}

// Marca uma conexão como conectada.
// NOTE: quando as credenciais reais dos apps (Shopify/Meta) estiverem
// disponíveis, o token e o account_name virão do callback OAuth.
export async function connectProvider(
  clientId: string,
  provider: ConnectionProvider,
  data: { accountName?: string; accountId?: string; accessToken?: string; slug: string }
) {
  try {
    await sql`
      INSERT INTO client_connections (client_id, provider, status, account_name, account_id, access_token, last_synced_at, updated_at)
      VALUES (
        ${clientId}::uuid,
        ${provider},
        'connected',
        ${data.accountName || null},
        ${data.accountId || null},
        ${data.accessToken || null},
        now(),
        now()
      )
      ON CONFLICT (client_id, provider)
      DO UPDATE SET
        status = 'connected',
        account_name = ${data.accountName || null},
        account_id = ${data.accountId || null},
        access_token = ${data.accessToken || null},
        updated_at = now()
    `
    revalidatePath(`/dashboards/${data.slug}/conexoes`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error connecting provider:", error)
    return { success: false, error: "Falha ao conectar" }
  }
}

// Desconecta um provedor (remove tokens e marca como desconectado)
export async function disconnectProvider(
  clientId: string,
  provider: ConnectionProvider,
  slug: string
) {
  try {
    await sql`
      UPDATE client_connections
      SET status = 'disconnected',
          access_token = NULL,
          refresh_token = NULL,
          token_expires_at = NULL,
          updated_at = now()
      WHERE client_id = ${clientId}::uuid AND provider = ${provider}
    `
    revalidatePath(`/dashboards/${slug}/conexoes`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error disconnecting provider:", error)
    return { success: false, error: "Falha ao desconectar" }
  }
}

// Atualiza a data da última sincronização.
// NOTE: a sincronização real (puxar vendas do Shopify e adspend do Meta)
// será implementada aqui quando as credenciais OAuth estiverem ativas.
export async function syncConnections(clientId: string, slug: string) {
  try {
    await sql`
      UPDATE client_connections
      SET last_synced_at = now(), updated_at = now()
      WHERE client_id = ${clientId}::uuid AND status = 'connected'
    `
    revalidatePath(`/dashboards/${slug}/conexoes`)
    return { success: true, syncedAt: new Date().toISOString() }
  } catch (error) {
    console.error("[v0] Error syncing connections:", error)
    return { success: false, error: "Falha ao sincronizar" }
  }
}
