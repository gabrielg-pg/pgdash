"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Save, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Refund {
  id: string
  idReembolso: string
  dataCompra: string
  nomeCliente: string
  email: string
  numEncomenda: string
  nomePeca: string
  tamanho: string
  precoPago: string
  motivoDevolucao: string
  tipoResolucao: string
  valorReembolsado: string
  estado: string
}

const MONTHS = [
  { value: 0, label: "Janeiro" },
  { value: 1, label: "Fevereiro" },
  { value: 2, label: "Março" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Maio" },
  { value: 5, label: "Junho" },
  { value: 6, label: "Julho" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Setembro" },
  { value: 9, label: "Outubro" },
  { value: 10, label: "Novembro" },
  { value: 11, label: "Dezembro" },
]

const motivosOptions = [
  "Defeito comprovado",
  "Artigo incorreto",
  "Tamanho errado (loja)",
  "Tamanho errado (cliente)",
  "Mudança de ideia",
  "Artigo em promoção",
  "Pedido fora do prazo",
  "Encomenda atrasada",
  "Marcada entregue — nega",
  "Ameaça legal",
  "Ameaça redes sociais"
]

const tiposResolucaoOptions = [
  "Reembolso",
  "Reenvio gratuito",
  "Troca",
  "Negado",
  "Voucher",
  "Investigar",
  "Jurídico"
]

const estadosOptions = [
  "Pendente",
  "Em análise",
  "Resolvido",
  "Negado"
]

const criteriosElegibilidade = [
  { situacao: "Defeito comprovado", decisao: "REEMBOLSO/REENVIO", status: "approved", icon: CheckCircle2 },
  { situacao: "Artigo incorreto", decisao: "REENVIO GRATUITO", status: "approved", icon: CheckCircle2 },
  { situacao: "Tamanho errado (loja)", decisao: "REEMBOLSO/TROCA", status: "approved", icon: CheckCircle2 },
  { situacao: "Tamanho errado (cliente)", decisao: "NEGADO + voucher", status: "denied", icon: XCircle },
  { situacao: "Mudança de ideia", decisao: "NEGADO", status: "denied", icon: XCircle },
  { situacao: "Artigo em promoção", decisao: "NEGADO", status: "denied", icon: XCircle },
  { situacao: "Pedido fora do prazo", decisao: "NEGADO", status: "denied", icon: XCircle },
  { situacao: "Encomenda atrasada", decisao: "INVESTIGAR", status: "pending", icon: Clock },
  { situacao: "Marcada entregue nega", decisao: "VERIFICAR transportadora", status: "pending", icon: Clock },
  { situacao: "Ameaça legal", decisao: "JURÍDICO", status: "neutral", icon: AlertTriangle },
  { situacao: "Ameaça redes sociais", decisao: "CALMA E FIRMEZA", status: "neutral", icon: AlertTriangle },
]

const instrucoesPreenchimento = [
  { campo: "ID Reembolso", descricao: "Número sequencial", exemplo: "REM-001" },
  { campo: "Datas", descricao: "Formato DD/MM/AAAA", exemplo: "15/04/2026" },
  { campo: "Motivo", descricao: "Escolher da lista", exemplo: "Tamanho errado" },
  { campo: "Tipo Resolução", descricao: "Escolher da lista", exemplo: "Reenvio gratuito" },
]

interface RefundsManagementProps {
  clientId: string
}

export function RefundsManagement({ clientId }: RefundsManagementProps) {
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [refunds, setRefunds] = useState<Refund[]>([])
  const { toast } = useToast()

  const STORAGE_KEY = `refunds_${clientId}`

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRefunds(parsed)
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [STORAGE_KEY])

  // Save to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(refunds))
    toast({
      title: "Salvo com sucesso",
      description: `${refunds.length} registro(s) salvo(s).`
    })
  }

  const addNewRow = () => {
    const nextId = refunds.length + 1
    const today = new Date()
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
    const newRefund: Refund = {
      id: String(Date.now()),
      idReembolso: `REM-${String(nextId).padStart(3, '0')}`,
      dataCompra: todayStr,
      nomeCliente: "",
      email: "",
      numEncomenda: "",
      nomePeca: "",
      tamanho: "",
      precoPago: "",
      motivoDevolucao: "",
      tipoResolucao: "",
      valorReembolsado: "",
      estado: "Pendente"
    }
    setRefunds([...refunds, newRefund])
  }

  // Filter refunds by selected month
  const filteredRefunds = refunds.filter(r => {
    if (!r.dataCompra) return selectedMonth === currentMonth
    const parts = r.dataCompra.split('/')
    if (parts.length !== 3) return false
    const month = parseInt(parts[1], 10) - 1
    return month === selectedMonth
  })

  const updateRefund = (id: string, field: keyof Refund, value: string) => {
    setRefunds(refunds.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Resolvido": return "text-emerald-400"
      case "Negado": return "text-red-400"
      case "Em análise": return "text-amber-400"
      default: return "text-[rgba(245,245,247,0.72)]"
    }
  }

  const getCriterioColor = (status: string) => {
    switch (status) {
      case "approved": return "text-emerald-400"
      case "denied": return "text-red-400"
      case "pending": return "text-amber-400"
      default: return "text-[rgba(245,245,247,0.52)]"
    }
  }

  // Calculate stats from filtered refunds
  const totalReembolsos = filteredRefunds.length
  const totalReembolsado = filteredRefunds.reduce((sum, r) => {
    const val = parseFloat(r.valorReembolsado) || 0
    return sum + val
  }, 0)
  const pendentes = filteredRefunds.filter(r => r.estado === "Pendente").length
  const resolvidos = filteredRefunds.filter(r => r.estado === "Resolvido").length
  const negados = filteredRefunds.filter(r => r.estado === "Negado").length

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* LEFT PANEL - Main refunds table */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Stats Bar */}
        <div className="flex gap-3">
          <div className="flex-1 bg-[#1a2744] rounded-xl p-4">
            <p className="text-white text-2xl font-bold">{totalReembolsos}</p>
            <p className="text-[rgba(245,245,247,0.52)] text-xs mt-1">Total Reembolsos</p>
          </div>
          <div className="flex-1 bg-[#1a2744] rounded-xl p-4">
            <p className="text-white text-2xl font-bold">{totalReembolsado.toFixed(2)} €</p>
            <p className="text-[rgba(245,245,247,0.52)] text-xs mt-1">Total Reembolsado</p>
          </div>
          <div className="flex-1 bg-[#1a2744] rounded-xl p-4">
            <p className="text-amber-400 text-2xl font-bold">{pendentes}</p>
            <p className="text-[rgba(245,245,247,0.52)] text-xs mt-1">Pendentes</p>
          </div>
          <div className="flex-1 bg-[#1a2744] rounded-xl p-4">
            <p className="text-emerald-400 text-2xl font-bold">{resolvidos}</p>
            <p className="text-[rgba(245,245,247,0.52)] text-xs mt-1">Resolvidos</p>
          </div>
          <div className="flex-1 bg-[#1a2744] rounded-xl p-4">
            <p className="text-red-400 text-2xl font-bold">{negados}</p>
            <p className="text-[rgba(245,245,247,0.52)] text-xs mt-1">Negados</p>
          </div>
        </div>

        <Card className="flex-1 bg-[#101018] border-[rgba(255,255,255,0.06)] overflow-hidden flex flex-col">
          <CardHeader className="bg-[#1a2744] py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm font-semibold">Tabela de Reembolsos</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={addNewRow}
                  size="sm"
                  className="bg-[#A855F7] hover:bg-[#9333EA] text-white h-7 w-7 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={saveToLocalStorage}
                  size="sm"
                  className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white h-7 px-3"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1550px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#1a2744] text-white text-xs font-medium">
                    <th className="px-3 py-3 text-left whitespace-nowrap">ID Reembolso</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Data Compra</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Nome da Cliente</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">E-mail</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Nº Encomenda</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Nome da Peça</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Tamanho</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Preço Pago (€)</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Motivo Devolução</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Tipo Resolução</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Valor Reembolsado (€)</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund, index) => (
                    <tr 
                      key={refund.id} 
                      className={index % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#101018]"}
                    >
                      <td className="px-3 py-2">
                        <Input
                          value={refund.idReembolso}
                          onChange={(e) => updateRefund(refund.id, "idReembolso", e.target.value)}
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-24"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={refund.dataCompra}
                          onChange={(e) => updateRefund(refund.id, "dataCompra", e.target.value)}
                          placeholder="DD/MM/AAAA"
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-28"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={refund.nomeCliente}
                          onChange={(e) => updateRefund(refund.id, "nomeCliente", e.target.value)}
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-32"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={refund.email}
                          onChange={(e) => updateRefund(refund.id, "email", e.target.value)}
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-40"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={refund.numEncomenda}
                          onChange={(e) => updateRefund(refund.id, "numEncomenda", e.target.value)}
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-28"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={refund.nomePeca}
                          onChange={(e) => updateRefund(refund.id, "nomePeca", e.target.value)}
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-32"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={refund.tamanho}
                          onChange={(e) => updateRefund(refund.id, "tamanho", e.target.value)}
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-16 text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-[rgba(255,255,255,0.5)] text-sm">€</span>
                          <Input
                            value={refund.precoPago}
                            onChange={(e) => updateRefund(refund.id, "precoPago", e.target.value)}
                            className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-24 pl-6"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Select
                          value={refund.motivoDevolucao}
                          onValueChange={(value) => updateRefund(refund.id, "motivoDevolucao", value)}
                        >
                          <SelectTrigger className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-44">
                            <SelectValue placeholder="Selecionar..." />
                          </SelectTrigger>
                          <SelectContent className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
                            {motivosOptions.map((motivo) => (
                              <SelectItem key={motivo} value={motivo} className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">
                                {motivo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2">
                        <Select
                          value={refund.tipoResolucao}
                          onValueChange={(value) => updateRefund(refund.id, "tipoResolucao", value)}
                        >
                          <SelectTrigger className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-36">
                            <SelectValue placeholder="Selecionar..." />
                          </SelectTrigger>
                          <SelectContent className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
                            {tiposResolucaoOptions.map((tipo) => (
                              <SelectItem key={tipo} value={tipo} className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-[rgba(255,255,255,0.5)] text-sm">€</span>
                          <Input
                            value={refund.valorReembolsado}
                            onChange={(e) => updateRefund(refund.id, "valorReembolsado", e.target.value)}
                            className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-28 pl-6"
                            placeholder="0.00"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Select
                          value={refund.estado}
                          onValueChange={(value) => updateRefund(refund.id, "estado", value)}
                        >
                          <SelectTrigger className={`bg-transparent border-[rgba(255,255,255,0.1)] h-8 text-sm w-28 ${getEstadoColor(refund.estado)}`}>
                            <SelectValue placeholder="Selecionar..." />
                          </SelectTrigger>
                          <SelectContent className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
                            {estadosOptions.map((estado) => (
                              <SelectItem key={estado} value={estado} className="text-[rgba(245,245,247,0.72)] focus:text-[#F5F5F7] focus:bg-[#141424]">
                                {estado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
        
        {/* Month tabs */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-wrap gap-2">
            {MONTHS.map((month) => (
              <Button
                key={month.value}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMonth(month.value)}
                className={selectedMonth === month.value
                  ? "bg-[#7B3FE4] hover:bg-[#6D28D9] text-white border border-[#7B3FE4]"
                  : "bg-transparent border border-[rgba(255,255,255,0.2)] text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.3)]"
                }
              >
                {month.label}
              </Button>
            ))}
          </div>
        </div>
        </Card>
      </div>

      {/* RIGHT PANEL - Support reference */}
      <div className="w-80 flex flex-col gap-4 shrink-0">
        {/* Instruções de Preenchimento */}
        <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
          <CardHeader className="py-3 px-4 bg-[#1a2744]">
            <CardTitle className="text-white text-xs font-semibold uppercase tracking-wider">
              Instruções de Preenchimento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[rgba(245,245,247,0.52)] border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left py-1.5 font-medium">Campo</th>
                  <th className="text-left py-1.5 font-medium">Descrição</th>
                  <th className="text-left py-1.5 font-medium">Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {instrucoesPreenchimento.map((item, index) => (
                  <tr key={index} className="text-[rgba(245,245,247,0.72)] border-b border-[rgba(255,255,255,0.03)]">
                    <td className="py-1.5 text-[#F5F5F7]">{item.campo}</td>
                    <td className="py-1.5">{item.descricao}</td>
                    <td className="py-1.5 text-[#A855F7]">{item.exemplo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Critérios de Elegibilidade */}
        <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)] flex-1">
          <CardHeader className="py-3 px-4 bg-[#1a2744]">
            <CardTitle className="text-white text-xs font-semibold uppercase tracking-wider">
              Critérios de Elegibilidade
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea className="h-[200px]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[rgba(245,245,247,0.52)] border-b border-[rgba(255,255,255,0.06)]">
                    <th className="text-left py-1.5 font-medium">Situação</th>
                    <th className="text-left py-1.5 font-medium">Decisão</th>
                  </tr>
                </thead>
                <tbody>
                  {criteriosElegibilidade.map((item, index) => (
                    <tr key={index} className="border-b border-[rgba(255,255,255,0.03)]">
                      <td className="py-1.5 text-[rgba(245,245,247,0.72)]">{item.situacao}</td>
                      <td className={`py-1.5 font-medium flex items-center gap-1 ${getCriterioColor(item.status)}`}>
                        <item.icon className="h-3 w-3" />
                        {item.decisao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* O que é um Bundle? */}
        <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
          <CardHeader className="py-3 px-4 bg-[#1a2744]">
            <CardTitle className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <Info className="h-3 w-3" />
              O que é um Bundle?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <p className="text-xs text-[rgba(245,245,247,0.72)] leading-relaxed">
              <strong className="text-[#F5F5F7]">Bundle</strong> = conjunto de peças vendidas juntas com desconto. 
              No reembolso: só se reembolsa a peça com defeito, não o conjunto. 
              <span className="text-amber-400"> Se devolver 1 peça: perde o desconto proporcional.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
