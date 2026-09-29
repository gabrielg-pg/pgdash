export default function Loading() {
  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">Custos Operacionais</h1>
        <p className="text-[rgba(245,245,247,0.52)]">
          Registre mensalmente os custos operacionais para melhor performance e controle da sua operação
        </p>
      </div>

      {/* Seletor de meses (esqueleto) */}
      <div className="rounded-xl bg-[#101018] border border-[rgba(255,255,255,0.06)] p-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-full bg-[#1a1a24] animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Tabela (esqueleto) */}
      <div className="rounded-xl bg-[#101018] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="bg-[#1a1a24] h-11" />
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-[#1a1a24] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
