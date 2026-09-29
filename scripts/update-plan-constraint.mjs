// Script para atualizar o constraint de planos na base de dados Neon
// Executar com: node --env-file-if-exists=/vercel/share/.env.project scripts/update-plan-constraint.mjs

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function updatePlanConstraint() {
  console.log("Removendo constraint antigo...")
  
  try {
    await sql`ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_plan_check`
    console.log("Constraint antigo removido.")
  } catch (error) {
    console.log("Constraint antigo não existia ou já foi removido.")
  }
  
  console.log("Adicionando novo constraint com SCALE_VERTEBRA e SCALE_GLOBAL...")
  
  try {
    await sql`ALTER TABLE clients ADD CONSTRAINT clients_plan_check CHECK (plan IN ('START', 'PRO', 'SCALE', 'SCALE_VERTEBRA', 'SCALE_GLOBAL'))`
    console.log("Novo constraint adicionado com sucesso!")
  } catch (error) {
    console.error("Erro ao adicionar constraint:", error.message)
  }
}

updatePlanConstraint()
