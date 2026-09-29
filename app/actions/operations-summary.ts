"use server"

import { sql } from "@/lib/db"

// Converte texto monetário livre (ex: "R$ 1.234,56", "1234.56", "€ 99,90") em número.
function parseMoney(text: string | number | null | undefined): number {
  if (text == null) return 0
  if (typeof text === "number") return isNaN(text) ? 0 : text
  let s = String(text).trim()
  if (!s) return 0
  // Mantém apenas dígitos, vírgula, ponto e sinal negativo.
  s = s.replace(/[^\d.,-]/g, "")
  if (!s) return 0
  const hasComma = s.includes(",")
  const hasDot = s.includes(".")
  if (hasComma && hasDot) {
    // Formato BR: ponto como milhar, vírgula como decimal.
    s = s.replace(/\./g, "").replace(",", ".")
  } else if (hasComma) {
    s = s.replace(",", ".")
  }
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

// Extrai mês/ano de uma data em texto (aceita YYYY-MM-DD, DD/MM/YYYY e DD/MM/YY).
function extractMonthYear(dateText: string | null | undefined): { month: number; year: number } | null {
  if (!dateText) return null
  const s = String(dateText).trim()
  let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/) // YYYY-MM-DD
  if (m) return { year: +m[1], month: +m[2] }
  m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/) // DD/MM/YYYY
  if (m) return { year: +m[3], month: +m[2] }
  m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})$/) // DD/MM/YY
  if (m) return { year: 2000 + +m[3], month: +m[2] }
  return null
}

/**
 * Retorna os totais que devem ser descontados do lucro da operação num mês:
 * custos operacionais e reembolsos. `month` é 1-12.
 */
export async function getMonthlyDeductions(clientId: string, month: number, year: number) {
  let operationalCosts = 0
  let refunds = 0

  try {
    const costs = await sql`
      SELECT value FROM operational_costs
      WHERE client_slug = ${clientId} AND month = ${month} AND year = ${year}
    `
    operationalCosts = (costs || []).reduce(
      (sum: number, c: { value: number }) => sum + (Number(c.value) || 0),
      0
    )
  } catch (error) {
    console.error("Error fetching operational costs total:", error)
  }

  try {
    const rows = await sql`
      SELECT data_compra, valor_reembolsado FROM refunds
      WHERE client_slug = ${clientId}
    `
    for (const r of rows || []) {
      const my = extractMonthYear(r.data_compra)
      if (my && my.month === month && my.year === year) {
        refunds += parseMoney(r.valor_reembolsado)
      }
    }
  } catch (error) {
    console.error("Error fetching refunds total:", error)
  }

  return { operationalCosts, refunds }
}
