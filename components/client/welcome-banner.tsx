import Image from "next/image"

export function WelcomeBanner() {
  return (
    <div 
      className="relative w-full h-[90px] rounded-xl overflow-hidden flex items-center justify-between px-8"
      style={{
        background: "linear-gradient(to right, #6B21C8 0%, #340B5A 50%, #1a0533 100%)"
      }}
    >
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Text content */}
      <h2 
        className="relative z-10 text-white font-bold"
        style={{ fontSize: "22px" }}
      >
        Sua operação começa aqui.
      </h2>
      
      {/* Pro Growth arrow icon */}
      <div className="relative z-10 opacity-45">
        <Image
          src="/images/pg-arrow-icon.png"
          alt="Pro Growth"
          width={44}
          height={44}
          className="object-contain"
        />
      </div>
    </div>
  )
}
