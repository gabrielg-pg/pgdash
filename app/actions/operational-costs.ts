"use server"

import { createClient } from "@/lib/supabase/server"

export async function getOperationalCosts(clientId: string, month: number, year: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('operational_costs')
    .select('*')
    .eq('client_slug', clientId)
    .eq('month', month)
    .eq('year', year)
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Error fetching operational costs:", error)
    return []
  }

  return data || []
}

// Busca TODOS os custos do ano numa única query.
// Permite trocar de mês no cliente sem novas chamadas de rede.
export async function getOperationalCostsForYear(clientId: string, year: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operational_costs')
    .select('*')
    .eq('client_slug', clientId)
    .eq('year', year)
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Error fetching operational costs for year:", error)
    return []
  }

  return data || []
}

export async function saveOperationalCosts(
  clientId: string, 
  month: number, 
  year: number,
  costs: { id?: string; service: string; currency: string; value: number }[]
) {
  const supabase = await createClient()

  // First, delete existing costs for this client/month/year
  const { error: deleteError } = await supabase
    .from('operational_costs')
    .delete()
    .eq('client_slug', clientId)
    .eq('month', month)
    .eq('year', year)

  if (deleteError) {
    console.error("Error deleting old costs:", deleteError)
    return { success: false, error: deleteError.message }
  }

  // Then insert new costs
  if (costs.length > 0) {
    const costsToInsert = costs.map(cost => ({
      client_slug: clientId,
      month,
      year,
      service: cost.service,
      currency: cost.currency,
      value: cost.value
    }))

    const { error: insertError } = await supabase
      .from('operational_costs')
      .insert(costsToInsert)

    if (insertError) {
      console.error("Error inserting costs:", insertError)
      return { success: false, error: insertError.message }
    }
  }

  return { success: true }
}

export async function deleteOperationalCost(costId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('operational_costs')
    .delete()
    .eq('id', costId)

  if (error) {
    console.error("Error deleting cost:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
