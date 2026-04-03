import Image from "next/image"

export function WelcomeBanner() {
  return (
    <div className="relative w-full h-[120px] rounded-xl overflow-hidden">
      <Image
        src="/images/welcome-banner.jpg"
        alt="Bem-vindo(a) ao PG Dash. Sua operação começa aqui."
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}
