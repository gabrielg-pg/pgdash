export default function Loading() {
  return (
    <div className="space-y-6 pt-6 px-4 md:px-6 lg:px-8 pb-8">
      <div>
        <div className="h-8 w-40 rounded-md bg-[rgba(255,255,255,0.06)] animate-pulse mb-2" />
        <div className="h-4 w-72 rounded-md bg-[rgba(255,255,255,0.04)] animate-pulse" />
      </div>

      {/* Stats bar skeleton */}
      <div className="flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 bg-[#101018] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <div className="h-7 w-12 rounded bg-[rgba(255,255,255,0.06)] animate-pulse mb-2" />
            <div className="h-3 w-20 rounded bg-[rgba(255,255,255,0.04)] animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-[#101018] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
        <div className="h-11 bg-[#1a2744]" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`h-11 ${i % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#101018]"} border-t border-[rgba(255,255,255,0.04)]`}
          />
        ))}
      </div>
    </div>
  )
}
