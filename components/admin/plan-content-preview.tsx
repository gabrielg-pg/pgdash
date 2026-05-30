"use client"

import { useState } from "react"
import { Compass, Layers, Shield, MessageCircle, ArrowUpRight, Map, Boxes, Crown, BarChart3, Globe, Rocket, TrendingUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlanContentPreviewProps {
  startButtonLink: string
  startButtonLabel: string
  proButtonLink: string
  proButtonLabel: string
  scaleButtonLink: string
  scaleButtonLabel: string
}

export function PlanContentPreview({
  startButtonLink,
  startButtonLabel,
  proButtonLink,
  proButtonLabel,
  scaleButtonLink,
  scaleButtonLabel,
}: PlanContentPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Eye className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Visualização por Plano</h2>
          <p className="text-sm text-zinc-500">Veja exatamente o que cada cliente vê em seu plano</p>
        </div>
      </div>

      <Tabs defaultValue="start" className="w-full">
        <TabsList className="w-full bg-[#0D0D12] border border-zinc-800/60 p-1 rounded-xl">
          <TabsTrigger 
            value="start" 
            className="flex-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg transition-all"
          >
            Start PRO GROWTH
          </TabsTrigger>
          <TabsTrigger 
            value="pro" 
            className="flex-1 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-lg transition-all"
          >
            Pro VÉRTEBRA
          </TabsTrigger>
          <TabsTrigger 
            value="scale" 
            className="flex-1 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 rounded-lg transition-all"
          >
            Scale VÉRTEBRA+ GLOBAL
          </TabsTrigger>
        </TabsList>

        {/* START Plan Content */}
        <TabsContent value="start" className="mt-6 space-y-5">
          {/* Header */}
          <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c10] to-[#0d0b14] border border-zinc-800/60 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Map className="w-5 h-5 text-blue-400" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                    Mapa da Operacao
                  </h1>
                </div>
                <p className="text-zinc-400 text-sm max-w-lg">
                  Acompanhe a jornada da sua operacao e entenda cada etapa do processo de construcao do seu negocio.
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 text-sm font-medium">
                  Start PRO GROWTH
                </Badge>
                <p className="text-xs text-zinc-500">
                  Nivel atual - Operador em formacao
                </p>
              </div>
            </div>
          </header>

          {/* Two cards */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
              <p className="text-white text-sm leading-relaxed">
                Voce esta no nivel <span className="text-blue-400 font-medium">Start PRO GROWTH</span>.
              </p>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Este estagio existe para construir a base operacional minima da sua operacao antes de qualquer tentativa de crescimento ou escala.
              </p>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Neste nivel, a prioridade nao e velocidade.
                <br />
                <span className="text-white font-medium">E estrutura.</span>
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
              <p className="text-zinc-400 text-sm leading-relaxed">
                O objetivo deste nivel e tirar a operacao do modelo de tentativa e erro e criar a primeira espinha dorsal real do negocio.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">-</span>
                  Decisoes impulsivas sao eliminadas
                </p>
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">-</span>
                  Confusao de nicho e produto e resolvida
                </p>
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">-</span>
                  O risco de prejuizo por testes prematuros e reduzido
                </p>
              </div>
            </div>
          </div>

          {/* Three cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Compass className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Direcao</h3>
              <p className="text-zinc-500 text-xs mb-3">Clareza antes da execucao</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Nesta etapa, a operacao ganha rumo. Sao definidas as escolhas corretas de nicho, pais e ordem de execucao.
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Base Operacional</h3>
              <p className="text-zinc-500 text-xs mb-3">A operacao comeca a existir</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Nesta etapa, a estrutura minima e construida. A operacao passa a ter base funcional e logica de oferta simples.
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Protecao</h3>
              <p className="text-zinc-500 text-xs mb-3">Evitar prejuizo e decisoes emocionais</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Nesta etapa, o foco e proteger capital e psicologico. Fica claro o que NAO deve ser testado agora.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Avaliacao de Progressao de Nivel</h3>
            <p className="text-zinc-400 text-sm">
              Se as etapas acima estiverem bem executadas, sua operacao pode estar pronta para avancar para o proximo nivel operacional.
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-800/60">
              <a href={startButtonLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-2 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {startButtonLabel}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </TabsContent>

        {/* PRO Plan Content */}
        <TabsContent value="pro" className="mt-6 space-y-5">
          {/* Header */}
          <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c10] to-[#0d0b14] border border-zinc-800/60 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Map className="w-5 h-5 text-purple-400" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                    Mapa da Operacao
                  </h1>
                </div>
                <p className="text-zinc-400 text-sm max-w-lg">
                  Acompanhe a jornada da sua operacao e entenda cada etapa do processo de construcao do seu negocio.
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1 text-sm font-medium">
                  Pro VÉRTEBRA
                </Badge>
                <p className="text-xs text-zinc-500">
                  Nivel atual - Operador com espinha dorsal
                </p>
              </div>
            </div>
          </header>

          {/* Two cards */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
              <p className="text-white text-sm leading-relaxed">
                Voce esta no nivel <span className="text-purple-400 font-medium">Pro VÉRTEBRA</span>.
              </p>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Neste estagio, a operacao deixa de depender de sorte e passa a operar com estrutura, logica e previsibilidade.
              </p>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                <span className="text-white font-medium">Aqui, a empresa comeca a existir de verdade.</span>
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
              <p className="text-zinc-400 text-sm leading-relaxed">
                O objetivo deste nivel e transformar uma operacao instavel em uma operacao estruturada e legivel.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">-</span>
                  A operacao ganha espinha dorsal
                </p>
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">-</span>
                  Decisoes passam a ser racionais
                </p>
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">-</span>
                  A empresa deixa de depender de impulsos
                </p>
              </div>
            </div>
          </div>

          {/* Three cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-purple-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <Boxes className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Estrutura</h3>
              <p className="text-zinc-500 text-xs mb-3">A operacao se organiza</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Nesta vertebra, a operacao ganha logica completa. Oferta, loja e narrativa passam a conversar entre si.
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-purple-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <Crown className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Autoridade</h3>
              <p className="text-zinc-500 text-xs mb-3">A marca passa a merecer vender</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Nesta vertebra, a operacao deixa de parecer generica. A comunicacao ganha identidade e confianca.
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-purple-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Performance Legivel</h3>
              <p className="text-zinc-500 text-xs mb-3">Decisoes baseadas em dados</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Nesta vertebra, a operacao passa a ser mensuravel. Criativos seguem tese e metricas fazem sentido.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Avaliacao de Progressao de Nivel</h3>
            <p className="text-zinc-400 text-sm">
              O avanco para o Scale VERTEBRA+ GLOBAL nao e automatico. Ele so faz sentido quando a base esta solida e validada.
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-800/60">
              <a href={proButtonLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg gap-2 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {proButtonLabel}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </TabsContent>

        {/* SCALE Plan Content */}
        <TabsContent value="scale" className="mt-6 space-y-5">
          {/* Header */}
          <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0c10] to-[#0d0b14] border border-zinc-800/60 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Map className="w-5 h-5 text-amber-400" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                    Mapa da Operacao
                  </h1>
                </div>
                <p className="text-zinc-400 text-sm max-w-lg">
                  Acompanhe a jornada da sua operacao e entenda cada etapa do processo de construcao do seu negocio.
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-1 text-sm font-medium">
                  SCALE VERTEBRA+ GLOBAL
                </Badge>
                <p className="text-xs text-zinc-500">
                  Nivel atual - Operacao global escalavel
                </p>
              </div>
            </div>
          </header>

          {/* Two cards */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
              <p className="text-white text-sm leading-relaxed">
                Voce esta no nivel <span className="text-amber-400 font-medium">SCALE VERTEBRA+ GLOBAL</span>.
              </p>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Neste estagio, a operacao esta pronta para crescer de forma previsivel e sustentavel, com estrutura que suporta volume sem perder controle.
              </p>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                <span className="text-white font-medium">Aqui, escalar deixa de ser risco e passa a ser metodo.</span>
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
              <p className="text-zinc-400 text-sm leading-relaxed">
                O objetivo deste nivel e transformar crescimento em sistema, e nao em acidente.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">-</span>
                  Escala com previsibilidade
                </p>
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">-</span>
                  Expansao internacional estruturada
                </p>
                <p className="text-zinc-300 text-sm flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">-</span>
                  Operacao autonoma e replicavel
                </p>
              </div>
            </div>
          </div>

          {/* Three cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <Globe className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Expansao Global</h3>
              <p className="text-zinc-500 text-xs mb-3">Operacao sem fronteiras</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Neste pilar, a operacao ganha capacidade de atuar em multiplos mercados com logistica e pagamentos adaptados.
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <Rocket className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Escala Controlada</h3>
              <p className="text-zinc-500 text-xs mb-3">Crescimento com metodo</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Neste pilar, o crescimento acontece de forma previsivel. Metricas, processos e equipe estao alinhados.
              </p>
            </div>

            <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Performance Avancada</h3>
              <p className="text-zinc-500 text-xs mb-3">Otimizacao continua</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Neste pilar, cada canal e otimizado individualmente. Trafego, conversao e retencao sao sistemas independentes.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#0c0c10] border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Suporte Estrategico</h3>
            <p className="text-zinc-400 text-sm">
              No nivel SCALE, voce tem acesso a suporte estrategico especializado para garantir que sua operacao continue crescendo de forma sustentavel.
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-800/60">
              <a href={scaleButtonLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg gap-2 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {scaleButtonLabel}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
