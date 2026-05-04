"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check, Lightbulb } from "lucide-react"

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

// Messages organized by country code
const MESSAGES: Record<string, {
  part1: { title: string; versions: { label: string; text: string }[]; tip: string };
  part2: { title: string; versions: { label: string; text: string }[]; tip: string };
  part3: { title: string; versions: { label: string; text: string }[]; tip: string };
  part4: { title: string; versions: { label: string; text: string }[]; tip: string };
}> = {
  PT: {
    part1: {
      title: "DM: Encomenda / Não recebi / Problemas",
      versions: [
        { label: "VERSÃO 1 — Direta", text: "Olá! 🌸 Obrigada por nos contactar. Para questões relacionadas com a sua encomenda, pedimos que nos envie um e-mail para [e-mail] com o número da encomenda — a nossa equipa responde em 24 a 48h úteis. Estamos aqui para ajudar! 💛" },
        { label: "VERSÃO 2 — Com mais calor", text: "Olá, {nome}! 🌸 Lamentamos o inconveniente. Para que possamos resolver a sua situação com toda a atenção que merece, pedimos que nos contacte por e-mail: 📩 [e-mail] Inclua o número da encomenda e a nossa equipa responde em 24 a 48h úteis. Obrigada pela sua paciência! 💛" },
        { label: "VERSÃO 3 — Super curta", text: "Olá! 🌸 Para questões sobre encomendas, envia-nos um e-mail para [e-mail] com o teu número de encomenda. Respondemos em 24 a 48h! 💛" },
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
        { label: "VERSÃO 1 — Direta", text: "Olá! 🌸 Obrigada por entrar em contato. Para questões relacionadas ao seu pedido, pedimos que nos envie um e-mail para [e-mail] com o número do pedido — nossa equipe responde em 24 a 48h úteis. Estamos aqui para ajudar! 💛" },
        { label: "VERSÃO 2 — Com mais calor", text: "Olá, {nome}! 🌸 Lamentamos o inconveniente. Para que possamos resolver sua situação com toda a atenção que merece, pedimos que entre em contato por e-mail: 📩 [e-mail] Inclua o número do pedido e nossa equipe responde em 24 a 48h úteis. Obrigada pela paciência! 💛" },
        { label: "VERSÃO 3 — Super curta", text: "Olá! 🌸 Para questões sobre pedidos, envie um e-mail para [e-mail] com o número do seu pedido. Respondemos em 24 a 48h! 💛" },
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
  },
  ES: {
    part1: {
      title: "DM: Pedido / No recibí / Problemas",
      versions: [
        { label: "VERSIÓN 1 — Directa", text: "¡Hola! 🌸 Gracias por contactarnos. Para cuestiones relacionadas con tu pedido, te pedimos que nos envíes un correo a [e-mail] con el número del pedido — nuestro equipo responde en 24 a 48h laborables. ¡Estamos aquí para ayudarte! 💛" },
        { label: "VERSIÓN 2 — Con más calidez", text: "¡Hola, {nombre}! 🌸 Lamentamos el inconveniente. Para que podamos resolver tu situación con toda la atención que merece, te pedimos que contactes por correo: 📩 [e-mail] Incluye el número del pedido y nuestro equipo responde en 24 a 48h laborables. ¡Gracias por tu paciencia! 💛" },
        { label: "VERSIÓN 3 — Súper corta", text: "¡Hola! 🌸 Para cuestiones sobre pedidos, envíanos un correo a [e-mail] con tu número de pedido. ¡Respondemos en 24 a 48h! 💛" },
      ],
      tip: "En el día a día usa la Versión 3 para responder rápido. Si la cliente insiste, usa la Versión 1 o 2."
    },
    part2: {
      title: "Comentarios en el Feed: Preguntas sobre Precio",
      versions: [
        { label: "VERSIÓN 1 — Neutra y directa", text: "¡Hola! 🌸 Toda la información sobre precio, tallas y disponibilidad está en nuestra web, ¡accede por el link en la bio! 💛" },
        { label: "VERSIÓN 2 — Con entusiasmo", text: "¡Hola! 😍 Puedes ver el precio y todos los detalles de este producto directamente en nuestra web, ¡solo haz clic en el link de la bio! Tenemos envío gratis en España 💛" },
        { label: "VERSIÓN 3 — Con urgencia sutil", text: "¡Hola! 🌸 El precio y disponibilidad están en nuestra web, ¡accede por el link en la bio antes de que se agote! 😉💛" },
      ],
      tip: "Nunca pongas el precio en los comentarios — obliga a la cliente a ir a la web, aumenta el tráfico y la probabilidad de compra."
    },
    part3: {
      title: "Comentarios en el Feed: ¿Dónde compro? / ¿Cómo hago pedido?",
      versions: [
        { label: "VERSIÓN ÚNICA — Rápida y completa", text: "¡Hola! 🌸 Solo tienes que acceder a nuestra web por el link en la bio, elegir tu talla y color y finalizar la compra. ¡Envío gratis en España! Cualquier duda estamos aquí 💛" },
      ],
      tip: "Respuesta simple que lo resuelve todo — dirige a la web y cierra con disponibilidad para ayudar."
    },
    part4: {
      title: "DM: ¿Dónde está la tienda? / ¿Tienen tienda física?",
      versions: [
        { label: "VERSIÓN 1 — Emotiva y honesta", text: "¡Hola! 🌸 Gracias por contactarnos. Nuestra tienda física en [ciudad] cerró durante la pandemia en 2020 — fue un momento muy difícil para nosotros, como para tantas pequeñas marcas españolas. ¡Pero nos reinventamos! Hoy llegamos a toda España a través de nuestra web [site] con envío gratis, pago por [métodos de pago] y entrega rápida por [transportadora]. ¡Esperamos poder recibirte (online) pronto! 💛" },
        { label: "VERSIÓN 2 — Más corta y directa", text: "¡Hola! 🌸 Nuestra tienda física cerró en 2020 durante la pandemia. ¡Desde entonces estamos online y llegamos a toda España! Puedes encontrar todas nuestras prendas en [site], envío gratis y entrega por [transportadora] 💛" },
        { label: "VERSIÓN 3 — Súper corta", text: "¡Hola! 🌸 Nuestra tienda física cerró en 2020 pero ¡estamos online para toda España! Visítanos en [site] envío gratis 💛" },
      ],
      tip: "La Versión 1 humaniza la marca y crea empatía — ideal cuando la cliente parece genuinamente interesada. La Versión 3 es para el día a día."
    }
  },
  GB: {
    part1: {
      title: "DM: Order / Not received / Issues",
      versions: [
        { label: "VERSION 1 — Direct", text: "Hello! 🌸 Thank you for reaching out. For any order-related queries, please email us at [e-mail] with your order number — our team responds within 24 to 48 business hours. We're here to help! 💛" },
        { label: "VERSION 2 — Warmer", text: "Hello, {name}! 🌸 We're sorry for the inconvenience. To resolve your situation with all the attention it deserves, please contact us by email: 📩 [e-mail] Include your order number and our team will respond within 24 to 48 business hours. Thank you for your patience! 💛" },
        { label: "VERSION 3 — Super short", text: "Hello! 🌸 For order queries, please email us at [e-mail] with your order number. We respond within 24 to 48h! 💛" },
      ],
      tip: "Use Version 3 for quick daily responses. If the customer insists, use Version 1 or 2."
    },
    part2: {
      title: "Feed Comments: Price Questions",
      versions: [
        { label: "VERSION 1 — Neutral and direct", text: "Hello! 🌸 All information about price, sizes and availability is on our website, access it via the link in bio! 💛" },
        { label: "VERSION 2 — With enthusiasm", text: "Hello! 😍 You can see the price and all details of this product directly on our website, just click the link in bio! We have free shipping in the UK 💛" },
        { label: "VERSION 3 — With subtle urgency", text: "Hello! 🌸 Price and availability are on our website, access via the link in bio before it sells out! 😉💛" },
      ],
      tip: "Never post the price in comments — it makes the customer go to the website, increasing traffic and purchase probability."
    },
    part3: {
      title: "Feed Comments: Where to buy? / How to order?",
      versions: [
        { label: "SINGLE VERSION — Quick and complete", text: "Hello! 🌸 Just visit our website via the link in bio, choose your size and colour and complete your purchase! Free delivery in the UK. Any questions, we're here 💛" },
      ],
      tip: "Simple response that resolves everything — directs to the website and closes with availability to help."
    },
    part4: {
      title: "DM: Where's the shop? / Do you have a physical store?",
      versions: [
        { label: "VERSION 1 — Emotive and honest", text: "Hello! 🌸 Thank you for reaching out. Our physical store in [city] closed during the pandemic in 2020 — it was a very difficult time for us, as for so many small British brands. But we reinvented ourselves! Today we reach all of the UK through our website [site] with free shipping, payment via [payment methods] and fast delivery by [courier]. We hope to welcome you (online) soon! 💛" },
        { label: "VERSION 2 — Shorter and direct", text: "Hello! 🌸 Our physical store closed in 2020 during the pandemic. Since then we've been online and reach all of the UK! You can find all our pieces at [site], free shipping and delivery by [courier] 💛" },
        { label: "VERSION 3 — Super short", text: "Hello! 🌸 Our physical store closed in 2020 but we're online for all of the UK! Visit us at [site] free shipping 💛" },
      ],
      tip: "Version 1 humanises the brand and creates empathy — ideal when the customer seems genuinely interested. Version 3 is for daily use."
    }
  },
  US: {
    part1: {
      title: "DM: Order / Not received / Issues",
      versions: [
        { label: "VERSION 1 — Direct", text: "Hi there! 🌸 Thanks for reaching out. For any order-related questions, please email us at [e-mail] with your order number — our team responds within 24 to 48 business hours. We're here to help! 💛" },
        { label: "VERSION 2 — Warmer", text: "Hi {name}! 🌸 We're sorry for the inconvenience. To resolve your situation with all the attention it deserves, please contact us by email: 📩 [e-mail] Include your order number and our team will respond within 24 to 48 business hours. Thanks for your patience! 💛" },
        { label: "VERSION 3 — Super short", text: "Hi! 🌸 For order questions, email us at [e-mail] with your order number. We respond within 24 to 48h! 💛" },
      ],
      tip: "Use Version 3 for quick daily responses. If the customer insists, use Version 1 or 2."
    },
    part2: {
      title: "Feed Comments: Price Questions",
      versions: [
        { label: "VERSION 1 — Neutral and direct", text: "Hi! 🌸 All info about price, sizes and availability is on our website, check the link in bio! 💛" },
        { label: "VERSION 2 — With enthusiasm", text: "Hi! 😍 You can see the price and all details of this product on our website, just click the link in bio! We have free shipping in the US 💛" },
        { label: "VERSION 3 — With subtle urgency", text: "Hi! 🌸 Price and availability are on our website, check the link in bio before it sells out! 😉💛" },
      ],
      tip: "Never post the price in comments — it makes the customer visit the website, increasing traffic and purchase probability."
    },
    part3: {
      title: "Feed Comments: Where to buy? / How to order?",
      versions: [
        { label: "SINGLE VERSION — Quick and complete", text: "Hi! 🌸 Just visit our website via the link in bio, pick your size and color and checkout! Free shipping in the US. Any questions, we're here 💛" },
      ],
      tip: "Simple response that resolves everything — directs to the website and closes with availability to help."
    },
    part4: {
      title: "DM: Where's the store? / Do you have a physical location?",
      versions: [
        { label: "VERSION 1 — Emotive and honest", text: "Hi! 🌸 Thanks for reaching out. Our physical store in [city] closed during the pandemic in 2020 — it was a really tough time for us, like for so many small American brands. But we reinvented ourselves! Today we ship across the US through our website [site] with free shipping, payment via [payment methods] and fast delivery by [courier]. We hope to welcome you (online) soon! 💛" },
        { label: "VERSION 2 — Shorter and direct", text: "Hi! 🌸 Our physical store closed in 2020 during the pandemic. Since then we've been online and ship across the US! You can find all our pieces at [site], free shipping and delivery by [courier] 💛" },
        { label: "VERSION 3 — Super short", text: "Hi! 🌸 Our physical store closed in 2020 but we're online across the US! Visit us at [site] free shipping 💛" },
      ],
      tip: "Version 1 humanizes the brand and creates empathy — ideal when the customer seems genuinely interested. Version 3 is for daily use."
    }
  },
  CA: {
    part1: {
      title: "DM: Order / Not received / Issues",
      versions: [
        { label: "VERSION 1 — Direct", text: "Hello! 🌸 Thank you for reaching out. For any order-related questions, please email us at [e-mail] with your order number — our team responds within 24 to 48 business hours. We're here to help! 💛" },
        { label: "VERSION 2 — Warmer", text: "Hello {name}! 🌸 We're sorry for the inconvenience. To resolve your situation with all the attention it deserves, please contact us by email: 📩 [e-mail] Include your order number and our team will respond within 24 to 48 business hours. Thank you for your patience! 💛" },
        { label: "VERSION 3 — Super short", text: "Hello! 🌸 For order questions, email us at [e-mail] with your order number. We respond within 24 to 48h! 💛" },
      ],
      tip: "Use Version 3 for quick daily responses. If the customer insists, use Version 1 or 2."
    },
    part2: {
      title: "Feed Comments: Price Questions",
      versions: [
        { label: "VERSION 1 — Neutral and direct", text: "Hello! 🌸 All information about price, sizes and availability is on our website, check the link in bio! 💛" },
        { label: "VERSION 2 — With enthusiasm", text: "Hello! 😍 You can see the price and all details of this product on our website, just click the link in bio! We have free shipping in Canada 💛" },
        { label: "VERSION 3 — With subtle urgency", text: "Hello! 🌸 Price and availability are on our website, check the link in bio before it sells out! 😉💛" },
      ],
      tip: "Never post the price in comments — it makes the customer visit the website, increasing traffic and purchase probability."
    },
    part3: {
      title: "Feed Comments: Where to buy? / How to order?",
      versions: [
        { label: "SINGLE VERSION — Quick and complete", text: "Hello! 🌸 Just visit our website via the link in bio, pick your size and colour and checkout! Free shipping in Canada. Any questions, we're here 💛" },
      ],
      tip: "Simple response that resolves everything — directs to the website and closes with availability to help."
    },
    part4: {
      title: "DM: Where's the store? / Do you have a physical location?",
      versions: [
        { label: "VERSION 1 — Emotive and honest", text: "Hello! 🌸 Thank you for reaching out. Our physical store in [city] closed during the pandemic in 2020 — it was a very difficult time for us, like for so many small Canadian brands. But we reinvented ourselves! Today we ship across Canada through our website [site] with free shipping, payment via [payment methods] and fast delivery by [courier]. We hope to welcome you (online) soon! 💛" },
        { label: "VERSION 2 — Shorter and direct", text: "Hello! 🌸 Our physical store closed in 2020 during the pandemic. Since then we've been online and ship across Canada! You can find all our pieces at [site], free shipping and delivery by [courier] 💛" },
        { label: "VERSION 3 — Super short", text: "Hello! 🌸 Our physical store closed in 2020 but we're online across Canada! Visit us at [site] free shipping 💛" },
      ],
      tip: "Version 1 humanizes the brand and creates empathy — ideal when the customer seems genuinely interested. Version 3 is for daily use."
    }
  },
  IT: {
    part1: {
      title: "DM: Ordine / Non ricevuto / Problemi",
      versions: [
        { label: "VERSIONE 1 — Diretta", text: "Ciao! 🌸 Grazie per averci contattato. Per questioni relative al tuo ordine, ti chiediamo di inviarci un'e-mail a [e-mail] con il numero dell'ordine — il nostro team risponde entro 24-48 ore lavorative. Siamo qui per aiutarti! 💛" },
        { label: "VERSIONE 2 — Più calorosa", text: "Ciao {nome}! 🌸 Ci dispiace per l'inconveniente. Per risolvere la tua situazione con tutta l'attenzione che merita, ti chiediamo di contattarci via e-mail: 📩 [e-mail] Includi il numero dell'ordine e il nostro team risponderà entro 24-48 ore lavorative. Grazie per la pazienza! 💛" },
        { label: "VERSIONE 3 — Super breve", text: "Ciao! 🌸 Per questioni sugli ordini, inviaci un'e-mail a [e-mail] con il numero del tuo ordine. Rispondiamo in 24-48h! 💛" },
      ],
      tip: "Nel quotidiano usa la Versione 3 per rispondere velocemente. Se la cliente insiste, usa la Versione 1 o 2."
    },
    part2: {
      title: "Commenti nel Feed: Domande sul Prezzo",
      versions: [
        { label: "VERSIONE 1 — Neutra e diretta", text: "Ciao! 🌸 Tutte le informazioni su prezzo, taglie e disponibilità sono sul nostro sito, accedi dal link in bio! 💛" },
        { label: "VERSIONE 2 — Con entusiasmo", text: "Ciao! 😍 Puoi vedere il prezzo e tutti i dettagli di questo prodotto direttamente sul nostro sito, basta cliccare sul link in bio! Abbiamo spedizione gratuita in Italia 💛" },
        { label: "VERSIONE 3 — Con urgenza sottile", text: "Ciao! 🌸 Prezzo e disponibilità sono sul nostro sito, accedi dal link in bio prima che finisca! 😉💛" },
      ],
      tip: "Mai mettere il prezzo nei commenti — obbliga la cliente ad andare sul sito, aumenta il traffico e la probabilità di acquisto."
    },
    part3: {
      title: "Commenti nel Feed: Dove compro? / Come ordino?",
      versions: [
        { label: "VERSIONE UNICA — Veloce e completa", text: "Ciao! 🌸 Basta accedere al nostro sito dal link in bio, scegliere la tua taglia e colore e completare l'acquisto! Consegna gratuita in Italia. Per qualsiasi domanda siamo qui 💛" },
      ],
      tip: "Risposta semplice che risolve tutto — indirizza al sito e chiude con disponibilità ad aiutare."
    },
    part4: {
      title: "DM: Dov'è il negozio? / Avete un negozio fisico?",
      versions: [
        { label: "VERSIONE 1 — Emotiva e onesta", text: "Ciao! 🌸 Grazie per averci contattato. Il nostro negozio fisico a [città] ha chiuso durante la pandemia nel 2020 — è stato un momento molto difficile per noi, come per tanti piccoli marchi italiani. Ma ci siamo reinventati! Oggi raggiungiamo tutta l'Italia attraverso il nostro sito [site] con spedizione gratuita, pagamento tramite [metodi di pagamento] e consegna rapida con [corriere]. Speriamo di accoglierti (online) presto! 💛" },
        { label: "VERSIONE 2 — Più breve e diretta", text: "Ciao! 🌸 Il nostro negozio fisico ha chiuso nel 2020 durante la pandemia. Da allora siamo online e raggiungiamo tutta l'Italia! Puoi trovare tutti i nostri capi su [site], spedizione gratuita e consegna con [corriere] 💛" },
        { label: "VERSIONE 3 — Super breve", text: "Ciao! 🌸 Il nostro negozio fisico ha chiuso nel 2020 ma siamo online per tutta l'Italia! Visitaci su [site] spedizione gratuita 💛" },
      ],
      tip: "La Versione 1 umanizza il brand e crea empatia — ideale quando la cliente sembra genuinamente interessata. La Versione 3 è per il quotidiano."
    }
  },
  FR: {
    part1: {
      title: "DM: Commande / Non reçu / Problèmes",
      versions: [
        { label: "VERSION 1 — Directe", text: "Bonjour ! 🌸 Merci de nous contacter. Pour toute question concernant votre commande, veuillez nous envoyer un e-mail à [e-mail] avec votre numéro de commande — notre équipe répond sous 24 à 48h ouvrées. Nous sommes là pour vous aider ! 💛" },
        { label: "VERSION 2 — Plus chaleureuse", text: "Bonjour {nom} ! 🌸 Nous sommes désolés pour ce désagrément. Pour résoudre votre situation avec toute l'attention qu'elle mérite, veuillez nous contacter par e-mail : 📩 [e-mail] Incluez votre numéro de commande et notre équipe vous répondra sous 24 à 48h ouvrées. Merci de votre patience ! 💛" },
        { label: "VERSION 3 — Super courte", text: "Bonjour ! 🌸 Pour les questions sur les commandes, envoyez-nous un e-mail à [e-mail] avec votre numéro de commande. Nous répondons sous 24 à 48h ! 💛" },
      ],
      tip: "Au quotidien, utilisez la Version 3 pour répondre rapidement. Si la cliente insiste, utilisez la Version 1 ou 2."
    },
    part2: {
      title: "Commentaires dans le Feed : Questions sur le Prix",
      versions: [
        { label: "VERSION 1 — Neutre et directe", text: "Bonjour ! 🌸 Toutes les informations sur le prix, les tailles et la disponibilité sont sur notre site, accédez-y via le lien en bio ! 💛" },
        { label: "VERSION 2 — Avec enthousiasme", text: "Bonjour ! 😍 Vous pouvez voir le prix et tous les détails de ce produit directement sur notre site, il suffit de cliquer sur le lien en bio ! Livraison gratuite en France 💛" },
        { label: "VERSION 3 — Avec une urgence subtile", text: "Bonjour ! 🌸 Le prix et la disponibilité sont sur notre site, accédez via le lien en bio avant rupture de stock ! 😉💛" },
      ],
      tip: "Ne jamais mettre le prix dans les commentaires — cela oblige la cliente à aller sur le site, augmente le trafic et la probabilité d'achat."
    },
    part3: {
      title: "Commentaires dans le Feed : Où acheter ? / Comment commander ?",
      versions: [
        { label: "VERSION UNIQUE — Rapide et complète", text: "Bonjour ! 🌸 Il suffit d'accéder à notre site via le lien en bio, choisir votre taille et couleur et finaliser votre achat ! Livraison gratuite en France. Pour toute question, nous sommes là 💛" },
      ],
      tip: "Réponse simple qui résout tout — dirige vers le site et conclut avec la disponibilité pour aider."
    },
    part4: {
      title: "DM : Où est la boutique ? / Avez-vous une boutique physique ?",
      versions: [
        { label: "VERSION 1 — Émotive et honnête", text: "Bonjour ! 🌸 Merci de nous contacter. Notre boutique physique à [ville] a fermé pendant la pandémie en 2020 — ce fut un moment très difficile pour nous, comme pour tant de petites marques françaises. Mais nous nous sommes réinventés ! Aujourd'hui, nous livrons toute la France via notre site [site] avec livraison gratuite, paiement par [moyens de paiement] et livraison rapide par [transporteur]. Nous espérons vous accueillir (en ligne) bientôt ! 💛" },
        { label: "VERSION 2 — Plus courte et directe", text: "Bonjour ! 🌸 Notre boutique physique a fermé en 2020 pendant la pandémie. Depuis, nous sommes en ligne et livrons toute la France ! Vous pouvez trouver toutes nos pièces sur [site], livraison gratuite et par [transporteur] 💛" },
        { label: "VERSION 3 — Super courte", text: "Bonjour ! 🌸 Notre boutique physique a fermé en 2020 mais nous sommes en ligne pour toute la France ! Visitez-nous sur [site] livraison gratuite 💛" },
      ],
      tip: "La Version 1 humanise la marque et crée de l'empathie — idéale quand la cliente semble vraiment intéressée. La Version 3 est pour le quotidien."
    }
  },
  DE: {
    part1: {
      title: "DM: Bestellung / Nicht erhalten / Probleme",
      versions: [
        { label: "VERSION 1 — Direkt", text: "Hallo! 🌸 Danke für Ihre Nachricht. Bei Fragen zu Ihrer Bestellung senden Sie uns bitte eine E-Mail an [e-mail] mit Ihrer Bestellnummer — unser Team antwortet innerhalb von 24 bis 48 Geschäftsstunden. Wir sind hier, um zu helfen! 💛" },
        { label: "VERSION 2 — Wärmer", text: "Hallo {Name}! 🌸 Es tut uns leid für die Unannehmlichkeiten. Um Ihre Situation mit aller Aufmerksamkeit zu lösen, die sie verdient, kontaktieren Sie uns bitte per E-Mail: 📩 [e-mail] Geben Sie Ihre Bestellnummer an und unser Team antwortet innerhalb von 24 bis 48 Geschäftsstunden. Danke für Ihre Geduld! 💛" },
        { label: "VERSION 3 — Super kurz", text: "Hallo! 🌸 Bei Bestellfragen senden Sie uns eine E-Mail an [e-mail] mit Ihrer Bestellnummer. Wir antworten innerhalb von 24-48h! 💛" },
      ],
      tip: "Im Alltag nutzen Sie Version 3 für schnelle Antworten. Wenn die Kundin insistiert, nutzen Sie Version 1 oder 2."
    },
    part2: {
      title: "Feed-Kommentare: Preisfragen",
      versions: [
        { label: "VERSION 1 — Neutral und direkt", text: "Hallo! 🌸 Alle Informationen zu Preis, Größen und Verfügbarkeit finden Sie auf unserer Website, über den Link in der Bio! 💛" },
        { label: "VERSION 2 — Mit Begeisterung", text: "Hallo! 😍 Sie können den Preis und alle Details dieses Produkts direkt auf unserer Website sehen, klicken Sie einfach auf den Link in der Bio! Kostenloser Versand in Deutschland 💛" },
        { label: "VERSION 3 — Mit subtiler Dringlichkeit", text: "Hallo! 🌸 Preis und Verfügbarkeit finden Sie auf unserer Website, über den Link in der Bio, bevor es ausverkauft ist! 😉💛" },
      ],
      tip: "Niemals den Preis in den Kommentaren posten — es bringt die Kundin auf die Website, erhöht den Traffic und die Kaufwahrscheinlichkeit."
    },
    part3: {
      title: "Feed-Kommentare: Wo kaufen? / Wie bestellen?",
      versions: [
        { label: "EINZIGE VERSION — Schnell und vollständig", text: "Hallo! 🌸 Besuchen Sie einfach unsere Website über den Link in der Bio, wählen Sie Ihre Größe und Farbe und schließen Sie den Kauf ab! Kostenloser Versand in Deutschland. Bei Fragen sind wir hier 💛" },
      ],
      tip: "Einfache Antwort, die alles löst — leitet zur Website und schließt mit Hilfsbereitschaft ab."
    },
    part4: {
      title: "DM: Wo ist das Geschäft? / Haben Sie ein Ladengeschäft?",
      versions: [
        { label: "VERSION 1 — Emotional und ehrlich", text: "Hallo! 🌸 Danke für Ihre Nachricht. Unser Ladengeschäft in [Stadt] wurde während der Pandemie 2020 geschlossen — es war eine sehr schwierige Zeit für uns, wie für so viele kleine deutsche Marken. Aber wir haben uns neu erfunden! Heute liefern wir in ganz Deutschland über unsere Website [site] mit kostenlosem Versand, Zahlung per [Zahlungsmethoden] und schneller Lieferung durch [Lieferdienst]. Wir hoffen, Sie bald (online) begrüßen zu dürfen! 💛" },
        { label: "VERSION 2 — Kürzer und direkter", text: "Hallo! 🌸 Unser Ladengeschäft wurde 2020 während der Pandemie geschlossen. Seitdem sind wir online und liefern in ganz Deutschland! Sie finden alle unsere Artikel auf [site], kostenloser Versand und Lieferung durch [Lieferdienst] 💛" },
        { label: "VERSION 3 — Super kurz", text: "Hallo! 🌸 Unser Ladengeschäft wurde 2020 geschlossen, aber wir sind online für ganz Deutschland! Besuchen Sie uns auf [site] kostenloser Versand 💛" },
      ],
      tip: "Version 1 vermenschlicht die Marke und schafft Empathie — ideal wenn die Kundin wirklich interessiert scheint. Version 3 ist für den Alltag."
    }
  }
}

export function EmailsTemplates({ clientId }: EmailsTemplatesProps) {
  const [selectedCountry, setSelectedCountry] = useState("PT")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messages = MESSAGES[selectedCountry]

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const renderSection = (part: typeof messages.part1, partKey: string) => (
    <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
      <CardHeader className="bg-[#1a2744] py-3 px-4">
        <CardTitle className="text-white text-sm font-semibold">{part.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {part.versions.map((version, idx) => (
            <div
              key={`${partKey}-${idx}`}
              className="bg-[#171723] rounded-xl border border-[rgba(255,255,255,0.06)] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#A855F7]">{version.label}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(version.text, `${partKey}-${idx}`)}
                  className="h-7 px-2 text-xs text-[rgba(245,245,247,0.72)] hover:text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.08)]"
                >
                  {copiedId === `${partKey}-${idx}` ? (
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
              <p className="text-sm text-[rgba(245,245,247,0.72)] leading-relaxed">{version.text}</p>
            </div>
          ))}
        </div>
        
        {/* Tip box */}
        <div className="flex items-start gap-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] rounded-xl p-4">
          <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200">{part.tip}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
        <CardHeader className="bg-[#1a2744] py-3 px-4">
          <CardTitle className="text-white text-sm font-semibold">Selecionar Idioma</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((country) => (
              <Button
                key={country.code}
                variant="ghost"
                onClick={() => setSelectedCountry(country.code)}
                className={
                  selectedCountry === country.code
                    ? "bg-[#7B3FE4] hover:bg-[#6D28D9] text-white border border-[#7B3FE4] h-10 px-4"
                    : "bg-transparent border border-[rgba(255,255,255,0.2)] text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.3)] h-10 px-4"
                }
              >
                <span className="text-lg mr-2">{country.flag}</span>
                <span className="text-sm">{country.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message sections */}
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-6 pr-4">
          {renderSection(messages.part1, "part1")}
          {renderSection(messages.part2, "part2")}
          {renderSection(messages.part3, "part3")}
          {renderSection(messages.part4, "part4")}
        </div>
      </ScrollArea>
    </div>
  )
}
