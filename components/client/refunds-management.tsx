"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Loader2, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getRefunds, saveAllRefunds, type RefundData } from "@/app/actions/refunds"

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



interface RefundsManagementProps {
  clientId: string
  initialData?: (RefundData & { id: string })[]
  isGlobal?: boolean
}

const mapRefunds = (data: (RefundData & { id: string })[]): Refund[] =>
  data.map((r) => ({
    id: r.id,
    idReembolso: r.id_reembolso || "",
    dataCompra: r.data_compra || "",
    nomeCliente: r.nome_cliente || "",
    email: r.email || "",
    numEncomenda: r.num_encomenda || "",
    nomePeca: r.nome_peca || "",
    tamanho: r.tamanho || "",
    precoPago: r.preco_pago || "",
    motivoDevolucao: r.motivo_devolucao || "",
    tipoResolucao: r.tipo_resolucao || "",
    valorReembolsado: r.valor_reembolsado || "",
    estado: r.estado || "Pendente",
  }))

export function RefundsManagement({ clientId, initialData = [], isGlobal = true }: RefundsManagementProps) {
  // Símbolo da moeda: € (global) ou R$ (nacional).
  const currencySymbol = isGlobal ? "€" : "R$"
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  // Dados já vêm prontos do servidor: renderiza imediatamente, sem spinner.
  const [refunds, setRefunds] = useState<Refund[]>(() => mapRefunds(initialData))
  const [saveMessage, setSaveMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Save to database
  const saveToDatabase = () => {
    startTransition(async () => {
      const refundsToSave: RefundData[] = refunds.map(r => ({
        client_slug: clientId,
        id_reembolso: r.idReembolso,
        data_compra: r.dataCompra,
        nome_cliente: r.nomeCliente,
        email: r.email,
        num_encomenda: r.numEncomenda,
        nome_peca: r.nomePeca,
        tamanho: r.tamanho,
        preco_pago: r.precoPago,
        motivo_devolucao: r.motivoDevolucao,
        tipo_resolucao: r.tipoResolucao,
        valor_reembolsado: r.valorReembolsado,
        estado: r.estado
      }))
      
      const result = await saveAllRefunds(clientId, refundsToSave)
      
      if (result.success) {
        setSaveMessage("Salvo!")
        setTimeout(() => setSaveMessage(""), 2000)
        // Reload to get the new IDs
        const data = await getRefunds(clientId)
        setRefunds(mapRefunds(data as (RefundData & { id: string })[]))
      } else {
        setSaveMessage("Erro!")
        setTimeout(() => setSaveMessage(""), 2000)
      }
    })
  }

  const addNewRow = () => {
    const nextId = refunds.length + 1
    const today = new Date()
    // Use selected month instead of current month
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(selectedMonth + 1).padStart(2, '0')
    const year = today.getFullYear()
    const dateStr = `${day}/${month}/${year}`
    const newRefund: Refund = {
      id: String(Date.now()),
      idReembolso: `REM-${String(nextId).padStart(3, '0')}`,
      dataCompra: dateStr,
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

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const deleteSelected = () => {
    if (selectedIds.size === 0) return
    setRefunds(refunds.filter(r => !selectedIds.has(r.id)))
    setSelectedIds(new Set())
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Resolvido": return "text-emerald-400"
      case "Negado": return "text-red-400"
      case "Em análise": return "text-amber-400"
      default: return "text-[rgba(245,245,247,0.72)]"
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
    <div className="flex flex-col gap-4 h-[calc(100vh-180px)]">
        {/* Stats Bar */}
        <div className="flex gap-3">
          <div className="flex-1 bg-[#1a2744] rounded-xl p-4">
            <p className="text-white text-2xl font-bold">{totalReembolsos}</p>
            <p className="text-[rgba(245,245,247,0.52)] text-xs mt-1">Total Reembolsos</p>
          </div>
          <div className="flex-1 bg-[#1a2744] rounded-xl p-4">
            <p className="text-white text-2xl font-bold">{isGlobal ? `${totalReembolsado.toFixed(2)} €` : `R$ ${totalReembolsado.toFixed(2)}`}</p>
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
                  onClick={saveToDatabase}
                  disabled={isPending}
                  size="sm"
                  className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white h-7 px-3"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  {saveMessage || "Salvar"}
                </Button>
                <Button
                  onClick={deleteSelected}
                  disabled={selectedIds.size === 0}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:opacity-50 text-white h-7 px-3"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Deletar ({selectedIds.size})
                </Button>
              </div>
            </div>
          </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="overflow-auto h-full">
            <div className="min-w-max">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#1a2744] text-white text-xs font-medium">
                    <th className="px-3 py-3 text-center w-10"></th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">ID Reembolso</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Data Compra</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Nome da Cliente</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">E-mail</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Nº Encomenda</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Nome da Peça</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Tamanho</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Preço Pago ({currencySymbol})</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Motivo Devolução</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Tipo Resolução</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Valor Reembolsado ({currencySymbol})</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund, index) => (
                    <tr 
                      key={refund.id} 
                      className={`${index % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#101018]"} ${selectedIds.has(refund.id) ? "bg-red-900/20" : ""}`}
                    >
                      <td className="px-3 py-2 text-center">
                        <Checkbox
                          checked={selectedIds.has(refund.id)}
                          onCheckedChange={() => toggleSelect(refund.id)}
                          className="border-[rgba(255,255,255,0.3)] data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                        />
                      </td>
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
                          <span className="absolute left-2 text-[rgba(255,255,255,0.5)] text-sm">{currencySymbol}</span>
                          <Input
                            value={refund.precoPago}
                            onChange={(e) => updateRefund(refund.id, "precoPago", e.target.value)}
                            className={`bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-24 ${isGlobal ? 'pl-6' : 'pl-9'}`}
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
                          <span className="absolute left-2 text-[rgba(255,255,255,0.5)] text-sm">{currencySymbol}</span>
                          <Input
                            value={refund.valorReembolsado}
                            onChange={(e) => updateRefund(refund.id, "valorReembolsado", e.target.value)}
                            className={`bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-8 text-sm w-28 ${isGlobal ? 'pl-6' : 'pl-9'}`}
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
          </div>
        </CardContent>
        </Card>
        
        {/* Month tabs */}
        <div className="p-4 bg-[#101018] border border-[rgba(255,255,255,0.06)] rounded-xl">
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
    </div>
  )
}
