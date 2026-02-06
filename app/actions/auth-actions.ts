"use server"

import { authenticateUser, getSession, destroySession, hashPassword } from "@/lib/auth"
import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function login(email: string, password: string) {
  const user = await authenticateUser(email, password)
  if (!user) {
    return { error: "Credenciais invalidas" }
  }
  const { createSession } = await import("@/lib/auth")
  await createSession(user.id)
  return { success: true, role: user.role, clientSlug: user.client_slug }
}

export async function logout() {
  await destroySession()
  redirect("/")
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: string
  client_id?: string | null
}) {
  const session = await getSession()
  if (!session || (session.role !== "admin" && session.role !== "nexus_growth")) {
    return { error: "Sem permissao" }
  }

  const passwordHash = await hashPassword(data.password)

  try {
    await sql`
      INSERT INTO users (id, name, email, password_hash, role, client_id)
      VALUES (gen_random_uuid(), ${data.name}, ${data.email}, ${passwordHash}, ${data.role}, ${data.client_id || null})
    `
    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error: any) {
    if (error?.message?.includes("unique")) {
      return { error: "Email ja cadastrado" }
    }
    return { error: "Erro ao criar usuario" }
  }
}

export async function initializeAdminUser() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return { error: "Sem permissao" }
  }
  return { success: true, message: "Admin ja inicializado" }
}
