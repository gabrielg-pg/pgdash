// Script para atualizar o ENUM de planos na base de dados Neon
// Executar com: node --env-file-if-exists=/vercel/share/.env.project scripts/update-plan-enum.mjs

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function updatePlanEnum() {
  console.log("Adicionando novos valores ao ENUM client_plan...")
  
  try {
    // Adicionar SCALE_VERTEBRA ao enum
    await sql`ALTER TYPE client_plan ADD VALUE IF NOT EXISTS 'SCALE_VERTEBRA'`
    console.log("SCALE_VERTEBRA adicionado ao enum.")
  } catch (error) {
    console.log("SCALE_VERTEBRA já existe ou erro:", error.message)
  }
  
  try {
    // Adicionar SCALE_GLOBAL ao enum
    await sql`ALTER TYPE client_plan ADD VALUE IF NOT EXISTS 'SCALE_GLOBAL'`
    console.log("SCALE_GLOBAL adicionado ao enum.")
  } catch (error) {
    console.log("SCALE_GLOBAL já existe ou erro:", error.message)
  }
  
  console.log("Concluído!")
}

updatePlanEnum()
