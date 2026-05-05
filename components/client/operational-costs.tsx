"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, X } from "lucide-react"

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

interface OperationalCostsProps {
  clientId: string
}

export function OperationalCosts({ clientId }: OperationalCostsProps) {
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [costs, setCosts] = useState<CostItem[]>([])
  const [saveMessage, setSaveMessage] = useState("")

  const storageKey = `custos_op_${clientId}`

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCosts(data[`month_${selectedMonth}`] || [])
      } catch {
        setCosts([])
      }
    } else {
      setCosts([])
    }
  }, [selectedMonth, storageKey])

  // Add new row
  const addRow = () => {
    const newItem: CostItem = {
      id: String(Date.now()),
      service: "",
      currency: "EUR",
      value: ""
    }
    setCosts([...costs, newItem])
  }

  // Update item
  const updateItem = (id: string, field: keyof CostItem, value: string) => {
    setCosts(costs.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  // Delete item
  const deleteItem = (id: string) => {
    setCosts(costs.filter(c => c.id !== id))
  }

  // Save to localStorage
  const saveData = () => {
    const saved = localStorage.getItem(storageKey)
    let allData: Record<string, CostItem[]> = {}
    
    if (saved) {
      try {
        allData = JSON.parse(saved)
      } catch {
        allData = {}
      }
    }
    
    allData[`month_${selectedMonth}`] = costs
    localStorage.setItem(storageKey, JSON.stringify(allData))
    
    setSaveMessage("Salvo!")
    setTimeout(() => setSaveMessage(""), 2000)
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
                <th className="px-4 py-3 text-left w-1/2">Serviço</th>
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
                        placeholder="Nome do serviço"
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
                size="sm"
                className="bg-[#7F77DD] hover:bg-[#6E67CC] text-white h-9 min-w-[80px]"
              >
                {saveMessage ? (
                  <span className="text-emerald-300">{saveMessage}</span>
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
