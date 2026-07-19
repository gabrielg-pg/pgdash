"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, X, Loader2 } from "lucide-react"
import { getOperationalCosts, saveOperationalCosts } from "@/app/actions/operational-costs"

interface CostItem {
  id: string
  service: string
  currency: string
  value: string
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const CURRENCIES = [
  { code: "BRL", symbol: "R$" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
]

interface InitialCost {
  id: string
  service: string
  currency: string
  value: number
  month?: number
}

interface OperationalCostsProps {
  clientId: string
  initialData?: InitialCost[]
  initialMonth?: number
  initialYear?: number
  isGlobal?: boolean
}

const mapCosts = (data: InitialCost[]): CostItem[] =>
  data.map((item) => ({
    id: item.id,
    service: item.service,
    currency: item.currency,
    value: String(item.value),
  }))

// Agrupa os custos do ano por mês (índice 0-11).
const groupByMonth = (data: InitialCost[]): Record<number, CostItem[]> => {
  const grouped: Record<number, CostItem[]> = {}
  for (const item of data) {
    const monthIndex = (item.month ?? 1) - 1
    if (!grouped[monthIndex]) grouped[monthIndex] = []
    grouped[monthIndex].push({
      id: item.id,
      service: item.service,
      currency: item.currency,
      value: String(item.value),
    })
  }
  return grouped
}

export function OperationalCosts({
  clientId,
  initialData = [],
  initialMonth,
  initialYear,
  isGlobal = true,
}: OperationalCostsProps) {
  const currentYear = initialYear ?? new Date().getFullYear()
  // initialMonth chega em 1-12; o estado interno usa 0-11
  const startMonth = initialMonth ? initialMonth - 1 : new Date().getMonth()
  // Moeda padrão de novas linhas: € (global) ou R$ (nacional)
  const defaultCurrency = isGlobal ? "EUR" : "BRL"

  const [selectedMonth, setSelectedMonth] = useState(startMonth)
  // Todos os meses já vêm do servidor: trocar de mês é instantâneo (sem rede).
  const [costsByMonth, setCostsByMonth] = useState<Record<number, CostItem[]>>(
    () => groupByMonth(initialData)
  )
  const [saveMessage, setSaveMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Custos do mês selecionado (derivado do estado agrupado).
  const costs = costsByMonth[selectedMonth] ?? []

  // Atualiza apenas o mês selecionado no estado agrupado.
  const setCurrentMonthCosts = (updater: (prev: CostItem[]) => CostItem[]) => {
    setCostsByMonth((prev) => ({
      ...prev,
      [selectedMonth]: updater(prev[selectedMonth] ?? []),
    }))
  }

  // Add new row
  const addRow = () => {
    const newItem: CostItem = {
      id: `new_${Date.now()}`,
      service: "",
      currency: defaultCurrency,
      value: ""
    }
    setCurrentMonthCosts((prev) => [...prev, newItem])
  }

  // Update item
  const updateItem = (id: string, field: keyof CostItem, value: string) => {
    setCurrentMonthCosts((prev) => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  // Delete item
  const deleteItem = (id: string) => {
    setCurrentMonthCosts((prev) => prev.filter(c => c.id !== id))
  }

  // Save to Supabase
  const saveData = async () => {
    setIsSaving(true)
    try {
      const costsToSave = costs
        .filter(c => c.service.trim() && parseFloat(c.value) > 0)
        .map(c => ({
          id: c.id.startsWith('new_') ? undefined : c.id,
          service: c.service,
          currency: c.currency,
          value: parseFloat(c.value) || 0
        }))

      const result = await saveOperationalCosts(clientId, selectedMonth + 1, currentYear, costsToSave)
      
      if (result.success) {
        setSaveMessage("Salvo!")
        // Recarrega só o mês salvo para obter os IDs atualizados
        const data = await getOperationalCosts(clientId, selectedMonth + 1, currentYear)
        const refreshed = mapCosts(data as InitialCost[])
        setCostsByMonth((prev) => ({ ...prev, [selectedMonth]: refreshed }))
      } else {
        setSaveMessage("Erro!")
      }
      setTimeout(() => setSaveMessage(""), 2000)
    } catch (error) {
      console.error("Error saving costs:", error)
      setSaveMessage("Erro!")
      setTimeout(() => setSaveMessage(""), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate totals by currency
  const totals = costs.reduce((acc, item) => {
    const value = parseFloat(item.value) || 0
    if (value > 0) {
      acc[item.currency] = (acc[item.currency] || 0) + value
    }
    return acc
  }, {} as Record<string, number>)

  const formatCurrency = (currency: string, value: number) => {
    const curr = CURRENCIES.find(c => c.code === currency)
    return `${curr?.symbol || ''} ${value.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {MONTHS.map((month, index) => (
              <Button
                key={month}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMonth(index)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedMonth === index
                    ? "bg-[#7F77DD] hover:bg-[#6E67CC] text-white"
                    : "bg-[#1a1a24] border border-[rgba(255,255,255,0.1)] text-[rgba(245,245,247,0.6)] hover:bg-[#252532] hover:text-white"
                }`}
              >
                {month}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Costs Table */}
      <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1a24] text-[rgba(245,245,247,0.6)] text-xs font-medium uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-1/2">Servico</th>
                <th className="px-4 py-3 text-left w-2/5">Valor</th>
                <th className="px-4 py-3 text-center w-20">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {costs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-[rgba(245,245,247,0.4)]">
                    Nenhum custo registrado. Clique em + para adicionar.
                  </td>
                </tr>
              ) : (
                costs.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={index % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#101018]"}
                  >
                    <td className="px-4 py-2">
                      <Input
                        value={item.service}
                        onChange={(e) => updateItem(item.id, "service", e.target.value)}
                        placeholder="Nome do servico"
                        className="bg-[#1a1a24] border-[rgba(255,255,255,0.1)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.3)] h-9"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Select
                          value={item.currency}
                          onValueChange={(value) => updateItem(item.id, "currency", value)}
                        >
                          <SelectTrigger className="w-24 bg-[#1a1a24] border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a24] border-[rgba(255,255,255,0.1)]">
                            {CURRENCIES.map((curr) => (
                              <SelectItem 
                                key={curr.code} 
                                value={curr.code}
                                className="text-[#F5F5F7] focus:bg-[#7F77DD] focus:text-white"
                              >
                                {curr.symbol} {curr.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.value}
                          onChange={(e) => updateItem(item.id, "value", e.target.value)}
                          placeholder="0,00"
                          className="flex-1 bg-[#1a1a24] border-[rgba(255,255,255,0.1)] text-[#F5F5F7] placeholder:text-[rgba(245,245,247,0.3)] h-9"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="h-8 w-8 p-0 rounded-full text-[rgba(245,245,247,0.5)] hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
            <div className="text-sm text-[rgba(245,245,247,0.6)]">
              {Object.keys(totals).length > 0 ? (
                <span>
                  Total:{" "}
                  {Object.entries(totals).map(([currency, value], idx) => (
                    <span key={currency}>
                      {idx > 0 && " | "}
                      <span className="text-[#F5F5F7] font-medium">
                        {formatCurrency(currency, value)}
                      </span>
                    </span>
                  ))}
                </span>
              ) : (
                <span>Total: —</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addRow}
                variant="outline"
                size="sm"
                className="bg-[#1a1a24] border-[rgba(255,255,255,0.1)] text-[#F5F5F7] hover:bg-[#252532] h-9"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
              <Button
                onClick={saveData}
                disabled={isSaving}
                size="sm"
                className="bg-[#7F77DD] hover:bg-[#6E67CC] text-white h-9 min-w-[80px]"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saveMessage ? (
                  <span className={saveMessage === "Salvo!" ? "text-emerald-300" : "text-red-300"}>{saveMessage}</span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
