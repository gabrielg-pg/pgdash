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

type UpdateUserBody = {
  name?: string
  email?: string
  password?: string
  role?: unknown
  client_id?: string | null
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  // 🔒 Somente ADMIN pode editar (aceita "Administrador" como ADMIN)
  const sessionRole = normalizeRoleOrNull(session?.role)
  if (!session || sessionRole !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as UpdateUserBody

  const name = body.name?.trim()
  const email = body.email?.trim()
  const password = body.password
  const role = normalizeRole(body.role)

  if (!name || !email) {
    return NextResponse.json({ error: "Nome e email sao obrigatorios" }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalido" }, { status: 400 })
  }

  if (password && password.length < 6) {
    return NextResponse.json({ error: "A senha deve ter no minimo 6 caracteres" }, { status: 400 })
  }

  try {
    // email não pode repetir em outro user
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email} AND id <> ${id}
    `
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este email ja esta em uso" }, { status: 400 })
    }

    // role_id baseado no role normalizado
    const roleResult = await sql`SELECT id FROM roles WHERE name = ${role}`
    const roleId = roleResult.length > 0 ? roleResult[0].id : null

    // roles que não precisam client
    const rolesWithoutClient: AllowedRole[] = ["ADMIN", "NEXUS_GROWTH", "Nexus Growth"]
    const userClientId = rolesWithoutClient.includes(role) ? null : (body.client_id ?? null)

    let result

    if (password) {
      const password_hash = await bcrypt.hash(password, 10)
      result = await sql`
        UPDATE users
        SET
          name = ${name},
          email = ${email},
          password_hash = ${password_hash},
          role = ${role}::user_role,
          role_id = ${roleId},
          client_id = ${userClientId},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, client_id, name, email, role, role_id, created_at, updated_at
      `
    } else {
      result = await sql`
        UPDATE users
        SET
          name = ${name},
          email = ${email},
          role = ${role}::user_role,
          role_id = ${roleId},
          client_id = ${userClientId},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, client_id, name, email, role, role_id, created_at, updated_at
      `
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Falha ao atualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  const sessionRole = normalizeRoleOrNull(session?.role)
  if (!session || sessionRole !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // (opcional) impedir deletar a si mesmo, caso exista session.id
    if ((session as any)?.id && (session as any).id === id) {
      return NextResponse.json({ error: "Voce nao pode excluir sua propria conta" }, { status: 400 })
    }

    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Falha ao excluir usuario" }, { status: 500 })
  }
}
