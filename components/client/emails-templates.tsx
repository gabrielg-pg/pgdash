"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check, Lightbulb, Instagram, Mail, AlertTriangle } from "lucide-react"

interface EmailsTemplatesProps {
  clientId: string
}

const COUNTRIES = [
  { code: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "BR", flag: "🇧🇷", name: "Brasil" },
  { code: "ES", flag: "🇪🇸", name: "Espanha" },
  { code: "GB", flag: "🇬🇧", name: "Reino Unido" },
  { code: "US", flag: "🇺🇸", name: "Estados Unidos" },
  { code: "CA", flag: "🇨🇦", name: "Canadá" },
  { code: "IT", flag: "🇮🇹", name: "Italia" },
  { code: "FR", flag: "🇫🇷", name: "França" },
  { code: "DE", flag: "🇩🇪", name: "Alemanha" },
]

interface MessagePart {
  title: string
  versions: { label: string; text: string }[]
  tip: string
}

interface InstagramMessages {
  part1: MessagePart
  part2: MessagePart
  part3: MessagePart
  part4: MessagePart
}

interface EmailTemplate {
  label: string
  subject: string
  body: string
  tip?: string
}

interface EmailTemplates {
  refund: EmailTemplate[]
  delivery: EmailTemplate[]
  legal: EmailTemplate[]
}

// Instagram Messages - PT only for now, others follow same structure
const INSTAGRAM_MESSAGES: Record<string, InstagramMessages> = {
  PT: {
    part1: {
      title: "DM: Encomenda / Não recebi / Problemas",
      versions: [
        { label: "VERSÃO 1 — Direta", text: "Olá! 🌸 Obrigada por nos contactar. Para questões relacionadas com a sua encomenda, pedimos que nos envie um e-mail para [e-mail da loja] com o número da encomenda — a nossa equipa responde em 24 a 48h úteis. Estamos aqui para ajudar! 💛" },
        { label: "VERSÃO 2 — Com mais calor", text: "Olá! 🌸 Lamentamos o inconveniente. Para que possamos resolver a sua situação com toda a atenção que merece, pedimos que nos contacte por e-mail: 📩 [e-mail da loja] Inclua o número da encomenda e a nossa equipa responde em 24 a 48h úteis. Obrigada pela sua paciência! 💛" },
        { label: "VERSÃO 3 — Super curta", text: "Olá! 🌸 Para questões sobre encomendas, envia-nos um e-mail para [e-mail da loja] com o teu número de encomenda. Respondemos em 24 a 48h! 💛" },
      ],
      tip: "No dia a dia usa a Versão 3 para responder rápido. Se a cliente insistir, usa a Versão 1 ou 2."
    },
    part2: {
      title: "Comentários no Feed: Questões sobre Preço",
      versions: [
        { label: "VERSÃO 1 — Neutra e direta", text: "Olá! 🌸 Todas as informações sobre preço, tamanhos e disponibilidade estão no nosso site, acede pelo link na bio! 💛" },
        { label: "VERSÃO 2 — Com entusiasmo", text: "Olá! 😍 Podes ver o preço e todos os detalhes deste produto diretamente no nosso site, é só clicar no link na bio! Temos envio grátis em Portugal 💛" },
        { label: "VERSÃO 3 — Com urgência subtil", text: "Olá! 🌸 O preço e disponibilidade estão no nosso site, acede pelo link na bio antes que esgote! 😉💛" },
      ],
      tip: "Nunca coloque o preço nos comentários — obriga a cliente a ir ao site, aumenta o tráfego e a probabilidade de compra."
    },
    part3: {
      title: "Comentários no Feed: Onde compro? / Como encomendo?",
      versions: [
        { label: "VERSÃO ÚNICA — Rápida e completa", text: "Olá! 🌸 É só aceder ao nosso site pelo link na bio, escolher o teu tamanho e cor e finalizar a compra! Entrega grátis em Portugal. Qualquer dúvida estamos aqui 💛" },
      ],
      tip: "Resposta simples que resolve tudo — direciona para o site e fecha com disponibilidade para ajudar."
    },
    part4: {
      title: "DM: Onde fica a loja? / Tem loja física?",
      versions: [
        { label: "VERSÃO 1 — Emotiva e honesta", text: "Olá! 🌸 Obrigada por nos contactar. A nossa loja física em [cidade] fechou durante a pandemia em 2020 — foi um momento muito difícil para nós, como para tantas pequenas marcas portuguesas. Mas reinventámo-nos! Hoje chegamos a toda Portugal através do nosso site [site] com envio grátis, pagamento por [meios de pagamento] e entrega rápida pela [transportadora]. Esperamos poder receber-te (online) em breve! 💛" },
        { label: "VERSÃO 2 — Mais curta e direta", text: "Olá! 🌸 A nossa loja física encerrou em 2020 durante a pandemia. Desde então estamos online e chegamos a toda Portugal! Podes encontrar todas as nossas peças em [site], envio grátis e entrega pela [transportadora] 💛" },
        { label: "VERSÃO 3 — Super curta", text: "Olá! 🌸 A nossa loja física fechou em 2020 mas estamos online para toda Portugal! Visita-nos em [site] envio grátis 💛" },
      ],
      tip: "A Versão 1 humaniza a marca e cria empatia — ideal quando a cliente parece genuinamente interessada. A Versão 3 é para o dia a dia."
    }
  },
  BR: {
    part1: {
      title: "DM: Pedido / Não recebi / Problemas",
      versions: [
        { label: "VERSÃO 1 — Direta", text: "Olá! 🌸 Obrigada por entrar em contato. Para questões relacionadas ao seu pedido, pedimos que nos envie um e-mail para [e-mail da loja] com o número do pedido — nossa equipe responde em 24 a 48h úteis. Estamos aqui para ajudar! 💛" },
        { label: "VERSÃO 2 — Com mais calor", text: "Olá! 🌸 Lamentamos o inconveniente. Para que possamos resolver sua situação com toda a atenção que merece, pedimos que entre em contato por e-mail: 📩 [e-mail da loja] Inclua o número do pedido e nossa equipe responde em 24 a 48h úteis. Obrigada pela paciência! 💛" },
        { label: "VERSÃO 3 — Super curta", text: "Olá! 🌸 Para questões sobre pedidos, envie um e-mail para [e-mail da loja] com o número do seu pedido. Respondemos em 24 a 48h! 💛" },
      ],
      tip: "No dia a dia use a Versão 3 para responder rápido. Se a cliente insistir, use a Versão 1 ou 2."
    },
    part2: {
      title: "Comentários no Feed: Questões sobre Preço",
      versions: [
        { label: "VERSÃO 1 — Neutra e direta", text: "Olá! 🌸 Todas as informações sobre preço, tamanhos e disponibilidade estão no nosso site, acesse pelo link na bio! 💛" },
        { label: "VERSÃO 2 — Com entusiasmo", text: "Olá! 😍 Você pode ver o preço e todos os detalhes deste produto diretamente no nosso site, é só clicar no link na bio! Temos frete grátis para todo Brasil 💛" },
        { label: "VERSÃO 3 — Com urgência sutil", text: "Olá! 🌸 O preço e disponibilidade estão no nosso site, acesse pelo link na bio antes que esgote! 😉💛" },
      ],
      tip: "Nunca coloque o preço nos comentários — obriga a cliente a ir ao site, aumenta o tráfego e a probabilidade de compra."
    },
    part3: {
      title: "Comentários no Feed: Onde compro? / Como faço pedido?",
      versions: [
        { label: "VERSÃO ÚNICA — Rápida e completa", text: "Olá! 🌸 É só acessar nosso site pelo link na bio, escolher seu tamanho e cor e finalizar a compra! Frete grátis para todo Brasil. Qualquer dúvida estamos aqui 💛" },
      ],
      tip: "Resposta simples que resolve tudo — direciona para o site e fecha com disponibilidade para ajudar."
    },
    part4: {
      title: "DM: Onde fica a loja? / Tem loja física?",
      versions: [
        { label: "VERSÃO 1 — Emotiva e honesta", text: "Olá! 🌸 Obrigada por entrar em contato. Nossa loja física em [cidade] fechou durante a pandemia em 2020 — foi um momento muito difícil para nós, como para tantas pequenas marcas brasileiras. Mas nos reinventamos! Hoje chegamos a todo Brasil através do nosso site [site] com frete grátis, pagamento por [meios de pagamento] e entrega rápida pela [transportadora]. Esperamos poder receber você (online) em breve! 💛" },
        { label: "VERSÃO 2 — Mais curta e direta", text: "Olá! 🌸 Nossa loja física encerrou em 2020 durante a pandemia. Desde então estamos online e chegamos a todo Brasil! Você pode encontrar todas as nossas peças em [site], frete grátis e entrega pela [transportadora] 💛" },
        { label: "VERSÃO 3 — Super curta", text: "Olá! 🌸 Nossa loja física fechou em 2020 mas estamos online para todo Brasil! Visite-nos em [site] frete grátis 💛" },
      ],
      tip: "A Versão 1 humaniza a marca e cria empatia — ideal quando a cliente parece genuinamente interessada. A Versão 3 é para o dia a dia."
    }
  }
}

// Email Templates
const EMAIL_TEMPLATES: Record<string, EmailTemplates> = {
  PT: {
    refund: [
      {
        label: "✓ DEFEITO / INCORRETO — REENVIO GRATUITO",
        subject: "Re: Problema com a Encomenda #[nº_encomenda] — Solução Imediata",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar e pedimos sinceras desculpas pelo sucedido com a sua encomenda #[nº_encomenda].

Após analisar as fotografias que nos enviou, confirmamos que o artigo apresenta [defeito / foi enviado incorretamente]. Assumimos total responsabilidade por esta situação — este resultado não corresponde aos nossos padrões de qualidade.

Como forma de resolução imediata, procedemos ao reenvio de um novo artigo sem qualquer custo adicional para si. Não necessita de devolver o artigo recebido.

O novo envio será processado nas próximas 24 a 48 horas úteis e receberá um e-mail com o novo número de rastreamento assim que for expedido.

Agradecemos a sua paciência e pedimos desculpa pelo transtorno.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Use quando o fornecedor aceita reenviar. A cliente fica satisfeita, não há logística inversa e o custo é mínimo."
      },
      {
        label: "💶 DEFEITO — REEMBOLSO PARCIAL",
        subject: "Re: Problema com a Encomenda #[nº_encomenda] — Compensação",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar e pedimos sinceras desculpas pelo sucedido com a sua encomenda #[nº_encomenda].

Confirmamos que o artigo apresenta [defeito], o que não corresponde aos nossos padrões de qualidade.

Como forma de compensação imediata, processámos um reembolso parcial de [valor]€ diretamente para o seu método de pagamento original. Este valor deverá aparecer na sua conta no prazo de 5 a 10 dias úteis, dependendo da sua instituição bancária.

Não necessita de devolver o artigo — pode ficar com ele.

Caso prefira receber um novo artigo em substituição, informe-nos e tratamos do reenvio sem qualquer custo adicional.

Lamentamos o inconveniente e agradecemos a sua compreensão.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Reembolso parcial de 20–40% resolve a maioria dos casos. A cliente fica com o artigo e evita chargebacks."
      },
      {
        label: "🎁 TAMANHO ERRADO — NEGADO + VOUCHER",
        subject: "Re: Pedido de Devolução — Encomenda #[nº_encomenda]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar relativamente à sua encomenda #[nº_encomenda].

Lamentamos que o tamanho selecionado não tenha sido o mais adequado. Compreendemos que escolher o tamanho correto online pode ser um desafio.

De acordo com a nossa Política de Reembolso, não aceitamos devoluções por motivos de tamanho ou ajuste, uma vez que disponibilizamos tabelas de tamanhos detalhadas em cada página de produto.

No entanto, como gesto de boa vontade e por valorizarmos a sua confiança na nossa marca, gostaríamos de oferecer-lhe um código de desconto de [10/15]% na sua próxima compra:

Código: [inserir cupom de desconto]

Este código é válido por 30 dias e pode ser utilizado em qualquer artigo do nosso website.

Esperamos poder continuar a contar com a sua confiança.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "O voucher amortiza a insatisfação e incentiva nova compra — mais eficaz do que um simples não."
      },
      {
        label: "✗ MUDANÇA DE IDEIA — NEGADO",
        subject: "Re: Pedido de Devolução — Encomenda #[nº_encomenda] | [nome da marca]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar relativamente à sua encomenda #[nº_encomenda].

Lamentamos que a peça não tenha correspondido às suas expectativas. Compreendemos que por vezes um artigo pode não ser exatamente o que imaginávamos ao vê-lo online.

De acordo com a nossa Política de Reembolso — disponível no nosso website e aceite no momento da compra — não aceitamos devoluções por motivos de preferência pessoal ou mudança de ideia. A nossa política aplica-se exclusivamente a artigos com defeito comprovado ou entregues incorretamente.

Agradecemos a sua compreensão e esperamos poder continuar a contar com a sua confiança em futuras compras.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`
      },
      {
        label: "✗ PROMOÇÃO / FORA DO PRAZO — NEGADO",
        subject: "Re: Pedido de Devolução — Encomenda #[nº_encomenda] | [nome da marca]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar relativamente à sua encomenda #[nº_encomenda].

Após análise do seu pedido, verificamos que [o artigo foi adquirido durante um período de promoção/liquidação / o contacto foi efetuado após o prazo de 7 dias previsto na nossa política].

De acordo com a nossa Política de Reembolso, [artigos em promoção estão excluídos do direito de devolução / pedidos devem ser submetidos no prazo máximo de 7 dias após receção], exceto em caso de defeito de fabrico comprovado.

Caso considere que o artigo apresenta um defeito, pedimos que nos envie fotografias detalhadas para que possamos analisar a situação.

Lamentamos não poder dar uma resposta diferente nestas circunstâncias.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`
      }
    ],
    delivery: [
      {
        label: "📦 EM TRÂNSITO — DENTRO DO PRAZO NORMAL",
        subject: "Re: Acompanhamento — Encomenda #[nº_encomenda]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar relativamente à sua encomenda #[nº_encomenda].

Confirmamos que a sua encomenda foi enviada em [data_envio] com o número de rastreamento: [nº_rastreamento].

Pode acompanhar o estado da entrega em tempo real aqui:
[inserir link de rastreamento]

O prazo habitual de entrega é de 6 a 9 dias úteis após envio. A sua encomenda encontra-se dentro deste prazo e deverá chegar em breve.

Caso passados os 9 dias úteis não tenha recebido a encomenda, contacte-nos de imediato e abriremos uma investigação prioritária.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`
      },
      {
        label: "⚠️ ATRASO REAL — INVESTIGAÇÃO ABERTA",
        subject: "Re: Acompanhamento Urgente — Encomenda #[nº_encomenda]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos alertar e pedimos sinceras desculpas pelo atraso na entrega da sua encomenda #[nº_encomenda].

Abrimos de imediato uma investigação com a transportadora para localizar o seu envio com o rastreamento [nº_rastreamento]. A resposta demora habitualmente 24 a 72 horas úteis.

Contactamo-la assim que tivermos uma atualização concreta. Caso a encomenda não seja localizada, procedemos ao reenvio imediato de um novo artigo sem qualquer custo adicional.

Agradecemos a sua paciência.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`
      }
    ],
    legal: [
      {
        label: "⚖️ AMEAÇA COM ADVOGADO — RESPOSTA FORMAL",
        subject: "Re: Encomenda #[nº_encomenda] — Resposta Formal",
        body: `Exma. Sr.ª [nome],

Acusamos a receção da sua mensagem e tomamos nota da intenção de recorrer a assessoria jurídica relativamente à encomenda #[nº_encomenda].

A [nome da marca] opera em plena conformidade com a legislação portuguesa de defesa do consumidor. Todas as nossas políticas estão publicamente disponíveis no nosso website e foram aceites no momento da compra.

Relativamente à situação em concreto: [descreva o facto objetivo].

Permanecemos disponíveis para resolver esta situação dentro das nossas políticas vigentes.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail jurídico da loja]`,
        tip: "IMPORTANTE: Enviar sempre do e-mail jurídico da loja. Nunca admitir culpa. Preencher apenas os factos entre [ ]."
      },
      {
        label: "⚠️ AMEAÇA DE EXPOSIÇÃO — TOM CALMO E PROFISSIONAL",
        subject: "Re: Encomenda #[nº_encomenda]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar. Lemos com atenção a sua mensagem.

Compreendemos a sua frustração e levamos todas as preocupações das nossas clientes muito a sério. A nossa posição baseia-se inteiramente nas políticas aceites no momento da compra, disponíveis publicamente no nosso website.

Estamos inteiramente disponíveis para resolver qualquer situação que se enquadre nessas políticas. Se desejar esclarecimentos adicionais, pode contactar-nos por e-mail ou telefone.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Responde sempre com calma — a tua resposta pode ser publicada também. Profissionalismo é a melhor defesa."
      }
    ]
  },
  BR: {
    refund: [
      {
        label: "✓ DEFEITO / INCORRETO — REENVIO GRATUITO",
        subject: "Re: Problema com o Pedido #[nº_pedido] — Solução Imediata",
        body: `Prezada Sra. [nome],

Obrigada por entrar em contato e pedimos sinceras desculpas pelo ocorrido com seu pedido #[nº_pedido].

Após analisar as fotos que nos enviou, confirmamos que o artigo apresenta [defeito / foi enviado incorretamente]. Assumimos total responsabilidade por essa situação — esse resultado não corresponde aos nossos padrões de qualidade.

Como forma de resolução imediata, procedemos ao reenvio de um novo artigo sem nenhum custo adicional para você. Não precisa devolver o artigo recebido.

O novo envio será processado nas próximas 24 a 48 horas úteis e você receberá um e-mail com o novo código de rastreamento assim que for despachado.

Agradecemos sua paciência e pedimos desculpas pelo transtorno.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Use quando o fornecedor aceita reenviar. A cliente fica satisfeita, não há logística reversa e o custo é mínimo."
      }
    ],
    delivery: [
      {
        label: "📦 EM TRÂNSITO — DENTRO DO PRAZO NORMAL",
        subject: "Re: Acompanhamento — Pedido #[nº_pedido]",
        body: `Prezada Sra. [nome],

Obrigada por entrar em contato sobre seu pedido #[nº_pedido].

Confirmamos que seu pedido foi enviado em [data_envio] com o código de rastreamento: [código_rastreamento].

Você pode acompanhar o status da entrega em tempo real aqui:
[inserir link de rastreamento]

O prazo habitual de entrega é de 6 a 9 dias úteis após envio. Seu pedido está dentro desse prazo e deve chegar em breve.

Caso passados os 9 dias úteis você não tenha recebido o pedido, entre em contato conosco imediatamente e abriremos uma investigação prioritária.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`
      }
    ],
    legal: [
      {
        label: "⚖️ AMEAÇA COM ADVOGADO — RESPOSTA FORMAL",
        subject: "Re: Pedido #[nº_pedido] — Resposta Formal",
        body: `Prezada Sra. [nome],

Acusamos o recebimento de sua mensagem e tomamos nota da intenção de recorrer a assessoria jurídica em relação ao pedido #[nº_pedido].

A [nome da marca] opera em plena conformidade com a legislação brasileira de defesa do consumidor. Todas as nossas políticas estão publicamente disponíveis em nosso site e foram aceitas no momento da compra.

Em relação à situação em concreto: [descreva o fato objetivo].

Permanecemos disponíveis para resolver esta situação dentro de nossas políticas vigentes.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail jurídico da loja]`,
        tip: "IMPORTANTE: Enviar sempre do e-mail jurídico da loja. Nunca admitir culpa. Preencher apenas os fatos entre [ ]."
      }
    ]
  }
}

// Fallback for countries without specific templates
const getInstagramMessages = (code: string): InstagramMessages => {
  return INSTAGRAM_MESSAGES[code] || INSTAGRAM_MESSAGES.PT
}

const getEmailTemplates = (code: string): EmailTemplates => {
  return EMAIL_TEMPLATES[code] || EMAIL_TEMPLATES.PT
}

export function EmailsTemplates({ clientId }: EmailsTemplatesProps) {
  const [selectedCountry, setSelectedCountry] = useState("PT")
  const [activeTab, setActiveTab] = useState<"instagram" | "email">("instagram")
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const instagramMessages = getInstagramMessages(selectedCountry)
  const emailTemplates = getEmailTemplates(selectedCountry)

  // Function to highlight text inside square brackets in red
  const highlightBrackets = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g)
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return <span key={i} className="text-red-400 font-medium">{part}</span>
      }
      return part
    })
  }

  const copyToClipboard = async (text: string, index: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const InstagramCard = ({ part, partKey }: { part: MessagePart; partKey: string }) => (
    <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
      <CardHeader className="bg-[#1a2744] py-3 px-4">
        <CardTitle className="text-white text-sm font-semibold">{part.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {part.versions.map((version, idx) => (
          <div key={idx} className="p-4 bg-[#0B0B10] rounded-xl border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#A855F7]">{version.label}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(version.text, `${partKey}-${idx}`)}
                className="h-7 text-xs text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424]"
              >
                {copiedIndex === `${partKey}-${idx}` ? (
                  <>
                    <Check className="h-3 w-3 mr-1 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{highlightBrackets(version.text)}</p>
          </div>
        ))}
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200">{part.tip}</p>
        </div>
      </CardContent>
    </Card>
  )

  const EmailCard = ({ template, index, section }: { template: EmailTemplate; index: number; section: string }) => (
    <div className="p-4 bg-[#0B0B10] rounded-xl border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#A855F7]">{template.label}</span>
      </div>
      
      {/* Subject */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[rgba(245,245,247,0.52)]">Assunto:</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(template.subject, `${section}-subject-${index}`)}
            className="h-6 text-xs text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424]"
          >
            {copiedIndex === `${section}-subject-${index}` ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <p className="text-sm text-[#F5F5F7] font-medium">{highlightBrackets(template.subject)}</p>
      </div>

      {/* Body */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[rgba(245,245,247,0.52)]">Corpo:</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(template.body, `${section}-body-${index}`)}
            className="h-6 text-xs text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424]"
          >
            {copiedIndex === `${section}-body-${index}` ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{highlightBrackets(template.body)}</p>
      </div>

      {/* Tip */}
      {template.tip && (
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200">{template.tip}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Country Selector */}
      <div className="flex flex-wrap gap-2">
        {COUNTRIES.map((country) => (
          <Button
            key={country.code}
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCountry(country.code)}
            className={selectedCountry === country.code
              ? "bg-[#7B3FE4] hover:bg-[#6D28D9] text-white"
              : "bg-[#101018] border border-[rgba(255,255,255,0.1)] text-[#F5F5F7] hover:bg-[#141424]"
            }
          >
            <span className="mr-2">{country.flag}</span>
            {country.code}
          </Button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("instagram")}
          className={activeTab === "instagram"
            ? "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white"
            : "bg-[#101018] border border-[rgba(255,255,255,0.1)] text-[#F5F5F7] hover:bg-[#141424]"
          }
        >
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("email")}
          className={activeTab === "email"
            ? "bg-[#7B3FE4] hover:bg-[#6D28D9] text-white"
            : "bg-[#101018] border border-[rgba(255,255,255,0.1)] text-[#F5F5F7] hover:bg-[#141424]"
          }
        >
          <Mail className="h-4 w-4 mr-2" />
          E-mail
        </Button>
      </div>

      {/* Content */}
      {activeTab === "instagram" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstagramCard part={instagramMessages.part1} partKey="part1" />
          <InstagramCard part={instagramMessages.part2} partKey="part2" />
          <InstagramCard part={instagramMessages.part3} partKey="part3" />
          <InstagramCard part={instagramMessages.part4} partKey="part4" />
        </div>
      )}

      {activeTab === "email" && (
        <div className="space-y-6">
          {/* Instructions Banner */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-200 mb-1">Instruções de Uso</p>
              <p className="text-xs text-amber-200/80">
                Os campos em <span className="text-red-400 font-medium">[vermelho]</span> devem ser preenchidos com os dados específicos de cada caso antes de enviar. 
                Nunca envie um e-mail sem personalizar todos os campos destacados.
              </p>
            </div>
          </div>

          {/* Refund Templates */}
          <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
            <CardHeader className="bg-[#1a2744] py-3 px-4">
              <CardTitle className="text-white text-sm font-semibold">REEMBOLSO</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {emailTemplates.refund.map((template, idx) => (
                <EmailCard key={idx} template={template} index={idx} section="refund" />
              ))}
            </CardContent>
          </Card>

          {/* Delivery Templates */}
          <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
            <CardHeader className="bg-[#1a2744] py-3 px-4">
              <CardTitle className="text-white text-sm font-semibold">ENTREGA</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {emailTemplates.delivery.map((template, idx) => (
                <EmailCard key={idx} template={template} index={idx} section="delivery" />
              ))}
            </CardContent>
          </Card>

          {/* Legal Templates */}
          <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
            <CardHeader className="bg-[#7f1d1d] py-3 px-4">
              <CardTitle className="text-white text-sm font-semibold">AMEAÇA LEGAL</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {emailTemplates.legal.map((template, idx) => (
                <EmailCard key={idx} template={template} index={idx} section="legal" />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
