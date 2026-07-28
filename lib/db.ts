import { neon } from "@neondatabase/serverless"
import { cache } from "react"

export const sql = neon(process.env.DATABASE_URL!)

// Deduplicado por request: layout e página buscam o mesmo cliente uma só vez.
export const getClientBySlugCached = cache(async (slug: string) => {
  try {
    const result = await sql`
      SELECT * FROM clients WHERE slug = ${slug}
    `
    return result[0] || null
  } catch {
    return null
  }
})

// Types
export type UserRole = string
export type ClientPlan = "START" | "PRO" | "SCALE" | "SCALE_VERTEBRA" | "SCALE_GLOBAL"
export type ClientStatus = "ACTIVE" | "PAUSED" | "ONBOARDING"

export interface Client {
  id: string
  name: string
  slug: string
  plan: ClientPlan
  status: ClientStatus
  drive_link: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: UserRole
  client_id: string | null
  created_at: string
  updated_at: string
}

export interface Access {
  id: string
  client_id: string
  service_name: string
  service_url: string | null
  login: string
  password: string
  created_at: string
  updated_at: string
}

export interface Notice {
  id: string
  client_id: string
  title: string
  message: string
  created_at: string
}

// Helper to get user with client info
export interface UserWithClient extends User {
  client?: Client
}
