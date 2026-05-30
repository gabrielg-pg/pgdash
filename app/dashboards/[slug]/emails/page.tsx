import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { EmailsTemplates } from "@/components/client/emails-templates"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EmailsPage({ params }: PageProps) {
  const { slug } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Get client data
  const clients = await sql`
    SELECT id, name, slug, plan FROM clients WHERE slug = ${slug}
  `

  if (clients.length === 0) {
    redirect("/login")
  }

  const client = clients[0]

  // Check if client has SCALE plan
  if (client.plan?.toUpperCase() !== "SCALE") {
    redirect(`/dashboards/${slug}`)
  }

  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">E-mails</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Templates de respostas para e-mails e redes sociais
        </p>
      </div>

      <EmailsTemplates clientId={client.id} />
    </div>
  )
}
