"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Euro, RotateCcw, DollarSign, Calculator, Store, Sparkles, Calendar, Activity, Megaphone } from "lucide-react"

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

interface ScaleGlobalDashboardProps {
  clientId: string
  clientSlug: string
  clientName: string
  userName: string
  clientPlan?: string
  clientStatus?: string
  clientStartDate?: string
}

interface DailyData {
  day: number
  value: number
}

interface MetricsData {
  salesData: DailyData[]
  adspendData: DailyData[]
  refundsData: DailyData[]
  costsData: DailyData[]
  totalSales: number
  totalAdspend: number
  totalRefunds: number
  totalCosts: number
}

export function ScaleGlobalDashboard({ 
  clientId,
  clientSlug, 
  clientName, 
  userName,
  clientPlan = "SCALE_GLOBAL",
  clientStatus = "ACTIVE",
  clientStartDate
}: ScaleGlobalDashboardProps) {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [isLoading, setIsLoading] = useState(true)
  const [animationKey, setAnimationKey] = useState(0)
  
  const [metrics, setMetrics] = useState<MetricsData>({
    salesData: [],
    adspendData: [],
    refundsData: [],
    costsData: [],
    totalSales: 0,
    totalAdspend: 0,
    totalRefunds: 0,
    totalCosts: 0,
  })
  
  const [displayedResult, setDisplayedResult] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/client/metrics?clientId=${clientId}&clientSlug=${clientSlug}&month=${selectedMonth + 1}&year=${currentYear}`
        )
        const data = await response.json()
        setMetrics(data)
        setAnimationKey(prev => prev + 1)
      } catch (error) {
        console.error("Error fetching metrics:", error)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [selectedMonth, clientId, clientSlug, currentYear])

  // Animate result counter
  useEffect(() => {
    const result = metrics.totalSales - metrics.totalAdspend - metrics.totalRefunds - metrics.totalCosts
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
  }, [metrics.totalSales, metrics.totalAdspend, metrics.totalRefunds, metrics.totalCosts])

  const result = metrics.totalSales - metrics.totalAdspend - metrics.totalRefunds - metrics.totalCosts
  const isProfit = result >= 0

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—"
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      START: "Start",
      PRO: "Pro",
      SCALE: "Scale",
      SCALE_VERTEBRA: "Scale Vértebra",
      SCALE_GLOBAL: "Scale Global",
    }
    return labels[plan] || plan
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: "Activo",
      INACTIVE: "Inactivo",
      PAUSED: "Pausado",
    }
    return labels[status] || status
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
      <div className="h-32 bg-[#1a1a2e] rounded"></div>
    </div>
  )

  const infoCards = [
    { label: "Loja", value: clientName, icon: Store },
    { label: "Plano", value: getPlanLabel(clientPlan), icon: Sparkles, badge: true },
    { label: "Status", value: getStatusLabel(clientStatus), icon: Activity, status: clientStatus },
    { label: "Início", value: formatDate(clientStartDate), icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-[#07070A]">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - 40% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#F5F5F7]">
              Bem-vindo, {userName}!
            </h1>
            <p className="text-[rgba(245,245,247,0.52)] text-lg mt-2">{clientName}</p>
          </div>

          {/* Welcome Video */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
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

          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {infoCards.map((card) => (
              <Card key={card.label} className="border-[rgba(255,255,255,0.06)] bg-[#101018] rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <card.icon className="w-4 h-4 text-[#A855F7]" />
                    <p className="text-sm text-[rgba(245,245,247,0.52)]">{card.label}</p>
                  </div>
                  {card.badge ? (
                    <Badge className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white rounded-full px-3">
                      {card.value}
                    </Badge>
                  ) : card.status ? (
                    <Badge className={`
                      ${card.status === "ACTIVE" ? "bg-[#22C55E]" : 
                        card.status === "PAUSED" ? "bg-[#F59E0B]" : "bg-[#EF4444]"} 
                      text-white rounded-full px-3
                    `}>
                      {card.value}
                    </Badge>
                  ) : (
                    <p className="text-base font-semibold text-[#F5F5F7]">{card.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - 60% */}
        <div className="lg:col-span-3 space-y-6">
          {/* Month Selector Pills */}
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

          {/* Charts Grid - 2x2 layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sales Chart */}
            <Card className="border-[rgba(255,255,255,0.06)] bg-[#101018] rounded-2xl">
              <CardHeader className="pb-2 p-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-[#F5F5F7] text-sm flex items-center gap-2">
                    <Euro className="w-4 h-4 text-[#A855F7]" />
                    Vendas Totais
                  </CardTitle>
                  <span className="text-xl font-bold text-[#A855F7]">
                    {formatCurrency(metrics.totalSales)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart key={animationKey} data={metrics.salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis 
                          dataKey="day" 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          width={30}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="#A855F7" 
                          radius={[2, 2, 0, 0]}
                          animationDuration={800}
                          animationBegin={0}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AdSpend Chart */}
            <Card className="border-[rgba(255,255,255,0.06)] bg-[#101018] rounded-2xl">
              <CardHeader className="pb-2 p-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-[#F5F5F7] text-sm flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#3B82F6]" />
                    AdSpend
                  </CardTitle>
                  <span className="text-xl font-bold text-[#3B82F6]">
                    {formatCurrency(metrics.totalAdspend)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart key={animationKey} data={metrics.adspendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis 
                          dataKey="day" 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          width={30}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="#3B82F6" 
                          radius={[2, 2, 0, 0]}
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
            <Card className="border-[rgba(255,255,255,0.06)] bg-[#101018] rounded-2xl">
              <CardHeader className="pb-2 p-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-[#F5F5F7] text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#F97316]" />
                    Reembolsos
                  </CardTitle>
                  <span className="text-xl font-bold text-[#F97316]">
                    {formatCurrency(metrics.totalRefunds)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart key={animationKey} data={metrics.refundsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis 
                          dataKey="day" 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          width={30}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="#F97316" 
                          radius={[2, 2, 0, 0]}
                          animationDuration={800}
                          animationBegin={0}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Costs Chart */}
            <Card className="border-[rgba(255,255,255,0.06)] bg-[#101018] rounded-2xl">
              <CardHeader className="pb-2 p-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-[#F5F5F7] text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#EF4444]" />
                    Custos Operacionais
                  </CardTitle>
                  <span className="text-xl font-bold text-[#EF4444]">
                    {formatCurrency(metrics.totalCosts)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart key={animationKey} data={metrics.costsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis 
                          dataKey="day" 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          stroke="rgba(245,245,247,0.42)" 
                          tick={{ fontSize: 8 }}
                          tickLine={false}
                          width={30}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="#EF4444" 
                          radius={[2, 2, 0, 0]}
                          animationDuration={800}
                          animationBegin={0}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Result Card - Large */}
          <Card className={`border-[rgba(255,255,255,0.06)] rounded-2xl ${
            isProfit 
              ? "bg-gradient-to-br from-[#101018] to-[#0a1f0a] border-[rgba(34,197,94,0.2)]" 
              : "bg-gradient-to-br from-[#101018] to-[#1f0a0a] border-[rgba(239,68,68,0.2)]"
          }`}>
            <CardHeader className="pb-2 p-6">
              <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Resultado do Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className={`flex items-center gap-3 mb-4 ${isProfit ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {isProfit ? (
                      <TrendingUp className="w-10 h-10" />
                    ) : (
                      <TrendingDown className="w-10 h-10" />
                    )}
                    <span className="text-2xl font-bold uppercase tracking-wide">
                      {isProfit ? "Lucro" : "Prejuízo"}
                    </span>
                  </div>
                  <p className={`text-5xl md:text-6xl font-bold ${isProfit ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {formatCurrency(Math.abs(displayedResult))}
                  </p>
                  <p className="text-[rgba(245,245,247,0.42)] text-sm mt-6">
                    Vendas - AdSpend - Reembolsos - Custos
                  </p>
                  <p className="text-[rgba(245,245,247,0.52)] text-sm mt-2 text-center">
                    {formatCurrency(metrics.totalSales)} - {formatCurrency(metrics.totalAdspend)} - {formatCurrency(metrics.totalRefunds)} - {formatCurrency(metrics.totalCosts)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
