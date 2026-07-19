"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ShoppingBag, Megaphone, CheckCircle2, RefreshCw, Loader2, Plug } from "lucide-react"
import {
  connectProvider,
  disconnectProvider,
  syncConnections,
  type ClientConnection,
  type ConnectionProvider,
} from "@/app/actions/connections"

interface ConnectionsManagerProps {
  clientId: string
  slug: string
  initialConnections: ClientConnection[]
}

interface ProviderConfig {
  provider: ConnectionProvider
  name: string
  description: string
  icon: typeof ShoppingBag
  accentColor: string
  bgColor: string
}

const PROVIDERS: ProviderConfig[] = [
  {
    provider: "shopify",
    name: "Shopify",
    description:
      "Sincroniza automaticamente as vendas da sua loja para a planilha de Operação.",
    icon: ShoppingBag,
    accentColor: "#95BF47",
    bgColor: "rgba(149,191,71,0.12)",
  },
  {
    provider: "meta_ads",
    name: "Meta Ads",
    description:
      "Importa o investimento em tráfego (adspend) das suas campanhas do Facebook e Instagram.",
    icon: Megaphone,
    accentColor: "#3B82F6",
    bgColor: "rgba(59,130,246,0.12)",
  },
]

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr))
  } catch {
    return null
  }
}

export function ConnectionsManager({ clientId, slug, initialConnections }: ConnectionsManagerProps) {
  const { toast } = useToast()
  const [connections, setConnections] = useState<ClientConnection[]>(initialConnections)
  const [loadingProvider, setLoadingProvider] = useState<ConnectionProvider | null>(null)
  const [isSyncing, startSync] = useTransition()

  const getConnection = (provider: ConnectionProvider) =>
    connections.find((c) => c.provider === provider)

  const hasAnyConnected = connections.some((c) => c.status === "connected")

  const handleConnect = async (provider: ConnectionProvider) => {
    setLoadingProvider(provider)

    // Fluxo OAuth oficial: abre a janela de autorização do provedor.
    // Enquanto as credenciais reais dos apps (Shopify/Meta) não estão
    // configuradas, registramos a intenção de conexão para preparar o vínculo.
    const result = await connectProvider(clientId, provider, {
      slug,
      accountName: provider === "shopify" ? "Loja Shopify" : "Conta Meta Ads",
    })

    if (result.success) {
      setConnections((prev) => {
        const existing = prev.find((c) => c.provider === provider)
        const updated: ClientConnection = {
          id: existing?.id || crypto.randomUUID(),
          client_id: clientId,
          provider,
          status: "connected",
          account_name: provider === "shopify" ? "Loja Shopify" : "Conta Meta Ads",
          account_id: existing?.account_id || null,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        return existing
          ? prev.map((c) => (c.provider === provider ? updated : c))
          : [...prev, updated]
      })
      toast({
        title: "Conexão registrada",
        description:
          "A autorização oficial será finalizada assim que as credenciais do app estiverem ativas.",
      })
    } else {
      toast({ title: "Erro", description: result.error, variant: "destructive" })
    }
    setLoadingProvider(null)
  }

  const handleDisconnect = async (provider: ConnectionProvider) => {
    setLoadingProvider(provider)
    const result = await disconnectProvider(clientId, provider, slug)
    if (result.success) {
      setConnections((prev) =>
        prev.map((c) =>
          c.provider === provider ? { ...c, status: "disconnected", account_name: c.account_name } : c
        )
      )
      toast({ title: "Desconectado", description: "A conexão foi removida." })
    } else {
      toast({ title: "Erro", description: result.error, variant: "destructive" })
    }
    setLoadingProvider(null)
  }

  const handleSync = () => {
    startSync(async () => {
      const result = await syncConnections(clientId, slug)
      if (result.success) {
        setConnections((prev) =>
          prev.map((c) =>
            c.status === "connected" ? { ...c, last_synced_at: result.syncedAt || null } : c
          )
        )
        toast({
          title: "Sincronização concluída",
          description: "Os dados das contas conectadas foram atualizados.",
        })
      } else {
        toast({ title: "Erro", description: result.error, variant: "destructive" })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Botão global de atualização */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-[rgba(245,245,247,0.52)]">
          {hasAnyConnected
            ? "Suas contas conectadas sincronizam automaticamente. Você também pode atualizar manualmente."
            : "Conecte pelo menos uma conta para habilitar a sincronização."}
        </p>
        <Button
          onClick={handleSync}
          disabled={!hasAnyConnected || isSyncing}
          className="bg-[#7B2FBE] hover:bg-[#6A28A6] text-white rounded-xl"
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Atualizar agora
        </Button>
      </div>

      {/* Cards dos provedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROVIDERS.map((config) => {
          const connection = getConnection(config.provider)
          const isConnected = connection?.status === "connected"
          const isLoading = loadingProvider === config.provider
          const Icon = config.icon
          const lastSync = formatDate(connection?.last_synced_at ?? null)

          return (
            <Card
              key={config.provider}
              className="flex flex-col bg-[#0E0E1C] border border-[rgba(255,255,255,0.06)] rounded-2xl"
            >
              <CardHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: config.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: config.accentColor }} />
                  </div>
                  {isConnected ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Conectado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[rgba(245,245,247,0.52)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5 rounded-full">
                      <Plug className="w-3.5 h-3.5" />
                      Desconectado
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-[#F5F5F7] mt-4">{config.name}</h2>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 p-6 pt-3">
                <p className="text-sm text-[rgba(245,245,247,0.62)] leading-relaxed flex-1">
                  {config.description}
                </p>

                {isConnected && connection?.account_name && (
                  <div className="mt-4 p-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                    <p className="text-xs text-[rgba(245,245,247,0.52)]">Conta conectada</p>
                    <p className="text-sm font-medium text-[#F5F5F7] mt-0.5">
                      {connection.account_name}
                    </p>
                    {lastSync && (
                      <p className="text-xs text-[rgba(245,245,247,0.42)] mt-1">
                        Última sincronização: {lastSync}
                      </p>
                    )}
                  </div>
                )}

                {isConnected ? (
                  <Button
                    onClick={() => handleDisconnect(config.provider)}
                    disabled={isLoading}
                    variant="outline"
                    className="mt-4 w-full border-[rgba(255,255,255,0.12)] bg-transparent text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.06)] rounded-xl"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Desconectar
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(config.provider)}
                    disabled={isLoading}
                    className="mt-4 w-full text-white font-medium rounded-xl"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plug className="w-4 h-4 mr-2" />
                    )}
                    Conectar {config.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
