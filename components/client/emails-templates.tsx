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

// Instagram Messages organized by country code
const INSTAGRAM_MESSAGES: Record<string, {
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
        { label: "SINGLE VERSION — Quick and complete", text: "Hello! 🌸 Just visit our website via the link in bio, pick your size and color and checkout! Free shipping in Canada. Any questions, we're here 💛" },
      ],
      tip: "Simple response that resolves everything — directs to the website and closes with availability to help."
    },
    part4: {
      title: "DM: Where's the store? / Do you have a physical location?",
      versions: [
        { label: "VERSION 1 — Emotive and honest", text: "Hello! 🌸 Thank you for reaching out. Our physical store in [city] closed during the pandemic in 2020 — it was a very difficult time for us, as for so many small Canadian brands. But we reinvented ourselves! Today we ship across Canada through our website [site] with free shipping, payment via [payment methods] and fast delivery by [courier]. We hope to welcome you (online) soon! 💛" },
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
        { label: "VERSIONE 1 — Diretta", text: "Ciao! 🌸 Grazie per averci contattato. Per domande sul tuo ordine, ti preghiamo di inviarci un'email a [e-mail] con il numero dell'ordine — il nostro team risponde entro 24-48 ore lavorative. Siamo qui per aiutarti! 💛" },
        { label: "VERSIONE 2 — Più calorosa", text: "Ciao {nome}! 🌸 Ci scusiamo per l'inconveniente. Per risolvere la tua situazione con tutta l'attenzione che merita, ti preghiamo di contattarci via email: 📩 [e-mail] Includi il numero dell'ordine e il nostro team risponderà entro 24-48 ore lavorative. Grazie per la pazienza! 💛" },
        { label: "VERSIONE 3 — Super corta", text: "Ciao! 🌸 Per domande sugli ordini, inviaci un'email a [e-mail] con il tuo numero d'ordine. Rispondiamo entro 24-48h! 💛" },
      ],
      tip: "Nel quotidiano usa la Versione 3 per rispondere velocemente. Se la cliente insiste, usa la Versione 1 o 2."
    },
    part2: {
      title: "Commenti nel Feed: Domande sul Prezzo",
      versions: [
        { label: "VERSIONE 1 — Neutra e diretta", text: "Ciao! 🌸 Tutte le informazioni su prezzo, taglie e disponibilità sono sul nostro sito, accedi dal link in bio! 💛" },
        { label: "VERSIONE 2 — Con entusiasmo", text: "Ciao! 😍 Puoi vedere il prezzo e tutti i dettagli di questo prodotto direttamente sul nostro sito, basta cliccare il link in bio! Spedizione gratuita in Italia 💛" },
        { label: "VERSIONE 3 — Con urgenza sottile", text: "Ciao! 🌸 Prezzo e disponibilità sono sul nostro sito, accedi dal link in bio prima che finisca! 😉💛" },
      ],
      tip: "Non mettere mai il prezzo nei commenti — obbliga la cliente ad andare sul sito, aumentando traffico e probabilità di acquisto."
    },
    part3: {
      title: "Commenti nel Feed: Dove compro? / Come ordino?",
      versions: [
        { label: "VERSIONE UNICA — Rapida e completa", text: "Ciao! 🌸 Basta accedere al nostro sito dal link in bio, scegliere la tua taglia e colore e completare l'acquisto! Spedizione gratuita in Italia. Per qualsiasi domanda siamo qui 💛" },
      ],
      tip: "Risposta semplice che risolve tutto — indirizza al sito e chiude con disponibilità ad aiutare."
    },
    part4: {
      title: "DM: Dov'è il negozio? / Avete un negozio fisico?",
      versions: [
        { label: "VERSIONE 1 — Emotiva e onesta", text: "Ciao! 🌸 Grazie per averci contattato. Il nostro negozio fisico a [città] ha chiuso durante la pandemia nel 2020 — è stato un momento molto difficile per noi, come per tanti piccoli brand italiani. Ma ci siamo reinventati! Oggi raggiungiamo tutta l'Italia attraverso il nostro sito [site] con spedizione gratuita, pagamento con [metodi di pagamento] e consegna rapida con [corriere]. Speriamo di accoglierti (online) presto! 💛" },
        { label: "VERSIONE 2 — Più corta e diretta", text: "Ciao! 🌸 Il nostro negozio fisico ha chiuso nel 2020 durante la pandemia. Da allora siamo online e raggiungiamo tutta l'Italia! Puoi trovare tutti i nostri capi su [site], spedizione gratuita e consegna con [corriere] 💛" },
        { label: "VERSIONE 3 — Super corta", text: "Ciao! 🌸 Il nostro negozio fisico ha chiuso nel 2020 ma siamo online per tutta l'Italia! Visitaci su [site] spedizione gratuita 💛" },
      ],
      tip: "La Versione 1 umanizza il brand e crea empatia — ideale quando la cliente sembra genuinamente interessata. La Versione 3 è per l'uso quotidiano."
    }
  },
  FR: {
    part1: {
      title: "DM: Commande / Non reçu / Problèmes",
      versions: [
        { label: "VERSION 1 — Directe", text: "Bonjour ! 🌸 Merci de nous contacter. Pour toute question concernant votre commande, veuillez nous envoyer un e-mail à [e-mail] avec le numéro de commande — notre équipe répond sous 24 à 48h ouvrées. Nous sommes là pour vous aider ! 💛" },
        { label: "VERSION 2 — Plus chaleureuse", text: "Bonjour {nom} ! 🌸 Nous sommes désolés pour ce désagrément. Pour résoudre votre situation avec toute l'attention qu'elle mérite, veuillez nous contacter par e-mail : 📩 [e-mail] Incluez le numéro de commande et notre équipe répondra sous 24 à 48h ouvrées. Merci de votre patience ! 💛" },
        { label: "VERSION 3 — Super courte", text: "Bonjour ! 🌸 Pour les questions sur les commandes, envoyez-nous un e-mail à [e-mail] avec votre numéro de commande. Nous répondons sous 24-48h ! 💛" },
      ],
      tip: "Au quotidien, utilisez la Version 3 pour répondre rapidement. Si la cliente insiste, utilisez la Version 1 ou 2."
    },
    part2: {
      title: "Commentaires dans le Feed: Questions sur le Prix",
      versions: [
        { label: "VERSION 1 — Neutre et directe", text: "Bonjour ! 🌸 Toutes les informations sur le prix, les tailles et la disponibilité sont sur notre site, accédez via le lien dans la bio ! 💛" },
        { label: "VERSION 2 — Avec enthousiasme", text: "Bonjour ! 😍 Vous pouvez voir le prix et tous les détails de ce produit directement sur notre site, il suffit de cliquer sur le lien dans la bio ! Livraison gratuite en France 💛" },
        { label: "VERSION 3 — Avec urgence subtile", text: "Bonjour ! 🌸 Le prix et la disponibilité sont sur notre site, accédez via le lien dans la bio avant rupture de stock ! 😉💛" },
      ],
      tip: "Ne mettez jamais le prix dans les commentaires — cela oblige la cliente à aller sur le site, augmentant le trafic et la probabilité d'achat."
    },
    part3: {
      title: "Commentaires dans le Feed: Où acheter ? / Comment commander ?",
      versions: [
        { label: "VERSION UNIQUE — Rapide et complète", text: "Bonjour ! 🌸 Il suffit d'accéder à notre site via le lien dans la bio, choisir votre taille et couleur et finaliser l'achat ! Livraison gratuite en France. Pour toute question, nous sommes là 💛" },
      ],
      tip: "Réponse simple qui résout tout — dirige vers le site et conclut avec disponibilité pour aider."
    },
    part4: {
      title: "DM: Où est la boutique ? / Avez-vous une boutique physique ?",
      versions: [
        { label: "VERSION 1 — Émotive et honnête", text: "Bonjour ! 🌸 Merci de nous contacter. Notre boutique physique à [ville] a fermé pendant la pandémie en 2020 — ce fut un moment très difficile pour nous, comme pour tant de petites marques françaises. Mais nous nous sommes réinventés ! Aujourd'hui, nous livrons dans toute la France via notre site [site] avec livraison gratuite, paiement par [moyens de paiement] et livraison rapide par [transporteur]. Nous espérons vous accueillir (en ligne) bientôt ! 💛" },
        { label: "VERSION 2 — Plus courte et directe", text: "Bonjour ! 🌸 Notre boutique physique a fermé en 2020 pendant la pandémie. Depuis, nous sommes en ligne et livrons dans toute la France ! Vous pouvez trouver toutes nos pièces sur [site], livraison gratuite et expédition par [transporteur] 💛" },
        { label: "VERSION 3 — Super courte", text: "Bonjour ! 🌸 Notre boutique physique a fermé en 2020 mais nous sommes en ligne pour toute la France ! Visitez-nous sur [site] livraison gratuite 💛" },
      ],
      tip: "La Version 1 humanise la marque et crée de l'empathie — idéale quand la cliente semble vraiment intéressée. La Version 3 est pour l'usage quotidien."
    }
  },
  DE: {
    part1: {
      title: "DM: Bestellung / Nicht erhalten / Probleme",
      versions: [
        { label: "VERSION 1 — Direkt", text: "Hallo! 🌸 Danke für Ihre Nachricht. Bei Fragen zu Ihrer Bestellung senden Sie uns bitte eine E-Mail an [e-mail] mit Ihrer Bestellnummer — unser Team antwortet innerhalb von 24 bis 48 Geschäftsstunden. Wir sind hier, um zu helfen! 💛" },
        { label: "VERSION 2 — Wärmer", text: "Hallo {Name}! 🌸 Es tut uns leid für die Unannehmlichkeiten. Um Ihre Situation mit aller Aufmerksamkeit zu lösen, kontaktieren Sie uns bitte per E-Mail: 📩 [e-mail] Geben Sie Ihre Bestellnummer an und unser Team antwortet innerhalb von 24 bis 48 Geschäftsstunden. Danke für Ihre Geduld! 💛" },
        { label: "VERSION 3 — Super kurz", text: "Hallo! 🌸 Bei Fragen zur Bestellung senden Sie uns eine E-Mail an [e-mail] mit Ihrer Bestellnummer. Wir antworten innerhalb von 24-48h! 💛" },
      ],
      tip: "Im Alltag nutzen Sie Version 3 für schnelle Antworten. Wenn die Kundin insistiert, nutzen Sie Version 1 oder 2."
    },
    part2: {
      title: "Feed-Kommentare: Preisfragen",
      versions: [
        { label: "VERSION 1 — Neutral und direkt", text: "Hallo! 🌸 Alle Informationen zu Preis, Größen und Verfügbarkeit finden Sie auf unserer Website, Zugang über den Link in der Bio! 💛" },
        { label: "VERSION 2 — Mit Begeisterung", text: "Hallo! 😍 Sie können den Preis und alle Details dieses Produkts direkt auf unserer Website sehen, klicken Sie einfach auf den Link in der Bio! Kostenloser Versand in Deutschland 💛" },
        { label: "VERSION 3 — Mit subtiler Dringlichkeit", text: "Hallo! 🌸 Preis und Verfügbarkeit sind auf unserer Website, Zugang über den Link in der Bio bevor es ausverkauft ist! 😉💛" },
      ],
      tip: "Geben Sie niemals den Preis in den Kommentaren an — es bringt die Kundin dazu, die Website zu besuchen, was Traffic und Kaufwahrscheinlichkeit erhöht."
    },
    part3: {
      title: "Feed-Kommentare: Wo kaufen? / Wie bestellen?",
      versions: [
        { label: "EINZELVERSION — Schnell und vollständig", text: "Hallo! 🌸 Besuchen Sie einfach unsere Website über den Link in der Bio, wählen Sie Ihre Größe und Farbe und schließen Sie den Kauf ab! Kostenloser Versand in Deutschland. Bei Fragen sind wir hier 💛" },
      ],
      tip: "Einfache Antwort, die alles löst — leitet zur Website und schließt mit Hilfsbereitschaft."
    },
    part4: {
      title: "DM: Wo ist das Geschäft? / Haben Sie ein Ladengeschäft?",
      versions: [
        { label: "VERSION 1 — Emotional und ehrlich", text: "Hallo! 🌸 Danke für Ihre Nachricht. Unser Ladengeschäft in [Stadt] hat während der Pandemie 2020 geschlossen — es war eine sehr schwierige Zeit für uns, wie für viele kleine deutsche Marken. Aber wir haben uns neu erfunden! Heute liefern wir deutschlandweit über unsere Website [site] mit kostenlosem Versand, Zahlung per [Zahlungsmethoden] und schneller Lieferung durch [Kurier]. Wir hoffen, Sie bald (online) begrüßen zu dürfen! 💛" },
        { label: "VERSION 2 — Kürzer und direkt", text: "Hallo! 🌸 Unser Ladengeschäft hat 2020 während der Pandemie geschlossen. Seitdem sind wir online und liefern deutschlandweit! Sie finden alle unsere Stücke auf [site], kostenloser Versand und Lieferung durch [Kurier] 💛" },
        { label: "VERSION 3 — Super kurz", text: "Hallo! 🌸 Unser Ladengeschäft hat 2020 geschlossen, aber wir sind online für ganz Deutschland! Besuchen Sie uns auf [site] kostenloser Versand 💛" },
      ],
      tip: "Version 1 macht die Marke menschlicher und schafft Empathie — ideal wenn die Kundin wirklich interessiert erscheint. Version 3 ist für den täglichen Gebrauch."
    }
  }
}

// Email Templates organized by country code
const EMAIL_TEMPLATES: Record<string, {
  refund: { label: string; subject: string; body: string; tip?: string }[];
  delivery: { label: string; subject: string; body: string; tip?: string }[];
  legal: { label: string; subject: string; body: string; tip?: string }[];
}> = {
  PT: {
    refund: [
      {
        label: "✓ DEFEITO / INCORRETO — REENVIO GRATUITO",
        subject: "Re: Problema com a Encomenda #{nº_encomenda} — Solução Imediata",
        body: `Exma. Sr.ª {nome},

Obrigada por nos contactar e pedimos sinceras desculpas pelo sucedido com a sua encomenda #{nº_encomenda}.

Após analisar as fotografias que nos enviou, confirmamos que o artigo apresenta {defeito / foi enviado incorretamente}. Assumimos total responsabilidade por esta situação — este resultado não corresponde aos nossos padrões de qualidade.

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
        subject: "Re: Problema com a Encomenda #{nº_encomenda} — Compensação",
        body: `Exma. Sr.ª {nome},

Obrigada por nos contactar e pedimos sinceras desculpas pelo sucedido com a sua encomenda #{nº_encomenda}.

Confirmamos que o artigo apresenta {defeito}, o que não corresponde aos nossos padrões de qualidade.

Como forma de compensação imediata, processámos um reembolso parcial de {valor}€ diretamente para o seu método de pagamento original. Este valor deverá aparecer na sua conta no prazo de 5 a 10 dias úteis, dependendo da sua instituição bancária.

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
        subject: "Re: Pedido de Devolução — Encomenda #{nº_encomenda}",
        body: `Exma. Sr.ª {nome},

Obrigada por nos contactar relativamente à sua encomenda #{nº_encomenda}.

Lamentamos que o tamanho selecionado não tenha sido o mais adequado. Compreendemos que escolher o tamanho correto online pode ser um desafio.

De acordo com a nossa Política de Reembolso, não aceitamos devoluções por motivos de tamanho ou ajuste, uma vez que disponibilizamos tabelas de tamanhos detalhadas em cada página de produto.

No entanto, como gesto de boa vontade e por valorizarmos a sua confiança na nossa marca, gostaríamos de oferecer-lhe um código de desconto de {10/15}% na sua próxima compra:

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
        subject: "Re: Pedido de Devolução — Encomenda #{nº_encomenda} | [nome da marca]",
        body: `Exma. Sr.ª {nome},

Obrigada por nos contactar relativamente à sua encomenda #{nº_encomenda}.

Lamentamos que a peça não tenha correspondido às suas expectativas. Compreendemos que por vezes um artigo pode não ser exatamente o que imaginávamos ao vê-lo online.

De acordo com a nossa Política de Reembolso — disponível no nosso website e aceite no momento da compra — não aceitamos devoluções por motivos de preferência pessoal ou mudança de ideia. A nossa política aplica-se exclusivamente a artigos com defeito comprovado ou entregues incorretamente.

Agradecemos a sua compreensão e esperamos poder continuar a contar com a sua confiança em futuras compras.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`
      },
      {
        label: "✗ PROMOÇÃO / FORA DO PRAZO — NEGADO",
        subject: "Re: Pedido de Devolução — Encomenda #{nº_encomenda} | [nome da marca]",
        body: `Exma. Sr.ª {nome},

Obrigada por nos contactar relativamente à sua encomenda #{nº_encomenda}.

Após análise do seu pedido, verificamos que {o artigo foi adquirido durante um período de promoção/liquidação / o contacto foi efetuado após o prazo de 7 dias previsto na nossa política}.

De acordo com a nossa Política de Reembolso, {artigos em promoção estão excluídos do direito de devolução / pedidos devem ser submetidos no prazo máximo de 7 dias após receção}, exceto em caso de defeito de fabrico comprovado.

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
        subject: "Re: Acompanhamento — Encomenda #{nº_encomenda}",
        body: `Exma. Sr.ª {nome},

Obrigada por nos contactar relativamente à sua encomenda #{nº_encomenda}.

Confirmamos que a sua encomenda foi enviada em {data_envio} com o número de rastreamento: {nº_rastreamento}.

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
        subject: "Re: Acompanhamento Urgente — Encomenda #{nº_encomenda}",
        body: `Exma. Sr.ª {nome},

Obrigada por nos alertar e pedimos sinceras desculpas pelo atraso na entrega da sua encomenda #{nº_encomenda}.

Abrimos de imediato uma investigação com a transportadora para localizar o seu envio com o rastreamento {nº_rastreamento}. A resposta demora habitualmente 24 a 72 horas úteis.

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
        subject: "Re: Encomenda #{nº_encomenda} — Resposta Formal",
        body: `Exma. Sr.ª {nome},

Acusamos a receção da sua mensagem e tomamos nota da intenção de recorrer a assessoria jurídica relativamente à encomenda #{nº_encomenda}.

A [nome da marca] opera em plena conformidade com a legislação portuguesa de defesa do consumidor. Todas as nossas políticas estão publicamente disponíveis no nosso website e foram aceites no momento da compra.

Relativamente à situação em concreto: {descreva o facto objetivo}.

Permanecemos disponíveis para resolver esta situação dentro das nossas políticas vigentes.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail jurídico da loja]`,
        tip: "IMPORTANTE: Enviar sempre do e-mail jurídico da loja. Nunca admitir culpa. Preencher apenas os factos entre { }."
      },
      {
        label: "⚠️ AMEAÇA DE EXPOSIÇÃO — TOM CALMO E PROFISSIONAL",
        subject: "Re: Encomenda #{nº_encomenda}",
        body: `Exma. Sr.ª {nome},

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
        subject: "Re: Problema com o Pedido #{nº_pedido} — Solução Imediata",
        body: `Prezada Sr.ª {nome},

Obrigada por entrar em contato e pedimos sinceras desculpas pelo ocorrido com o seu pedido #{nº_pedido}.

Após analisar as fotos que nos enviou, confirmamos que o artigo apresenta {defeito / foi enviado incorretamente}. Assumimos total responsabilidade por esta situação — este resultado não corresponde aos nossos padrões de qualidade.

Como forma de resolução imediata, procedemos ao reenvio de um novo artigo sem qualquer custo adicional para você. Não precisa devolver o artigo recebido.

O novo envio será processado nas próximas 24 a 48 horas úteis e você receberá um e-mail com o novo número de rastreamento assim que for expedido.

Agradecemos a sua paciência e pedimos desculpas pelo transtorno.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Use quando o fornecedor aceita reenviar. A cliente fica satisfeita, não há logística reversa e o custo é mínimo."
      },
      {
        label: "💶 DEFEITO — REEMBOLSO PARCIAL",
        subject: "Re: Problema com o Pedido #{nº_pedido} — Compensação",
        body: `Prezada Sr.ª {nome},

Obrigada por entrar em contato e pedimos sinceras desculpas pelo ocorrido com o seu pedido #{nº_pedido}.

Confirmamos que o artigo apresenta {defeito}, o que não corresponde aos nossos padrões de qualidade.

Como forma de compensação imediata, processamos um reembolso parcial de R${valor} diretamente para o seu método de pagamento original. Este valor deverá aparecer na sua conta no prazo de 5 a 10 dias úteis, dependendo da sua instituição bancária.

Não precisa devolver o artigo — pode ficar com ele.

Caso prefira receber um novo artigo em substituição, informe-nos e tratamos do reenvio sem qualquer custo adicional.

Lamentamos o inconveniente e agradecemos a sua compreensão.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Reembolso parcial de 20–40% resolve a maioria dos casos. A cliente fica com o artigo e evita chargebacks."
      },
      {
        label: "🎁 TAMANHO ERRADO — NEGADO + VOUCHER",
        subject: "Re: Pedido de Devolução — Pedido #{nº_pedido}",
        body: `Prezada Sr.ª {nome},

Obrigada por entrar em contato sobre o seu pedido #{nº_pedido}.

Lamentamos que o tamanho selecionado não tenha sido o mais adequado. Compreendemos que escolher o tamanho correto online pode ser um desafio.

De acordo com a nossa Política de Reembolso, não aceitamos devoluções por motivos de tamanho ou ajuste, uma vez que disponibilizamos tabelas de tamanhos detalhadas em cada página de produto.

No entanto, como gesto de boa vontade e por valorizarmos a sua confiança na nossa marca, gostaríamos de oferecer um código de desconto de {10/15}% na sua próxima compra:

Código: [inserir cupom de desconto]

Este código é válido por 30 dias e pode ser utilizado em qualquer artigo do nosso site.

Esperamos poder continuar contando com a sua confiança.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "O voucher amortiza a insatisfação e incentiva nova compra — mais eficaz do que um simples não."
      },
      {
        label: "✗ MUDANÇA DE IDEIA — NEGADO",
        subject: "Re: Pedido de Devolução — Pedido #{nº_pedido} | [nome da marca]",
        body: `Prezada Sr.ª {nome},

Obrigada por entrar em contato sobre o seu pedido #{nº_pedido}.

Lamentamos que a peça não tenha correspondido às suas expectativas. Compreendemos que às vezes um artigo pode não ser exatamente o que imaginávamos ao vê-lo online.

De acordo com a nossa Política de Reembolso — disponível no nosso site e aceita no momento da compra — não aceitamos devoluções por motivos de preferência pessoal ou mudança de ideia. A nossa política aplica-se exclusivamente a artigos com defeito comprovado ou entregues incorretamente.

Agradecemos a sua compreensão e esperamos poder continuar contando com a sua confiança em futuras compras.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`
      },
      {
        label: "✗ PROMOÇÃO / FORA DO PRAZO — NEGADO",
        subject: "Re: Pedido de Devolução — Pedido #{nº_pedido} | [nome da marca]",
        body: `Prezada Sr.ª {nome},

Obrigada por entrar em contato sobre o seu pedido #{nº_pedido}.

Após análise do seu pedido, verificamos que {o artigo foi adquirido durante um período de promoção/liquidação / o contato foi efetuado após o prazo de 7 dias previsto na nossa política}.

De acordo com a nossa Política de Reembolso, {artigos em promoção estão excluídos do direito de devolução / pedidos devem ser submetidos no prazo máximo de 7 dias após recebimento}, exceto em caso de defeito de fabricação comprovado.

Caso considere que o artigo apresenta um defeito, pedimos que nos envie fotos detalhadas para que possamos analisar a situação.

Lamentamos não poder dar uma resposta diferente nestas circunstâncias.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`
      }
    ],
    delivery: [
      {
        label: "📦 EM TRÂNSITO — DENTRO DO PRAZO NORMAL",
        subject: "Re: Acompanhamento — Pedido #{nº_pedido}",
        body: `Prezada Sr.ª {nome},

Obrigada por entrar em contato sobre o seu pedido #{nº_pedido}.

Confirmamos que o seu pedido foi enviado em {data_envio} com o número de rastreamento: {nº_rastreamento}.

Você pode acompanhar o status da entrega em tempo real aqui:
[inserir link de rastreamento]

O prazo habitual de entrega é de 6 a 9 dias úteis após envio. O seu pedido encontra-se dentro deste prazo e deverá chegar em breve.

Caso passados os 9 dias úteis não tenha recebido o pedido, entre em contato conosco imediatamente e abriremos uma investigação prioritária.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`
      },
      {
        label: "⚠️ ATRASO REAL — INVESTIGAÇÃO ABERTA",
        subject: "Re: Acompanhamento Urgente — Pedido #{nº_pedido}",
        body: `Prezada Sr.ª {nome},

Obrigada por nos alertar e pedimos sinceras desculpas pelo atraso na entrega do seu pedido #{nº_pedido}.

Abrimos imediatamente uma investigação com a transportadora para localizar o seu envio com o rastreamento {nº_rastreamento}. A resposta demora habitualmente 24 a 72 horas úteis.

Entraremos em contato assim que tivermos uma atualização concreta. Caso o pedido não seja localizado, procedemos ao reenvio imediato de um novo artigo sem qualquer custo adicional.

Agradecemos a sua paciência.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`
      }
    ],
    legal: [
      {
        label: "⚖️ AMEAÇA COM ADVOGADO — RESPOSTA FORMAL",
        subject: "Re: Pedido #{nº_pedido} — Resposta Formal",
        body: `Prezada Sr.ª {nome},

Acusamos o recebimento da sua mensagem e tomamos nota da intenção de recorrer a assessoria jurídica relativamente ao pedido #{nº_pedido}.

A [nome da marca] opera em plena conformidade com a legislação brasileira de defesa do consumidor. Todas as nossas políticas estão publicamente disponíveis no nosso site e foram aceitas no momento da compra.

Relativamente à situação em concreto: {descreva o fato objetivo}.

Permanecemos disponíveis para resolver esta situação dentro das nossas políticas vigentes.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail jurídico da loja]`,
        tip: "IMPORTANTE: Enviar sempre do e-mail jurídico da loja. Nunca admitir culpa. Preencher apenas os fatos entre { }."
      },
      {
        label: "⚠️ AMEAÇA DE EXPOSIÇÃO — TOM CALMO E PROFISSIONAL",
        subject: "Re: Pedido #{nº_pedido}",
        body: `Prezada Sr.ª {nome},

Obrigada por entrar em contato. Lemos com atenção a sua mensagem.

Compreendemos a sua frustração e levamos todas as preocupações das nossas clientes muito a sério. A nossa posição baseia-se inteiramente nas políticas aceitas no momento da compra, disponíveis publicamente no nosso site.

Estamos inteiramente disponíveis para resolver qualquer situação que se enquadre nessas políticas. Se desejar esclarecimentos adicionais, pode nos contatar por e-mail ou telefone.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Responda sempre com calma — a sua resposta pode ser publicada também. Profissionalismo é a melhor defesa."
      }
    ]
  },
  ES: {
    refund: [
      {
        label: "✓ DEFECTO / INCORRECTO — REENVÍO GRATUITO",
        subject: "Re: Problema con el Pedido #{nº_pedido} — Solución Inmediata",
        body: `Estimada Sra. {nombre},

Gracias por contactarnos y le pedimos sinceras disculpas por lo sucedido con su pedido #{nº_pedido}.

Tras analizar las fotografías que nos envió, confirmamos que el artículo presenta {defecto / fue enviado incorrectamente}. Asumimos total responsabilidad por esta situación — este resultado no corresponde a nuestros estándares de calidad.

Como forma de resolución inmediata, procedemos al reenvío de un nuevo artículo sin ningún coste adicional para usted. No necesita devolver el artículo recibido.

El nuevo envío será procesado en las próximas 24 a 48 horas laborables y recibirá un correo con el nuevo número de seguimiento una vez expedido.

Agradecemos su paciencia y pedimos disculpas por las molestias.

Atentamente,
Equipo de Atención al Cliente — [nombre de la marca]
[correo de la tienda]`,
        tip: "Usar cuando el proveedor acepta reenviar. La clienta queda satisfecha, no hay logística inversa y el coste es mínimo."
      }
    ],
    delivery: [
      {
        label: "📦 EN TRÁNSITO — DENTRO DEL PLAZO NORMAL",
        subject: "Re: Seguimiento — Pedido #{nº_pedido}",
        body: `Estimada Sra. {nombre},

Gracias por contactarnos sobre su pedido #{nº_pedido}.

Confirmamos que su pedido fue enviado el {fecha_envío} con el número de seguimiento: {nº_seguimiento}.

Puede seguir el estado de la entrega en tiempo real aquí:
[insertar enlace de seguimiento]

El plazo habitual de entrega es de 6 a 9 días laborables después del envío. Su pedido está dentro de este plazo y debería llegar pronto.

Si pasados los 9 días laborables no ha recibido el pedido, contáctenos inmediatamente y abriremos una investigación prioritaria.

Atentamente,
Equipo de Atención al Cliente — [nombre de la marca]
[correo de la tienda]`
      }
    ],
    legal: [
      {
        label: "⚖️ AMENAZA CON ABOGADO — RESPUESTA FORMAL",
        subject: "Re: Pedido #{nº_pedido} — Respuesta Formal",
        body: `Estimada Sra. {nombre},

Acusamos recibo de su mensaje y tomamos nota de su intención de recurrir a asesoría jurídica en relación con el pedido #{nº_pedido}.

[nombre de la marca] opera en plena conformidad con la legislación española de defensa del consumidor. Todas nuestras políticas están públicamente disponibles en nuestra web y fueron aceptadas en el momento de la compra.

En relación con la situación concreta: {describa el hecho objetivo}.

Permanecemos disponibles para resolver esta situación dentro de nuestras políticas vigentes.

Atentamente,
Equipo de Atención al Cliente — [nombre de la marca]
[correo jurídico de la tienda]`,
        tip: "IMPORTANTE: Enviar siempre desde el correo jurídico de la tienda. Nunca admitir culpa. Rellenar solo los hechos entre { }."
      }
    ]
  },
  GB: {
    refund: [
      {
        label: "✓ DEFECT / INCORRECT — FREE RESHIPMENT",
        subject: "Re: Issue with Order #{order_number} — Immediate Resolution",
        body: `Dear Ms {name},

Thank you for contacting us and we sincerely apologise for what happened with your order #{order_number}.

After reviewing the photographs you sent us, we confirm that the item has {defect / was sent incorrectly}. We take full responsibility for this situation — this result does not meet our quality standards.

As an immediate resolution, we are reshipping a new item at no additional cost to you. You do not need to return the item you received.

The new shipment will be processed within the next 24 to 48 business hours and you will receive an email with the new tracking number once dispatched.

We appreciate your patience and apologise for the inconvenience.

Kind regards,
Customer Support Team — [brand name]
[shop email]`,
        tip: "Use when the supplier agrees to reship. The customer is satisfied, no reverse logistics and minimal cost."
      }
    ],
    delivery: [
      {
        label: "📦 IN TRANSIT — WITHIN NORMAL TIMEFRAME",
        subject: "Re: Tracking — Order #{order_number}",
        body: `Dear Ms {name},

Thank you for contacting us regarding your order #{order_number}.

We confirm that your order was dispatched on {dispatch_date} with tracking number: {tracking_number}.

You can track the delivery status in real time here:
[insert tracking link]

The usual delivery timeframe is 6 to 9 business days after dispatch. Your order is within this timeframe and should arrive soon.

If after 9 business days you have not received the order, please contact us immediately and we will open a priority investigation.

Kind regards,
Customer Support Team — [brand name]
[shop email]`
      }
    ],
    legal: [
      {
        label: "⚖️ LEGAL THREAT — FORMAL RESPONSE",
        subject: "Re: Order #{order_number} — Formal Response",
        body: `Dear Ms {name},

We acknowledge receipt of your message and note your intention to seek legal advice regarding order #{order_number}.

[brand name] operates in full compliance with UK consumer protection legislation. All our policies are publicly available on our website and were accepted at the time of purchase.

Regarding the specific situation: {describe the objective fact}.

We remain available to resolve this situation within our current policies.

Kind regards,
Customer Support Team — [brand name]
[legal email]`,
        tip: "IMPORTANT: Always send from the shop's legal email. Never admit fault. Only fill in the facts between { }."
      }
    ]
  },
  US: {
    refund: [
      {
        label: "✓ DEFECT / INCORRECT — FREE RESHIPMENT",
        subject: "Re: Issue with Order #{order_number} — Immediate Resolution",
        body: `Dear Ms {name},

Thank you for reaching out and we sincerely apologize for what happened with your order #{order_number}.

After reviewing the photos you sent us, we confirm that the item has {defect / was sent incorrectly}. We take full responsibility for this situation — this result does not meet our quality standards.

As an immediate resolution, we're reshipping a new item at no additional cost to you. You don't need to return the item you received.

The new shipment will be processed within the next 24 to 48 business hours and you'll receive an email with the new tracking number once it ships.

We appreciate your patience and apologize for the inconvenience.

Best regards,
Customer Support Team — [brand name]
[store email]`,
        tip: "Use when the supplier agrees to reship. Customer is satisfied, no reverse logistics and minimal cost."
      }
    ],
    delivery: [
      {
        label: "📦 IN TRANSIT — WITHIN NORMAL TIMEFRAME",
        subject: "Re: Tracking — Order #{order_number}",
        body: `Dear Ms {name},

Thanks for reaching out about your order #{order_number}.

We confirm that your order shipped on {ship_date} with tracking number: {tracking_number}.

You can track the delivery status in real time here:
[insert tracking link]

The usual delivery timeframe is 6 to 9 business days after shipping. Your order is within this timeframe and should arrive soon.

If after 9 business days you haven't received the order, please contact us right away and we'll open a priority investigation.

Best regards,
Customer Support Team — [brand name]
[store email]`
      }
    ],
    legal: [
      {
        label: "⚖️ LEGAL THREAT — FORMAL RESPONSE",
        subject: "Re: Order #{order_number} — Formal Response",
        body: `Dear Ms {name},

We acknowledge receipt of your message and note your intention to seek legal counsel regarding order #{order_number}.

[brand name] operates in full compliance with US consumer protection laws. All our policies are publicly available on our website and were accepted at the time of purchase.

Regarding the specific situation: {describe the objective fact}.

We remain available to resolve this situation within our current policies.

Best regards,
Customer Support Team — [brand name]
[legal email]`,
        tip: "IMPORTANT: Always send from the store's legal email. Never admit fault. Only fill in the facts between { }."
      }
    ]
  },
  CA: {
    refund: [
      {
        label: "✓ DEFECT / INCORRECT — FREE RESHIPMENT",
        subject: "Re: Issue with Order #{order_number} — Immediate Resolution",
        body: `Dear Ms {name},

Thank you for reaching out and we sincerely apologize for what happened with your order #{order_number}.

After reviewing the photos you sent us, we confirm that the item has {defect / was sent incorrectly}. We take full responsibility for this situation — this result does not meet our quality standards.

As an immediate resolution, we're reshipping a new item at no additional cost to you. You don't need to return the item you received.

The new shipment will be processed within the next 24 to 48 business hours and you'll receive an email with the new tracking number once it ships.

We appreciate your patience and apologize for the inconvenience.

Best regards,
Customer Support Team — [brand name]
[store email]`,
        tip: "Use when the supplier agrees to reship. Customer is satisfied, no reverse logistics and minimal cost."
      }
    ],
    delivery: [
      {
        label: "📦 IN TRANSIT — WITHIN NORMAL TIMEFRAME",
        subject: "Re: Tracking — Order #{order_number}",
        body: `Dear Ms {name},

Thanks for reaching out about your order #{order_number}.

We confirm that your order shipped on {ship_date} with tracking number: {tracking_number}.

You can track the delivery status in real time here:
[insert tracking link]

The usual delivery timeframe is 6 to 9 business days after shipping. Your order is within this timeframe and should arrive soon.

If after 9 business days you haven't received the order, please contact us right away and we'll open a priority investigation.

Best regards,
Customer Support Team — [brand name]
[store email]`
      }
    ],
    legal: [
      {
        label: "⚖️ LEGAL THREAT — FORMAL RESPONSE",
        subject: "Re: Order #{order_number} — Formal Response",
        body: `Dear Ms {name},

We acknowledge receipt of your message and note your intention to seek legal counsel regarding order #{order_number}.

[brand name] operates in full compliance with Canadian consumer protection laws. All our policies are publicly available on our website and were accepted at the time of purchase.

Regarding the specific situation: {describe the objective fact}.

We remain available to resolve this situation within our current policies.

Best regards,
Customer Support Team — [brand name]
[legal email]`,
        tip: "IMPORTANT: Always send from the store's legal email. Never admit fault. Only fill in the facts between { }."
      }
    ]
  },
  IT: {
    refund: [
      {
        label: "✓ DIFETTO / ERRATO — RISPEDIZIONE GRATUITA",
        subject: "Re: Problema con l'Ordine #{numero_ordine} — Soluzione Immediata",
        body: `Gentile Sig.ra {nome},

Grazie per averci contattato e ci scusiamo sinceramente per quanto accaduto con il suo ordine #{numero_ordine}.

Dopo aver analizzato le foto che ci ha inviato, confermiamo che l'articolo presenta {difetto / è stato spedito erroneamente}. Ci assumiamo la piena responsabilità di questa situazione — questo risultato non corrisponde ai nostri standard di qualità.

Come risoluzione immediata, procediamo alla rispedizione di un nuovo articolo senza alcun costo aggiuntivo per lei. Non è necessario restituire l'articolo ricevuto.

La nuova spedizione sarà processata entro le prossime 24-48 ore lavorative e riceverà un'email con il nuovo numero di tracciamento una volta spedito.

Apprezziamo la sua pazienza e ci scusiamo per l'inconveniente.

Cordiali saluti,
Team di Assistenza Clienti — [nome del brand]
[email del negozio]`,
        tip: "Usare quando il fornitore accetta di rispedire. La cliente è soddisfatta, nessuna logistica inversa e costo minimo."
      }
    ],
    delivery: [
      {
        label: "📦 IN TRANSITO — NEI TEMPI NORMALI",
        subject: "Re: Tracciamento — Ordine #{numero_ordine}",
        body: `Gentile Sig.ra {nome},

Grazie per averci contattato riguardo al suo ordine #{numero_ordine}.

Confermiamo che il suo ordine è stato spedito il {data_spedizione} con numero di tracciamento: {numero_tracciamento}.

Può seguire lo stato della consegna in tempo reale qui:
[inserire link di tracciamento]

Il tempo di consegna abituale è di 6-9 giorni lavorativi dalla spedizione. Il suo ordine è entro questo termine e dovrebbe arrivare presto.

Se dopo 9 giorni lavorativi non ha ricevuto l'ordine, ci contatti immediatamente e apriremo un'indagine prioritaria.

Cordiali saluti,
Team di Assistenza Clienti — [nome del brand]
[email del negozio]`
      }
    ],
    legal: [
      {
        label: "⚖️ MINACCIA LEGALE — RISPOSTA FORMALE",
        subject: "Re: Ordine #{numero_ordine} — Risposta Formale",
        body: `Gentile Sig.ra {nome},

Accusiamo ricezione del suo messaggio e prendiamo nota della sua intenzione di ricorrere a consulenza legale riguardo all'ordine #{numero_ordine}.

[nome del brand] opera in piena conformità con la legislazione italiana a tutela del consumatore. Tutte le nostre politiche sono pubblicamente disponibili sul nostro sito web e sono state accettate al momento dell'acquisto.

Riguardo alla situazione specifica: {descriva il fatto oggettivo}.

Rimaniamo disponibili a risolvere questa situazione nell'ambito delle nostre politiche vigenti.

Cordiali saluti,
Team di Assistenza Clienti — [nome del brand]
[email legale del negozio]`,
        tip: "IMPORTANTE: Inviare sempre dall'email legale del negozio. Mai ammettere colpa. Compilare solo i fatti tra { }."
      }
    ]
  },
  FR: {
    refund: [
      {
        label: "✓ DÉFAUT / INCORRECT — RÉEXPÉDITION GRATUITE",
        subject: "Re: Problème avec la Commande #{numéro_commande} — Solution Immédiate",
        body: `Chère Madame {nom},

Merci de nous avoir contactés et nous vous présentons nos sincères excuses pour ce qui s'est passé avec votre commande #{numéro_commande}.

Après avoir analysé les photos que vous nous avez envoyées, nous confirmons que l'article présente {défaut / a été envoyé incorrectement}. Nous assumons l'entière responsabilité de cette situation — ce résultat ne correspond pas à nos standards de qualité.

Comme résolution immédiate, nous procédons à la réexpédition d'un nouvel article sans aucun frais supplémentaire pour vous. Vous n'avez pas besoin de retourner l'article reçu.

La nouvelle expédition sera traitée dans les 24 à 48 heures ouvrées et vous recevrez un e-mail avec le nouveau numéro de suivi dès l'expédition.

Nous apprécions votre patience et nous excusons pour ce désagrément.

Cordialement,
Équipe Service Client — [nom de la marque]
[e-mail de la boutique]`,
        tip: "À utiliser quand le fournisseur accepte de réexpédier. La cliente est satisfaite, pas de logistique inverse et coût minimal."
      }
    ],
    delivery: [
      {
        label: "📦 EN TRANSIT — DANS LES DÉLAIS NORMAUX",
        subject: "Re: Suivi — Commande #{numéro_commande}",
        body: `Chère Madame {nom},

Merci de nous avoir contactés concernant votre commande #{numéro_commande}.

Nous confirmons que votre commande a été expédiée le {date_expédition} avec le numéro de suivi : {numéro_suivi}.

Vous pouvez suivre l'état de la livraison en temps réel ici :
[insérer lien de suivi]

Le délai de livraison habituel est de 6 à 9 jours ouvrés après l'expédition. Votre commande est dans ce délai et devrait arriver bientôt.

Si après 9 jours ouvrés vous n'avez pas reçu la commande, contactez-nous immédiatement et nous ouvrirons une enquête prioritaire.

Cordialement,
Équipe Service Client — [nom de la marque]
[e-mail de la boutique]`
      }
    ],
    legal: [
      {
        label: "⚖️ MENACE JURIDIQUE — RÉPONSE FORMELLE",
        subject: "Re: Commande #{numéro_commande} — Réponse Formelle",
        body: `Chère Madame {nom},

Nous accusons réception de votre message et prenons note de votre intention de recourir à un conseil juridique concernant la commande #{numéro_commande}.

[nom de la marque] opère en pleine conformité avec la législation française de protection du consommateur. Toutes nos politiques sont publiquement disponibles sur notre site web et ont été acceptées au moment de l'achat.

Concernant la situation spécifique : {décrivez le fait objectif}.

Nous restons disponibles pour résoudre cette situation dans le cadre de nos politiques en vigueur.

Cordialement,
Équipe Service Client — [nom de la marque]
[e-mail juridique de la boutique]`,
        tip: "IMPORTANT : Toujours envoyer depuis l'e-mail juridique de la boutique. Ne jamais admettre de faute. Remplir uniquement les faits entre { }."
      }
    ]
  },
  DE: {
    refund: [
      {
        label: "✓ DEFEKT / FALSCH — KOSTENLOSE NEULIEFERUNG",
        subject: "Re: Problem mit Bestellung #{bestellnummer} — Sofortige Lösung",
        body: `Sehr geehrte Frau {Name},

Vielen Dank für Ihre Kontaktaufnahme und wir entschuldigen uns aufrichtig für das, was mit Ihrer Bestellung #{bestellnummer} passiert ist.

Nach Prüfung der Fotos, die Sie uns geschickt haben, bestätigen wir, dass der Artikel {Defekt aufweist / falsch gesendet wurde}. Wir übernehmen die volle Verantwortung für diese Situation — dieses Ergebnis entspricht nicht unseren Qualitätsstandards.

Als sofortige Lösung versenden wir einen neuen Artikel ohne zusätzliche Kosten für Sie. Sie müssen den erhaltenen Artikel nicht zurückschicken.

Die neue Sendung wird innerhalb der nächsten 24 bis 48 Geschäftsstunden bearbeitet und Sie erhalten eine E-Mail mit der neuen Sendungsverfolgungsnummer sobald sie versandt wird.

Wir schätzen Ihre Geduld und entschuldigen uns für die Unannehmlichkeiten.

Mit freundlichen Grüßen,
Kundenservice-Team — [Markenname]
[Shop-E-Mail]`,
        tip: "Verwenden, wenn der Lieferant einer Neulieferung zustimmt. Kundin ist zufrieden, keine Rücklogistik und minimale Kosten."
      }
    ],
    delivery: [
      {
        label: "📦 IM TRANSIT — INNERHALB DES NORMALEN ZEITRAHMENS",
        subject: "Re: Sendungsverfolgung — Bestellung #{bestellnummer}",
        body: `Sehr geehrte Frau {Name},

Vielen Dank für Ihre Kontaktaufnahme bezüglich Ihrer Bestellung #{bestellnummer}.

Wir bestätigen, dass Ihre Bestellung am {versanddatum} mit der Sendungsverfolgungsnummer: {tracking_nummer} versendet wurde.

Sie können den Lieferstatus in Echtzeit hier verfolgen:
[Tracking-Link einfügen]

Der übliche Lieferzeitraum beträgt 6 bis 9 Werktage nach Versand. Ihre Bestellung liegt innerhalb dieses Zeitrahmens und sollte bald ankommen.

Wenn Sie nach 9 Werktagen die Bestellung nicht erhalten haben, kontaktieren Sie uns bitte sofort und wir eröffnen eine vorrangige Untersuchung.

Mit freundlichen Grüßen,
Kundenservice-Team — [Markenname]
[Shop-E-Mail]`
      }
    ],
    legal: [
      {
        label: "⚖️ RECHTSDROHUNG — FORMELLE ANTWORT",
        subject: "Re: Bestellung #{bestellnummer} — Formelle Antwort",
        body: `Sehr geehrte Frau {Name},

Wir bestätigen den Eingang Ihrer Nachricht und nehmen Ihre Absicht zur Kenntnis, rechtliche Beratung bezüglich der Bestellung #{bestellnummer} in Anspruch zu nehmen.

[Markenname] arbeitet in voller Übereinstimmung mit dem deutschen Verbraucherschutzrecht. Alle unsere Richtlinien sind öffentlich auf unserer Website verfügbar und wurden zum Zeitpunkt des Kaufs akzeptiert.

Bezüglich der konkreten Situation: {beschreiben Sie den objektiven Sachverhalt}.

Wir bleiben verfügbar, um diese Situation im Rahmen unserer geltenden Richtlinien zu lösen.

Mit freundlichen Grüßen,
Kundenservice-Team — [Markenname]
[Rechts-E-Mail des Shops]`,
        tip: "WICHTIG: Immer von der Rechts-E-Mail des Shops senden. Niemals Schuld eingestehen. Nur die Fakten zwischen { } ausfüllen."
      }
    ]
  }
}

export function EmailsTemplates({ clientId }: EmailsTemplatesProps) {
  const [selectedCountry, setSelectedCountry] = useState("PT")
  const [activeTab, setActiveTab] = useState<"instagram" | "email">("instagram")
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const instagramMessages = INSTAGRAM_MESSAGES[selectedCountry] || INSTAGRAM_MESSAGES.PT
  const emailTemplates = EMAIL_TEMPLATES[selectedCountry] || EMAIL_TEMPLATES.PT

  const copyToClipboard = async (text: string, index: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const InstagramCard = ({ part, partKey }: { part: typeof instagramMessages.part1; partKey: string }) => (
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
            <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{version.text}</p>
          </div>
        ))}
        {part.tip && (
          <div className="flex items-start gap-2 p-3 bg-[rgba(245,158,11,0.1)] rounded-lg border border-[rgba(245,158,11,0.2)]">
            <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-200">{part.tip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const EmailCard = ({ template, index, section }: { template: typeof emailTemplates.refund[0]; index: number; section: string }) => (
    <div className="p-4 bg-[#0B0B10] rounded-xl border border-[rgba(255,255,255,0.06)]">
      <div className="mb-3">
        <span className="text-xs font-medium text-[#A855F7]">{template.label}</span>
      </div>
      
      {/* Subject line */}
      <div className="mb-3 p-3 bg-[#1a2744] rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[rgba(245,245,247,0.52)]">Assunto:</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(template.subject, `${section}-${index}-subject`)}
            className="h-6 text-xs text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424]"
          >
            {copiedIndex === `${section}-${index}-subject` ? (
              <>
                <Check className="h-3 w-3 mr-1 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copiar Assunto
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-[#F5F5F7] font-medium">{template.subject}</p>
      </div>
      
      {/* Body */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[rgba(245,245,247,0.52)]">Corpo do e-mail:</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(template.body, `${section}-${index}-body`)}
            className="h-6 text-xs text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424]"
          >
            {copiedIndex === `${section}-${index}-body` ? (
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
        <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{template.body}</p>
      </div>
      
      {/* Tip */}
      {template.tip && (
        <div className="flex items-start gap-2 p-3 bg-[rgba(245,158,11,0.1)] rounded-lg border border-[rgba(245,158,11,0.2)]">
          <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200">{template.tip}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[rgba(245,245,247,0.52)] mr-2">Selecionar idioma:</span>
            {COUNTRIES.map((country) => (
              <Button
                key={country.code}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCountry(country.code)}
                className={`text-2xl px-2 py-1 h-auto ${
                  selectedCountry === country.code
                    ? "bg-[#A855F7]/20 border border-[#A855F7]/50"
                    : "hover:bg-[#141424]"
                }`}
                title={country.name}
              >
                {country.flag}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("instagram")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === "instagram"
              ? "bg-gradient-to-r from-[#E1306C] to-[#C13584] text-white"
              : "bg-[#101018] border border-[rgba(255,255,255,0.06)] text-[rgba(245,245,247,0.72)] hover:bg-[#141424]"
          }`}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("email")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === "email"
              ? "bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white"
              : "bg-[#101018] border border-[rgba(255,255,255,0.06)] text-[rgba(245,245,247,0.72)] hover:bg-[#141424]"
          }`}
        >
          <Mail className="h-4 w-4" />
          E-mail
        </Button>
      </div>

      {/* Instagram Tab Content */}
      {activeTab === "instagram" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstagramCard part={instagramMessages.part1} partKey="part1" />
          <InstagramCard part={instagramMessages.part2} partKey="part2" />
          <InstagramCard part={instagramMessages.part3} partKey="part3" />
          <InstagramCard part={instagramMessages.part4} partKey="part4" />
        </div>
      )}

      {/* Email Tab Content */}
      {activeTab === "email" && (
        <div className="space-y-6">
          {/* Instruction banner */}
          <div className="flex items-start gap-3 p-4 bg-[rgba(245,158,11,0.15)] rounded-xl border border-[rgba(245,158,11,0.3)]">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-200">
              <strong>Instruções de uso:</strong> Substituir sempre os campos entre {"{chavetas}"} antes de enviar. Os campos em {"{chavetas}"} indicam informação variável. E-mails de ameaça legal devem ser enviados do e-mail jurídico da empresa.
            </p>
          </div>

          {/* Refund Section */}
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

          {/* Delivery Section */}
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

          {/* Legal Section */}
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
