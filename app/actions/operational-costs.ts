"use server"

import { sql } from "@/lib/db"

export async function getOperationalCosts(clientId: string, month: number, year: number) {
  try {
    const data = await sql`
      SELECT * FROM operational_costs
      WHERE client_slug = ${clientId} AND month = ${month} AND year = ${year}
      ORDER BY created_at ASC
    `
    return data || []
  } catch (error) {
    console.error("Error fetching operational costs:", error)
    return []
  }
}

// Busca TODOS os custos do ano numa única query.
// Permite trocar de mês no cliente sem novas chamadas de rede.
export async function getOperationalCostsForYear(clientId: string, year: number) {
  try {
    const data = await sql`
      SELECT * FROM operational_costs
      WHERE client_slug = ${clientId} AND year = ${year}
      ORDER BY created_at ASC
    `
    return data || []
  } catch (error) {
    console.error("Error fetching operational costs for year:", error)
    return []
  }
}

export async function saveOperationalCosts(
  clientId: string,
  month: number,
  year: number,
  costs: { id?: string; service: string; currency: string; value: number }[]
) {
  try {
    // Substitui os custos do mês: apaga os antigos e insere os novos.
    await sql`
      DELETE FROM operational_costs
      WHERE client_slug = ${clientId} AND month = ${month} AND year = ${year}
    `

    for (const cost of costs) {
      await sql`
        INSERT INTO operational_costs (client_slug, month, year, service, currency, value)
        VALUES (${clientId}, ${month}, ${year}, ${cost.service}, ${cost.currency}, ${cost.value})
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving costs:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteOperationalCost(costId: string) {
  try {
    await sql`DELETE FROM operational_costs WHERE id = ${costId}`
    return { success: true }
  } catch (error) {
    console.error("Error deleting cost:", error)
    return { success: false, error: (error as Error).message }
  }
}
