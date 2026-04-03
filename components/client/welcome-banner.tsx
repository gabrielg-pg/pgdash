"use client"

import { ArrowUpRight } from "lucide-react"

export function WelcomeBanner() {
  return (
    <div 
      className="relative w-full h-[100px] rounded-xl overflow-hidden border-b border-[#7B3FE4]"
      style={{
        background: "linear-gradient(to right, #340B5A, #0A0A0A)",
      }}
    >
      {/* Subtle violet radial glow on left side */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(123, 63, 228, 0.25) 0%, transparent 50%)",
        }}
      />
      
      {/* Grid lines overlay at 5% opacity */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-8">
        {/* Left side - Text */}
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold text-white">
            Bem-vindo(a) ao PG Dash.
          </h1>
          <p className="text-sm text-white/65 mt-1">
            Sua operação começa aqui.
          </p>
        </div>
        
        {/* Right side - Pro Growth Arrow Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#A855F7]/50 opacity-50">
          <ArrowUpRight className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  )
}
