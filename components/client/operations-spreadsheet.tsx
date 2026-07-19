"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, TableIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Operation {
  id?: string
  operation_date: string
  vendas: number
  valor_vendas: number
  adspend: number
  cogs: number
  isModified?: boolean
}

interface OperationsSpreadsheetProps {
  clientId: string
  initialData: Operation[]
  isGlobal?: boolean
}

const MONTHS = [
  { value: 0, label: "Janeiro", days: 31 },
  { value: 1, label: "Fevereiro", days: 29 }, // 2026 is not a leap year, but we'll calculate
  { value: 2, label: "Março", days: 31 },
  { value: 3, label: "Abril", days: 30 },
  { value: 4, label: "Maio", days: 31 },
  { value: 5, label: "Junho", days: 30 },
  { value: 6, label: "Julho", days: 31 },
  { value: 7, label: "Agosto", days: 31 },
  { value: 8, label: "Setembro", days: 30 },
  { value: 9, label: "Outubro", days: 31 },
  { value: 10, label: "Novembro", days: 30 },
  { value: 11, label: "Dezembro", days: 31 },
]

const YEAR = 2026
const USD_TO_EUR = 0.92

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function formatDateBR(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export function OperationsSpreadsheet({ clientId, initialData, isGlobal = true }: OperationsSpreadsheetProps) {
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [operations, setOperations] = useState<Operation[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Generate rows for the selected month
  const generateMonthRows = useCallback((month: number, existingData: Operation[]) => {
    const daysInMonth = getDaysInMonth(month, YEAR)
    const rows: Operation[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${YEAR}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const existing = existingData.find(op => op.operation_date === dateStr)

      rows.push({
        id: existing?.id,
        operation_date: dateStr,
        vendas: existing?.vendas || 0,
        valor_vendas: existing?.valor_vendas || 0,
        adspend: existing?.adspend || 0,
        cogs: existing?.cogs || 0,
        isModified: false
      })
    }

    return rows
  }, [])

  // Load data when month changes
  useEffect(() => {
    const loadMonthData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/client/operations?clientId=${clientId}&month=${selectedMonth + 1}&year=${YEAR}`)
        if (response.ok) {
          const data = await response.json()
          setOperations(generateMonthRows(selectedMonth, data.operations || []))
        } else {
          setOperations(generateMonthRows(selectedMonth, []))
        }
      } catch {
        setOperations(generateMonthRows(selectedMonth, []))
      } finally {
        setLoading(false)
      }
    }

    loadMonthData()
  }, [selectedMonth, clientId, generateMonthRows])

  // Initialize with initial data on first load
  useEffect(() => {
    if (initialData.length > 0) {
      setOperations(generateMonthRows(selectedMonth, initialData))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateCell = useCallback((index: number, field: keyof Operation, value: number) => {
    setOperations(prev => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value,
        isModified: true
      }
      return updated
    })
  }, [])

  const saveChanges = async () => {
    const modifiedOperations = operations.filter(op => op.isModified)

    if (modifiedOperations.length === 0) {
      toast({
        title: "Nenhuma alteração",
        description: "Não há alterações para salvar."
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/client/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          operations: modifiedOperations.map(op => ({
            id: op.id,
            operation_date: op.operation_date,
            vendas: op.vendas,
            valor_vendas: op.valor_vendas,
            adspend: op.adspend,
            cogs: op.cogs
          }))
        })
      })

      if (!response.ok) {
        throw new Error("Failed to save")
      }

      const result = await response.json()

      // Update local state with saved data
      setOperations(prev => prev.map(op => {
        if (op.isModified) {
          const savedOp = result.operations?.find((s: any) =>
            s.operation_date === op.operation_date
          )
          return {
            ...op,
            id: savedOp?.id || op.id,
            isModified: false
          }
        }
        return op
      }))

      toast({
        title: "Salvo com sucesso",
        description: `${modifiedOperations.length} registro(s) salvo(s).`
      })
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const formatEuro = (value: number) => {
    const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(safeValue)
  }

  const formatDollar = (value: number) => {
    const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(safeValue)
  }

  const formatBRL = (value: number) => {
    const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(safeValue)
  }

  // Moeda principal: € (global) ou R$ (nacional)
  const formatMoney = isGlobal ? formatEuro : formatBRL

  const calculateProfit = (op: Operation) => {
    // Global: COGS em $ convertido para € pelo câmbio.
    // Nacional: tudo em R$, sem conversão.
    const cogsValue = isGlobal ? (op.cogs || 0) * USD_TO_EUR : (op.cogs || 0)
    return (op.valor_vendas || 0) - (op.adspend || 0) - cogsValue
  }

  const calculateProfitPercent = (op: Operation) => {
    const profit = calculateProfit(op)
    if ((op.valor_vendas || 0) === 0) return 0
    return (profit / op.valor_vendas) * 100
  }

  const calculateROAS = (op: Operation) => {
    if ((op.adspend || 0) === 0) return 0
    return (op.valor_vendas || 0) / op.adspend
  }

  const hasChanges = operations.some(op => op.isModified)

  // Calculate totals with safe number handling
  const safeSum = (arr: Operation[], field: keyof Operation) => {
    return arr.reduce((sum, op) => {
      const val = Number(op[field]) || 0
      return sum + val
    }, 0)
  }

  const totalVendas = safeSum(operations, 'vendas')
  const totalValorVendas = safeSum(operations, 'valor_vendas')
  const totalAdspend = safeSum(operations, 'adspend')
  const totalCogs = safeSum(operations, 'cogs')
  const totalProfit = totalValorVendas - totalAdspend - (isGlobal ? totalCogs * USD_TO_EUR : totalCogs)
  
  const opsWithSales = operations.filter(op => Number(op.valor_vendas) > 0)
  const opsWithAdspend = operations.filter(op => Number(op.adspend) > 0)
  
  const avgProfitPercent = opsWithSales.length > 0
    ? opsWithSales.reduce((sum, op) => sum + calculateProfitPercent(op), 0) / opsWithSales.length
    : 0
  
  const avgRoas = opsWithAdspend.length > 0
    ? opsWithAdspend.reduce((sum, op) => sum + calculateROAS(op), 0) / opsWithAdspend.length
    : 0

  const totals = {
    vendas: totalVendas,
    valor_vendas: totalValorVendas,
    adspend: totalAdspend,
    cogs: totalCogs,
    profit: totalProfit,
    profitPercent: isNaN(avgProfitPercent) ? 0 : avgProfitPercent,
    roas: isNaN(avgRoas) ? 0 : avgRoas
  }

  const selectedMonthName = MONTHS[selectedMonth].label.toUpperCase()

  return (
    <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#6D28D9] flex items-center justify-center">
              <TableIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-[#F5F5F7]">Planilha de Operação</CardTitle>
              <CardDescription className="text-[rgba(245,245,247,0.52)]">
                Registre e acompanhe os dados diários da sua operação
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={saveChanges}
            disabled={!hasChanges || saving}
            className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>

        {/* Month selector */}
        <div className="flex flex-wrap gap-2 mt-4">
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
      </CardHeader>

      <CardContent className="p-0">
        {/* Month header */}
        <div className="bg-emerald-800 py-4 px-6">
          <h2 className="text-white text-xl font-bold text-center">
            {selectedMonthName} {YEAR}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0F]">
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[100px]">
                    Data
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[80px]">
                    Vendas
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[120px]">
                    {isGlobal ? "Valor Vendas (€)" : "Valor Vendas (R$)"}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[120px]">
                    {isGlobal ? "Adspend (€)" : "Adspend (R$)"}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[120px]">
                    {isGlobal ? "COGS ($)" : "COGS (R$)"}
                  </th>
                  {isGlobal && (
                    <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[100px]">
                      Câmbio
                    </th>
                  )}
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[130px]">
                    {isGlobal ? "Lucro/Prejuízo (€)" : "Lucro/Prejuízo (R$)"}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[100px]">
                    Lucro (%)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[80px]">
                    ROAS
                  </th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op, index) => {
                  const profit = calculateProfit(op)
                  const profitPercent = calculateProfitPercent(op)
                  const roas = calculateROAS(op)
                  const isPositive = profit >= 0

                  return (
                    <tr
                      key={op.operation_date}
                      className={`border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(168,85,247,0.05)] transition-colors ${op.isModified ? 'bg-[rgba(168,85,247,0.08)]' : ''}`}
                    >
                      <td className="px-3 py-2">
                        <div className="h-9 flex items-center text-[#F5F5F7] font-medium">
                          {formatDateBR(op.operation_date)}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={op.vendas || ''}
                          onChange={(e) => updateCell(index, 'vendas', parseInt(e.target.value) || 0)}
                          className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right w-full"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-[rgba(255,255,255,0.5)] text-sm pointer-events-none">{isGlobal ? "€" : "R$"}</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={op.valor_vendas || ''}
                            onChange={(e) => updateCell(index, 'valor_vendas', parseFloat(e.target.value) || 0)}
                            className={`bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right w-full ${isGlobal ? 'pl-7' : 'pl-9'}`}
                            placeholder="0.00"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-[rgba(255,255,255,0.5)] text-sm pointer-events-none">{isGlobal ? "€" : "R$"}</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={op.adspend || ''}
                            onChange={(e) => updateCell(index, 'adspend', parseFloat(e.target.value) || 0)}
                            className={`bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right w-full ${isGlobal ? 'pl-7' : 'pl-9'}`}
                            placeholder="0.00"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-[rgba(255,255,255,0.5)] text-sm pointer-events-none">{isGlobal ? "$" : "R$"}</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={op.cogs || ''}
                            onChange={(e) => updateCell(index, 'cogs', parseFloat(e.target.value) || 0)}
                            className={`bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right w-full ${isGlobal ? 'pl-7' : 'pl-9'}`}
                            placeholder="0.00"
                          />
                        </div>
                      </td>
                      {isGlobal && (
                        <td className="px-3 py-2">
                          <div className="h-9 flex items-center justify-end text-[rgba(245,245,247,0.52)] text-sm">
                            {USD_TO_EUR}
                          </div>
                        </td>
                      )}
                      <td className="px-3 py-2">
                        <div className={`h-9 flex items-center justify-end font-medium px-2 rounded-md text-sm ${isPositive ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
                          {formatMoney(profit)}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className={`h-9 flex items-center justify-end font-medium px-2 rounded-md text-sm ${isPositive ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
                          {profitPercent.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="h-9 flex items-center justify-end text-[#F5F5F7] text-sm">
                          {roas.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {/* Total row */}
                <tr className="bg-[#0A0A0F] border-t-2 border-purple-500/30">
                  <td className="px-3 py-3">
                    <div className="h-9 flex items-center text-[#F5F5F7] font-bold">
                      TOTAL
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="h-9 flex items-center justify-end text-[#F5F5F7] font-bold">
                      {totals.vendas}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="h-9 flex items-center justify-end text-emerald-400 font-bold">
                      {formatMoney(totals.valor_vendas)}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="h-9 flex items-center justify-end text-amber-400 font-bold">
                      {formatMoney(totals.adspend)}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="h-9 flex items-center justify-end text-red-400 font-bold">
                      {isGlobal ? formatDollar(totals.cogs) : formatBRL(totals.cogs)}
                    </div>
                  </td>
                  {isGlobal && (
                    <td className="px-3 py-3">
                      <div className="h-9 flex items-center justify-end text-[rgba(245,245,247,0.52)]">
                        {USD_TO_EUR}
                      </div>
                    </td>
                  )}
                  <td className="px-3 py-3">
                    <div className={`h-9 flex items-center justify-end font-bold px-2 rounded-md ${totals.profit >= 0 ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
                      {formatMoney(totals.profit)}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className={`h-9 flex items-center justify-end font-bold px-2 rounded-md ${totals.profitPercent >= 0 ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
                      {totals.profitPercent.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="h-9 flex items-center justify-end text-[#F5F5F7] font-bold">
                      {totals.roas.toFixed(2)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
