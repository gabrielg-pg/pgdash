import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StructuresGridProps {
  plan: string
}

// Pro ADS pricing depends on the client's plan.
// Only SCALE_GLOBAL gets the higher tier; all other plans use the standard tier.
function getProAdsOffer(plan: string) {
  if (plan === "SCALE_GLOBAL") {
    return {
      price: "R$1.697,00/mês",
      link: "https://payfast.greenn.com.br/redirect/301766",
    }
  }
  return {
    price: "R$1.297,00/mês",
    link: "https://payfast.greenn.com.br/redirect/301765",
  }
}

export function StructuresGrid({ plan }: StructuresGridProps) {
  const proAds = getProAdsOffer(plan)

  const structures = [
    {
      title: "Pro ADS™",
      subtitle: "Gestão de tráfego pago",
      description:
        "Sua loja está pronta. O tráfego é o que decide se ela vende ou fica parada. Nossa equipe assume a gestão de campanhas — orçamento, criativos, otimização — enquanto você acompanha o resultado, não o processo.",
      price: proAds.price,
      buttonLabel: "Quero isso na minha operação",
      link: proAds.link,
    },
    {
      title: "Vértebra Recorrência™",
      subtitle: "Setup completo de funil de e-mail (Klaviyo)",
      description:
        "Sua loja já vende. A pergunta é: quem comprou uma vez, volta a comprar? Estruturamos seu funil completo de e-mail com Klaviyo — recuperação de carrinho, boas-vindas, pós-compra, recompra. Lojas com esse funil ativo aumentam até 33% no faturamento, sem gastar um real a mais em tráfego.",
      price: "R$997,00",
      badge: "Pagamento único",
      buttonLabel: "Quero isso na minha operação",
      link: "https://payfast.greenn.com.br/redirect/301763",
    },
    {
      title: "Vértebra Sazonal™",
      subtitle: "Estrutura visual para datas de alto volume",
      description:
        "Black Friday, Natal, Dia das Mães — as datas que mais vendem são as que mais exigem identidade visual atualizada. Preparamos a loja inteira pra essas janelas, com antecedência, sem você precisar lembrar disso sozinho.",
      price: "R$697,00",
      badge: "Pagamento único",
      buttonLabel: "Quero minha loja pronta pra sazonalidade",
      link: "https://payfast.greenn.com.br/redirect/301767",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {structures.map((structure) => (
        <Card
          key={structure.title}
          className="flex flex-col bg-[#0E0E1C] border border-[rgba(255,255,255,0.06)] rounded-2xl"
        >
          <CardHeader className="p-6 pb-0">
            <h2 className="text-lg font-bold text-[#F5F5F7]">{structure.title}</h2>
            <p className="text-sm text-[#A855F7] mt-1">{structure.subtitle}</p>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 p-6 pt-4">
            <p className="text-sm text-[rgba(245,245,247,0.62)] leading-relaxed flex-1">
              {structure.description}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <p className="text-2xl font-bold text-[#F5F5F7]">{structure.price}</p>
              {structure.badge && (
                <span className="inline-flex items-center rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 px-3 py-1 text-xs font-medium text-[#C084FC]">
                  {structure.badge}
                </span>
              )}
            </div>

            <Button
              asChild
              className="mt-4 w-full bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-medium rounded-xl"
            >
              <a href={structure.link} target="_blank" rel="noopener noreferrer">
                {structure.buttonLabel}
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
