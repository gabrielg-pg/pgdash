"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, TrendingDown, Euro, RotateCcw, DollarSign, Calculator } from "lucide-react"

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

interface ScaleGlobalDashboardProps {
  clientSlug: string
  clientName: string
  userName: string
}

interface DailyData {
  day: number
  value: number
}

export function ScaleGlobalDashboard({ clientSlug, clientName, userName }: ScaleGlobalDashboardProps) {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [isLoading, setIsLoading] = useState(true)
  const [animationKey, setAnimationKey] = useState(0)
  
  const [salesData, setSalesData] = useState<DailyData[]>([])
  const [refundsData, setRefundsData] = useState<DailyData[]>([])
  const [costsData, setCostsData] = useState<DailyData[]>([])
  
  const [totalSales, setTotalSales] = useState(0)
  const [totalRefunds, setTotalRefunds] = useState(0)
  const [totalCosts, setTotalCosts] = useState(0)
  const [displayedResult, setDisplayedResult] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const supabase = createClient()
      const month = selectedMonth + 1
      const year = currentYear

      // Get days in month
      const daysInMonth = new Date(year, month, 0).getDate()
      
      // Initialize arrays with zeros
      const salesByDay: DailyData[] = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
      const refundsByDay: DailyData[] = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
      const costsByDay: DailyData[] = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))

      // Fetch sales data
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const endDate = month === 12 
        ? `${year + 1}-01-01` 
        : `${year}-${String(month + 1).padStart(2, '0')}-01`
      
      const { data: sales } = await supabase
        .from('daily_operations')
        .select('operation_date, valor_vendas')
        .eq('client_id', clientSlug)
        .gte('operation_date', startDate)
        .lt('operation_date', endDate)

      if (sales) {
        sales.forEach(row => {
          const day = new Date(row.operation_date).getDate()
          if (salesByDay[day - 1]) {
            salesByDay[day - 1].value += parseFloat(row.valor_vendas) || 0
          }
        })
      }

      // Fetch refunds data
      const { data: refunds } = await supabase
        .from('refunds')
        .select('data_compra, valor_reembolsado')
        .eq('client_slug', clientSlug)

      if (refunds) {
        refunds.forEach(row => {
          // Parse date format DD/MM/YYYY
          const parts = row.data_compra?.split('/')
          if (parts && parts.length === 3) {
            const refundMonth = parseInt(parts[1])
            const refundYear = parseInt(parts[2])
            const refundDay = parseInt(parts[0])
            
            if (refundMonth === month && refundYear === year && refundsByDay[refundDay - 1]) {
              const value = row.valor_reembolsado?.replace('€', '').replace(',', '.').trim()
              refundsByDay[refundDay - 1].value += parseFloat(value) || 0
            }
          }
        })
      }

      // Fetch costs data
      const { data: costs } = await supabase
        .from('operational_costs')
        .select('value, created_at')
        .eq('client_slug', clientSlug)
        .eq('month', month)
        .eq('year', year)

      if (costs) {
        // Distribute costs evenly across the month or use created_at
        const totalCostsValue = costs.reduce((sum, row) => sum + (parseFloat(row.value) || 0), 0)
        // For simplicity, show total costs on day 1
        if (costsByDay[0]) {
          costsByDay[0].value = totalCostsValue
        }
      }

      // Calculate totals
      const salesTotal = salesByDay.reduce((sum, d) => sum + d.value, 0)
      const refundsTotal = refundsByDay.reduce((sum, d) => sum + d.value, 0)
      const costsTotal = costsByDay.reduce((sum, d) => sum + d.value, 0)

      setSalesData(salesByDay)
      setRefundsData(refundsByDay)
      setCostsData(costsByDay)
      setTotalSales(salesTotal)
      setTotalRefunds(refundsTotal)
      setTotalCosts(costsTotal)
      
      setAnimationKey(prev => prev + 1)
      setIsLoading(false)
    }

    fetchData()
  }, [selectedMonth, clientSlug, currentYear])

  // Animate result counter
  useEffect(() => {
    const result = totalSales - totalRefunds - totalCosts
    const duration = 1000
    const steps = 30
    const increment = result / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      setDisplayedResult(current)
      
      if (step >= steps) {
        setDisplayedResult(result)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [totalSales, totalRefunds, totalCosts])

  const result = totalSales - totalRefunds - totalCosts
  const isProfit = result >= 0

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 shadow-xl">
          <p className="text-[rgba(245,245,247,0.52)] text-xs">Dia {label}</p>
          <p className="text-[#F5F5F7] font-semibold">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-[#1a1a2e] rounded w-1/3 mb-4"></div>
      <div className="h-48 bg-[#1a1a2e] rounded"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#F5F5F7]">
            Bem-vindo, {userName}!
          </h1>
          <p className="text-[rgba(245,245,247,0.52)] mt-1">{clientName}</p>
        </div>
      </div>

      {/* Welcome Video */}
      <div className="flex justify-start">
        <div className="w-full max-w-[600px] aspect-video rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
          <iframe
            title="vimeo-player"
            src="https://player.vimeo.com/video/1180982090?h=751e8cf86c"
            width="100%"
            height="100%"
            frameBorder="0"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex flex-wrap gap-2">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedMonth === index
                ? "bg-[#A855F7] text-white shadow-lg shadow-[rgba(168,85,247,0.3)]"
                : "bg-[#101018] text-[rgba(245,245,247,0.72)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(168,85,247,0.3)]"
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="border-[rgba(255,255,255,0.06)] bg-[#101018]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                <Euro className="w-5 h-5 text-[#A855F7]" />
                Vendas Totais
              </CardTitle>
              <span className="text-2xl font-bold text-[#22C55E]">
                {formatCurrency(totalSales)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={animationKey} data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis 
                      dataKey="day" 
                      stroke="rgba(245,245,247,0.42)" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(245,245,247,0.42)" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#A855F7" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                      animationBegin={0}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refunds Chart */}
        <Card className="border-[rgba(255,255,255,0.06)] bg-[#101018]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#F97316]" />
                Reembolsos
              </CardTitle>
              <span className="text-2xl font-bold text-[#F97316]">
                {formatCurrency(totalRefunds)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={animationKey} data={refundsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis 
                      dataKey="day" 
                      stroke="rgba(245,245,247,0.42)" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(245,245,247,0.42)" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      tickFormatter={(value) => `${value.toFixed(0)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#F97316" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                      animationBegin={100}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Costs Chart */}
        <Card className="border-[rgba(255,255,255,0.06)] bg-[#101018]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#EF4444]" />
                Custos Operacionais
              </CardTitle>
              <span className="text-2xl font-bold text-[#EF4444]">
                {formatCurrency(totalCosts)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={animationKey} data={costsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis 
                      dataKey="day" 
                      stroke="rgba(245,245,247,0.42)" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(245,245,247,0.42)" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      tickFormatter={(value) => `${value.toFixed(0)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#EF4444" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                      animationBegin={200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result Card */}
        <Card className={`border-[rgba(255,255,255,0.06)] ${
          isProfit 
            ? "bg-gradient-to-br from-[#101018] to-[#0a1f0a] border-[rgba(34,197,94,0.2)]" 
            : "bg-gradient-to-br from-[#101018] to-[#1f0a0a] border-[rgba(239,68,68,0.2)]"
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Resultado do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  <div className={`flex items-center gap-2 mb-2 ${isProfit ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {isProfit ? (
                      <TrendingUp className="w-8 h-8" />
                    ) : (
                      <TrendingDown className="w-8 h-8" />
                    )}
                    <span className="text-xl font-semibold uppercase">
                      {isProfit ? "Lucro" : "Prejuízo"}
                    </span>
                  </div>
                  <p className={`text-5xl font-bold ${isProfit ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {formatCurrency(Math.abs(displayedResult))}
                  </p>
                  <p className="text-[rgba(245,245,247,0.42)] text-sm mt-4">
                    Vendas - Reembolsos - Custos
                  </p>
                  <p className="text-[rgba(245,245,247,0.52)] text-xs mt-1">
                    {formatCurrency(totalSales)} - {formatCurrency(totalRefunds)} - {formatCurrency(totalCosts)}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
