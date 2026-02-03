import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const ALLOWED_ROLES = new Set(["ADMIN", "CLIENTE", "NEXUS_GROWTH", "Nexus Growth"] as const)
type AllowedRole = "ADMIN" | "CLIENTE" | "NEXUS_GROWTH" | "Nexus Growth"

function normalizeRoleOrNull(input: unknown): AllowedRole | null {
  if (typeof input !== "string") return null

  const raw = input.trim()

  const map: Record<string, AllowedRole> = {
    Admin: "ADMIN",
    ADMIN: "ADMIN",
    Administrador: "ADMIN",
    Cliente: "CLIENTE",
    CLIENTE: "CLIENTE",
    NEXUS_GROWTH: "NEXUS_GROWTH",
    nexus_growth: "NEXUS_GROWTH",
    "Nexus Growth": "Nexus Growth",
    "nexus growth": "Nexus Growth",
  }

  const mapped = map[raw]
  if (mapped && ALLOWED_ROLES.has(mapped)) return mapped

  const upper = raw.toUpperCase().replace(/\s+/g, "_")
  if (ALLOWED_ROLES.has(upper as AllowedRole)) return upper as AllowedRole

  return null
}

function normalizeRole(input: unknown): AllowedRole {
  const role = normalizeRoleOrNull(input)
  if (!role) throw new Error(`Invalid role "${String(input)}"`)
  return role
}

export async function GET() {
  const session = await getSession()
  const sessionRole = normalizeRoleOrNull(session?.role)

  // ADMIN e Nexus Growth podem ver
  const canView = sessionRole === "ADMIN" || sessionRole === "NEXUS_GROWTH" || sessionRole === "Nexus Growth"
  if (!session || !canView) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await sql`
      SELECT id, client_id, name, email, role, avatar_url, created_at
      FROM users
      ORDER BY created_at DESC
    `
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()

  // Only ADMIN can create users
  const sessionRole = normalizeRoleOrNull(session?.role)
  if (!session || sessionRole !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const { client_id, name, email, password } = body
  const userRole = normalizeRole(body.role) // ✅ SEMPRE normalizado (ADMIN/CLIENTE/...)

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Preencha todos os campos obrigatorios" }, { status: 400 })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalido" }, { status: 400 })
  }

  // Validate password length
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "A senha deve ter no minimo 6 caracteres" }, { status: 400 })
  }

  // Roles que não precisam de client
  const rolesWithoutClient: AllowedRole[] = ["ADMIN", "NEXUS_GROWTH", "Nexus Growth"]
  const isRoleWithoutClient = rolesWithoutClient.includes(userRole)
  const userClientId = isRoleWithoutClient ? null : (client_id ?? null)

  // Se precisa de client, obrigar client_id
  if (!isRoleWithoutClient && !userClientId) {
    return NextResponse.json({ error: "client_id é obrigatório para essa role" }, { status: 400 })
  }

  try {
    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este email ja esta em uso" }, { status: 400 })
    }

    // role_id baseado no role normalizado
    const roleResult = await sql`SELECT id FROM roles WHERE name = ${userRole}`
    const roleId = roleResult.length > 0 ? roleResult[0].id : null

    const password_hash = await bcrypt.hash(password, 10)

    const result = await sql`
      INSERT INTO users (client_id, name, email, password_hash, role, role_id)
      VALUES (${userClientId}, ${name}, ${email}, ${password_hash}, ${userRole}::user_role, ${roleId})
      RETURNING id, client_id, name, email, role, role_id, created_at
    `

    return NextResponse.json({ user: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Falha ao criar usuario" }, { status: 500 })
  }
}