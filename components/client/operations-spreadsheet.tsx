"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Save, Trash2, TableIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Operation {
  id?: string
  operation_date: string
  obs: string
  vendas: number
  valor_vendas: number
  adspend: number
  cogs: number
  isNew?: boolean
  isModified?: boolean
}

interface OperationsSpreadsheetProps {
  clientId: string
  initialData: Operation[]
}

export function OperationsSpreadsheet({ clientId, initialData }: OperationsSpreadsheetProps) {
  const [operations, setOperations] = useState<Operation[]>(
    initialData.map(op => ({ ...op, isNew: false, isModified: false }))
  )
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const addNewRow = () => {
    const today = new Date().toISOString().split('T')[0]
    setOperations(prev => [{
      operation_date: today,
      obs: "",
      vendas: 0,
      valor_vendas: 0,
      adspend: 0,
      cogs: 0,
      isNew: true,
      isModified: true
    }, ...prev])
  }

  const updateCell = useCallback((index: number, field: keyof Operation, value: string | number) => {
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

  const deleteRow = async (index: number) => {
    const operation = operations[index]
    
    if (operation.id) {
      // Delete from database
      try {
        const response = await fetch(`/api/client/operations/${operation.id}`, {
          method: "DELETE"
        })
        
        if (!response.ok) {
          throw new Error("Failed to delete")
        }
        
        toast({
          title: "Linha removida",
          description: "O registro foi excluído com sucesso."
        })
      } catch {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o registro.",
          variant: "destructive"
        })
        return
      }
    }
    
    setOperations(prev => prev.filter((_, i) => i !== index))
  }

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
            obs: op.obs,
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
            s.operation_date === op.operation_date || s.id === op.id
          )
          return {
            ...op,
            id: savedOp?.id || op.id,
            isNew: false,
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const hasChanges = operations.some(op => op.isModified)

  return (
    <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <Button
              onClick={addNewRow}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Linha
            </Button>
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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[140px]">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider min-w-[200px]">
                  OBS
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[100px]">
                  Vendas
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[140px]">
                  Valor Vendas
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[140px]">
                  Adspend
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[140px]">
                  COGS
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[rgba(245,245,247,0.52)] uppercase tracking-wider w-[60px]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {operations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[rgba(245,245,247,0.52)]">
                    Nenhum registro encontrado. Clique em &quot;Nova Linha&quot; para começar.
                  </td>
                </tr>
              ) : (
                operations.map((op, index) => (
                  <tr 
                    key={op.id || `new-${index}`} 
                    className={`border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(168,85,247,0.05)] transition-colors ${op.isModified ? 'bg-[rgba(168,85,247,0.08)]' : ''}`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="date"
                        value={op.operation_date}
                        onChange={(e) => updateCell(index, 'operation_date', e.target.value)}
                        className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="text"
                        value={op.obs}
                        onChange={(e) => updateCell(index, 'obs', e.target.value)}
                        placeholder="Observações..."
                        className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={op.vendas}
                        onChange={(e) => updateCell(index, 'vendas', parseInt(e.target.value) || 0)}
                        className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={op.valor_vendas}
                        onChange={(e) => updateCell(index, 'valor_vendas', parseFloat(e.target.value) || 0)}
                        className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={op.adspend}
                        onChange={(e) => updateCell(index, 'adspend', parseFloat(e.target.value) || 0)}
                        className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={op.cogs}
                        onChange={(e) => updateCell(index, 'cogs', parseFloat(e.target.value) || 0)}
                        className="bg-transparent border-[rgba(255,255,255,0.1)] text-[#F5F5F7] h-9 text-right"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRow(index)}
                        className="h-8 w-8 text-[rgba(245,245,247,0.52)] hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Summary footer */}
        {operations.length > 0 && (
          <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-4 bg-[#0A0A0F]">
            <div className="flex items-center justify-end gap-8 text-sm">
              <div className="text-[rgba(245,245,247,0.52)]">
                Total Vendas: <span className="text-[#F5F5F7] font-medium">{operations.reduce((sum, op) => sum + (op.vendas || 0), 0)}</span>
              </div>
              <div className="text-[rgba(245,245,247,0.52)]">
                Valor Total: <span className="text-emerald-400 font-medium">{formatCurrency(operations.reduce((sum, op) => sum + (op.valor_vendas || 0), 0))}</span>
              </div>
              <div className="text-[rgba(245,245,247,0.52)]">
                Total Adspend: <span className="text-amber-400 font-medium">{formatCurrency(operations.reduce((sum, op) => sum + (op.adspend || 0), 0))}</span>
              </div>
              <div className="text-[rgba(245,245,247,0.52)]">
                Total COGS: <span className="text-red-400 font-medium">{formatCurrency(operations.reduce((sum, op) => sum + (op.cogs || 0), 0))}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
