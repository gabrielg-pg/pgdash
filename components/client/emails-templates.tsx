"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check, Lightbulb, Instagram, Mail, AlertTriangle } from "lucide-react"

interface EmailsTemplatesProps {
  clientId: string
}

const COUNTRIES = [
  { code: "PT", name: "Portugal", flagUrl: "https://flagcdn.com/w40/pt.png" },
  { code: "BR", name: "Brasil", flagUrl: "https://flagcdn.com/w40/br.png" },
  { code: "ES", name: "Espanha", flagUrl: "https://flagcdn.com/w40/es.png" },
  { code: "GB", name: "Reino Unido", flagUrl: "https://flagcdn.com/w40/gb.png" },
  { code: "US", name: "Estados Unidos", flagUrl: "https://flagcdn.com/w40/us.png" },
  { code: "CA", name: "Canadá", flagUrl: "https://flagcdn.com/w40/ca.png" },
  { code: "IT", name: "Italia", flagUrl: "https://flagcdn.com/w40/it.png" },
  { code: "FR", name: "França", flagUrl: "https://flagcdn.com/w40/fr.png" },
  { code: "DE", name: "Alemanha", flagUrl: "https://flagcdn.com/w40/de.png" },
]

// Instagram Messages for all languages
const INSTAGRAM_MESSAGES: Record<string, { part1: any; part2: any; part3: any; part4: any }> = {
  PT: {
    part1: {
      title: "DM: Encomenda / Não recebi / Problemas",
      versions: [
        { label: "VERSÃO 1 — Direta", text: "Olá! Obrigada por nos contactar. Para questões relacionadas com a sua encomenda, pedimos que nos envie um e-mail para [e-mail da loja] com o número da encomenda — a nossa equipa responde em 24 a 48h úteis. Estamos aqui para ajudar!" },
        { label: "VERSÃO 2 — Com mais calor", text: "Olá! Lamentamos o inconveniente. Para que possamos resolver a sua situação com toda a atenção que merece, pedimos que nos contacte por e-mail: [e-mail da loja] Inclua o número da encomenda e a nossa equipa responde em 24 a 48h úteis. Obrigada pela sua paciência!" },
        { label: "VERSÃO 3 — Super curta", text: "Olá! Para questões sobre encomendas, envia-nos um e-mail para [e-mail da loja] com o teu número de encomenda. Respondemos em 24 a 48h!" },
      ],
      tip: "No dia a dia usa a Versão 3 para responder rápido. Se a cliente insistir, usa a Versão 1 ou 2."
    },
    part2: {
      title: "Comentários no Feed: Questões sobre Preço",
      versions: [
        { label: "VERSÃO 1 — Neutra e direta", text: "Olá! Todas as informações sobre preço, tamanhos e disponibilidade estão no nosso site, acede pelo link na bio!" },
        { label: "VERSÃO 2 — Com entusiasmo", text: "Olá! Podes ver o preço e todos os detalhes deste produto diretamente no nosso site, é só clicar no link na bio! Temos envio grátis em Portugal" },
      ],
      tip: "Nunca coloque o preço nos comentários — obriga a cliente a ir ao site."
    },
    part3: {
      title: "Comentários: Onde compro?",
      versions: [
        { label: "VERSÃO ÚNICA", text: "Olá! É só aceder ao nosso site pelo link na bio, escolher o teu tamanho e cor e finalizar a compra! Entrega grátis em Portugal. Qualquer dúvida estamos aqui" },
      ],
      tip: "Resposta simples que direciona para o site."
    },
    part4: {
      title: "DM: Tem loja física?",
      versions: [
        { label: "VERSÃO 1 — Emotiva", text: "Olá! A nossa loja física em [cidade] fechou durante a pandemia em 2020. Mas reinventámo-nos! Hoje chegamos a toda Portugal através do nosso site [site] com envio grátis." },
        { label: "VERSÃO 2 — Curta", text: "Olá! A nossa loja física encerrou em 2020. Desde então estamos online e chegamos a toda Portugal! Visita-nos em [site]" },
      ],
      tip: "A Versão 1 humaniza a marca e cria empatia."
    }
  },
  BR: {
    part1: {
      title: "DM: Pedido / Não recebi / Problemas",
      versions: [
        { label: "VERSÃO 1 — Direta", text: "Olá! Obrigada por entrar em contato. Para questões relacionadas ao seu pedido, pedimos que nos envie um e-mail para [e-mail da loja] com o número do pedido — nossa equipe responde em 24 a 48h úteis. Estamos aqui para ajudar!" },
        { label: "VERSÃO 2 — Com mais calor", text: "Olá! Lamentamos o inconveniente. Para que possamos resolver sua situação com toda a atenção que merece, pedimos que entre em contato por e-mail: [e-mail da loja] Inclua o número do pedido e nossa equipe responde em 24 a 48h úteis." },
        { label: "VERSÃO 3 — Super curta", text: "Olá! Para questões sobre pedidos, envie um e-mail para [e-mail da loja] com o número do seu pedido. Respondemos em 24 a 48h!" },
      ],
      tip: "No dia a dia use a Versão 3 para responder rápido."
    },
    part2: {
      title: "Comentários no Feed: Questões sobre Preço",
      versions: [
        { label: "VERSÃO 1 — Neutra e direta", text: "Olá! Todas as informações sobre preço, tamanhos e disponibilidade estão no nosso site, acesse pelo link na bio!" },
        { label: "VERSÃO 2 — Com entusiasmo", text: "Olá! Você pode ver o preço e todos os detalhes deste produto diretamente no nosso site, é só clicar no link na bio! Temos frete grátis para todo Brasil" },
      ],
      tip: "Nunca coloque o preço nos comentários."
    },
    part3: {
      title: "Comentários: Onde compro?",
      versions: [
        { label: "VERSÃO ÚNICA", text: "Olá! É só acessar nosso site pelo link na bio, escolher seu tamanho e cor e finalizar a compra! Frete grátis para todo Brasil. Qualquer dúvida estamos aqui" },
      ],
      tip: "Resposta simples que direciona para o site."
    },
    part4: {
      title: "DM: Tem loja física?",
      versions: [
        { label: "VERSÃO 1 — Emotiva", text: "Olá! Nossa loja física em [cidade] fechou durante a pandemia em 2020. Mas nos reinventamos! Hoje chegamos a todo Brasil através do nosso site [site] com frete grátis." },
        { label: "VERSÃO 2 — Curta", text: "Olá! Nossa loja física encerrou em 2020. Desde então estamos online e chegamos a todo Brasil! Visite-nos em [site]" },
      ],
      tip: "A Versão 1 humaniza a marca e cria empatia."
    }
  },
  ES: {
    part1: {
      title: "DM: Pedido / No he recibido / Problemas",
      versions: [
        { label: "VERSIÓN 1 — Directa", text: "¡Hola! Gracias por contactarnos. Para cuestiones relacionadas con tu pedido, te pedimos que nos envíes un correo a [e-mail de la tienda] con el número de pedido — nuestro equipo responde en 24 a 48h hábiles. ¡Estamos aquí para ayudar!" },
        { label: "VERSIÓN 2 — Con más calidez", text: "¡Hola! Lamentamos el inconveniente. Para que podamos resolver tu situación con toda la atención que merece, te pedimos que nos contactes por correo: [e-mail de la tienda] Incluye el número del pedido y nuestro equipo responde en 24 a 48h hábiles." },
        { label: "VERSIÓN 3 — Super corta", text: "¡Hola! Para cuestiones sobre pedidos, envíanos un correo a [e-mail de la tienda] con tu número de pedido. ¡Respondemos en 24 a 48h!" },
      ],
      tip: "En el día a día usa la Versión 3 para responder rápido."
    },
    part2: {
      title: "Comentarios en el Feed: Preguntas sobre Precio",
      versions: [
        { label: "VERSIÓN 1 — Neutral y directa", text: "¡Hola! Toda la información sobre precio, tallas y disponibilidad está en nuestra web, ¡accede por el link en la bio!" },
        { label: "VERSIÓN 2 — Con entusiasmo", text: "¡Hola! Puedes ver el precio y todos los detalles de este producto directamente en nuestra web, ¡solo haz clic en el link de la bio! Tenemos envío gratis en España" },
      ],
      tip: "Nunca pongas el precio en los comentarios."
    },
    part3: {
      title: "Comentarios: ¿Dónde compro?",
      versions: [
        { label: "VERSIÓN ÚNICA", text: "¡Hola! Solo tienes que acceder a nuestra web por el link en la bio, elegir tu talla y color y finalizar la compra. ¡Envío gratis en España!" },
      ],
      tip: "Respuesta simple que dirige a la web."
    },
    part4: {
      title: "DM: ¿Tienen tienda física?",
      versions: [
        { label: "VERSIÓN 1 — Emotiva", text: "¡Hola! Nuestra tienda física en [ciudad] cerró durante la pandemia en 2020. ¡Pero nos reinventamos! Hoy llegamos a toda España a través de nuestra web [site] con envío gratis." },
        { label: "VERSIÓN 2 — Corta", text: "¡Hola! Nuestra tienda física cerró en 2020. ¡Desde entonces estamos online y llegamos a toda España! Visítanos en [site]" },
      ],
      tip: "La Versión 1 humaniza la marca y crea empatía."
    }
  },
  GB: {
    part1: {
      title: "DM: Order / Haven't received / Issues",
      versions: [
        { label: "VERSION 1 — Direct", text: "Hi! Thank you for reaching out. For questions about your order, please send us an email at [store email] with your order number — our team responds within 24 to 48 business hours. We're here to help!" },
        { label: "VERSION 2 — Warmer tone", text: "Hi! We're sorry for the inconvenience. So we can resolve your situation with the attention it deserves, please contact us by email: [store email] Include your order number and our team will respond within 24 to 48 business hours." },
        { label: "VERSION 3 — Super short", text: "Hi! For order questions, please email us at [store email] with your order number. We respond within 24-48h!" },
      ],
      tip: "Use Version 3 for quick daily responses."
    },
    part2: {
      title: "Feed Comments: Price Questions",
      versions: [
        { label: "VERSION 1 — Neutral and direct", text: "Hi! All information about price, sizes and availability is on our website, access via the link in bio!" },
        { label: "VERSION 2 — Enthusiastic", text: "Hi! You can see the price and all details of this product directly on our website, just click the link in bio! We have free shipping in the UK" },
      ],
      tip: "Never put the price in comments."
    },
    part3: {
      title: "Comments: Where can I buy?",
      versions: [
        { label: "SINGLE VERSION", text: "Hi! Just visit our website via the link in bio, choose your size and colour and complete your purchase! Free delivery in the UK." },
      ],
      tip: "Simple response that directs to the website."
    },
    part4: {
      title: "DM: Do you have a physical store?",
      versions: [
        { label: "VERSION 1 — Emotive", text: "Hi! Our physical store in [city] closed during the pandemic in 2020. But we reinvented ourselves! Today we reach all of the UK through our website [site] with free shipping." },
        { label: "VERSION 2 — Short", text: "Hi! Our physical store closed in 2020. Since then we're online and deliver across the UK! Visit us at [site]" },
      ],
      tip: "Version 1 humanises the brand and creates empathy."
    }
  },
  US: {
    part1: {
      title: "DM: Order / Haven't received / Issues",
      versions: [
        { label: "VERSION 1 — Direct", text: "Hi! Thank you for reaching out. For questions about your order, please send us an email at [store email] with your order number — our team responds within 24 to 48 business hours. We're here to help!" },
        { label: "VERSION 2 — Warmer tone", text: "Hi! We're sorry for the inconvenience. So we can resolve your situation with the attention it deserves, please contact us by email: [store email] Include your order number and our team will respond within 24 to 48 business hours." },
        { label: "VERSION 3 — Super short", text: "Hi! For order questions, please email us at [store email] with your order number. We respond within 24-48h!" },
      ],
      tip: "Use Version 3 for quick daily responses."
    },
    part2: {
      title: "Feed Comments: Price Questions",
      versions: [
        { label: "VERSION 1 — Neutral and direct", text: "Hi! All information about price, sizes and availability is on our website, access via the link in bio!" },
        { label: "VERSION 2 — Enthusiastic", text: "Hi! You can see the price and all details of this product directly on our website, just click the link in bio! We have free shipping in the US" },
      ],
      tip: "Never put the price in comments."
    },
    part3: {
      title: "Comments: Where can I buy?",
      versions: [
        { label: "SINGLE VERSION", text: "Hi! Just visit our website via the link in bio, choose your size and color and complete your purchase! Free delivery in the US." },
      ],
      tip: "Simple response that directs to the website."
    },
    part4: {
      title: "DM: Do you have a physical store?",
      versions: [
        { label: "VERSION 1 — Emotive", text: "Hi! Our physical store in [city] closed during the pandemic in 2020. But we reinvented ourselves! Today we reach all of the US through our website [site] with free shipping." },
        { label: "VERSION 2 — Short", text: "Hi! Our physical store closed in 2020. Since then we're online and deliver across the US! Visit us at [site]" },
      ],
      tip: "Version 1 humanizes the brand and creates empathy."
    }
  },
  CA: {
    part1: {
      title: "DM: Order / Haven't received / Issues",
      versions: [
        { label: "VERSION 1 — Direct", text: "Hi! Thank you for reaching out. For questions about your order, please send us an email at [store email] with your order number — our team responds within 24 to 48 business hours. We're here to help!" },
        { label: "VERSION 2 — Warmer tone", text: "Hi! We're sorry for the inconvenience. So we can resolve your situation with the attention it deserves, please contact us by email: [store email] Include your order number and our team will respond within 24 to 48 business hours." },
        { label: "VERSION 3 — Super short", text: "Hi! For order questions, please email us at [store email] with your order number. We respond within 24-48h!" },
      ],
      tip: "Use Version 3 for quick daily responses."
    },
    part2: {
      title: "Feed Comments: Price Questions",
      versions: [
        { label: "VERSION 1 — Neutral and direct", text: "Hi! All information about price, sizes and availability is on our website, access via the link in bio!" },
        { label: "VERSION 2 — Enthusiastic", text: "Hi! You can see the price and all details of this product directly on our website, just click the link in bio! We have free shipping in Canada" },
      ],
      tip: "Never put the price in comments."
    },
    part3: {
      title: "Comments: Where can I buy?",
      versions: [
        { label: "SINGLE VERSION", text: "Hi! Just visit our website via the link in bio, choose your size and colour and complete your purchase! Free delivery in Canada." },
      ],
      tip: "Simple response that directs to the website."
    },
    part4: {
      title: "DM: Do you have a physical store?",
      versions: [
        { label: "VERSION 1 — Emotive", text: "Hi! Our physical store in [city] closed during the pandemic in 2020. But we reinvented ourselves! Today we reach all of Canada through our website [site] with free shipping." },
        { label: "VERSION 2 — Short", text: "Hi! Our physical store closed in 2020. Since then we're online and deliver across Canada! Visit us at [site]" },
      ],
      tip: "Version 1 humanizes the brand and creates empathy."
    }
  },
  IT: {
    part1: {
      title: "DM: Ordine / Non ricevuto / Problemi",
      versions: [
        { label: "VERSIONE 1 — Diretta", text: "Ciao! Grazie per averci contattato. Per domande sul tuo ordine, ti chiediamo di inviarci un'email a [e-mail del negozio] con il numero dell'ordine — il nostro team risponde entro 24-48 ore lavorative. Siamo qui per aiutarti!" },
        { label: "VERSIONE 2 — Più calorosa", text: "Ciao! Ci scusiamo per l'inconveniente. Per risolvere la tua situazione con tutta l'attenzione che merita, ti chiediamo di contattarci via email: [e-mail del negozio] Includi il numero dell'ordine e il nostro team risponderà entro 24-48 ore lavorative." },
        { label: "VERSIONE 3 — Super breve", text: "Ciao! Per domande sugli ordini, inviaci un'email a [e-mail del negozio] con il tuo numero d'ordine. Rispondiamo entro 24-48h!" },
      ],
      tip: "Nel quotidiano usa la Versione 3 per rispondere velocemente."
    },
    part2: {
      title: "Commenti nel Feed: Domande sul Prezzo",
      versions: [
        { label: "VERSIONE 1 — Neutra e diretta", text: "Ciao! Tutte le informazioni su prezzo, taglie e disponibilità sono sul nostro sito, accedi tramite il link in bio!" },
        { label: "VERSIONE 2 — Entusiasta", text: "Ciao! Puoi vedere il prezzo e tutti i dettagli di questo prodotto direttamente sul nostro sito, basta cliccare sul link in bio! Abbiamo spedizione gratuita in Italia" },
      ],
      tip: "Mai mettere il prezzo nei commenti."
    },
    part3: {
      title: "Commenti: Dove posso comprare?",
      versions: [
        { label: "VERSIONE UNICA", text: "Ciao! Basta visitare il nostro sito tramite il link in bio, scegliere la tua taglia e colore e completare l'acquisto! Spedizione gratuita in Italia." },
      ],
      tip: "Risposta semplice che indirizza al sito."
    },
    part4: {
      title: "DM: Avete un negozio fisico?",
      versions: [
        { label: "VERSIONE 1 — Emotiva", text: "Ciao! Il nostro negozio fisico a [città] ha chiuso durante la pandemia nel 2020. Ma ci siamo reinventati! Oggi raggiungiamo tutta l'Italia attraverso il nostro sito [site] con spedizione gratuita." },
        { label: "VERSIONE 2 — Breve", text: "Ciao! Il nostro negozio fisico ha chiuso nel 2020. Da allora siamo online e consegniamo in tutta Italia! Visitaci su [site]" },
      ],
      tip: "La Versione 1 umanizza il brand e crea empatia."
    }
  },
  FR: {
    part1: {
      title: "DM: Commande / Pas reçu / Problèmes",
      versions: [
        { label: "VERSION 1 — Directe", text: "Bonjour ! Merci de nous avoir contactés. Pour les questions concernant votre commande, nous vous prions de nous envoyer un e-mail à [e-mail du magasin] avec le numéro de commande — notre équipe répond sous 24 à 48h ouvrables. Nous sommes là pour vous aider !" },
        { label: "VERSION 2 — Plus chaleureuse", text: "Bonjour ! Nous sommes désolés pour ce désagrément. Afin de résoudre votre situation avec toute l'attention qu'elle mérite, nous vous prions de nous contacter par e-mail : [e-mail du magasin] Incluez votre numéro de commande et notre équipe vous répondra sous 24 à 48h ouvrables." },
        { label: "VERSION 3 — Super courte", text: "Bonjour ! Pour les questions sur les commandes, envoyez-nous un e-mail à [e-mail du magasin] avec votre numéro de commande. Nous répondons sous 24-48h !" },
      ],
      tip: "Au quotidien, utilisez la Version 3 pour répondre rapidement."
    },
    part2: {
      title: "Commentaires sur le Feed: Questions sur le Prix",
      versions: [
        { label: "VERSION 1 — Neutre et directe", text: "Bonjour ! Toutes les informations sur le prix, les tailles et la disponibilité sont sur notre site, accédez via le lien dans la bio !" },
        { label: "VERSION 2 — Enthousiaste", text: "Bonjour ! Vous pouvez voir le prix et tous les détails de ce produit directement sur notre site, cliquez simplement sur le lien dans la bio ! Nous offrons la livraison gratuite en France" },
      ],
      tip: "Ne jamais mettre le prix dans les commentaires."
    },
    part3: {
      title: "Commentaires: Où acheter ?",
      versions: [
        { label: "VERSION UNIQUE", text: "Bonjour ! Visitez simplement notre site via le lien dans la bio, choisissez votre taille et couleur et finalisez votre achat ! Livraison gratuite en France." },
      ],
      tip: "Réponse simple qui dirige vers le site."
    },
    part4: {
      title: "DM: Avez-vous une boutique physique ?",
      versions: [
        { label: "VERSION 1 — Émotive", text: "Bonjour ! Notre boutique physique à [ville] a fermé pendant la pandémie en 2020. Mais nous nous sommes réinventés ! Aujourd'hui nous livrons dans toute la France via notre site [site] avec livraison gratuite." },
        { label: "VERSION 2 — Courte", text: "Bonjour ! Notre boutique physique a fermé en 2020. Depuis, nous sommes en ligne et livrons dans toute la France ! Visitez-nous sur [site]" },
      ],
      tip: "La Version 1 humanise la marque et crée de l'empathie."
    }
  },
  DE: {
    part1: {
      title: "DM: Bestellung / Nicht erhalten / Probleme",
      versions: [
        { label: "VERSION 1 — Direkt", text: "Hallo! Vielen Dank für Ihre Nachricht. Bei Fragen zu Ihrer Bestellung bitten wir Sie, uns eine E-Mail an [E-Mail des Shops] mit Ihrer Bestellnummer zu senden — unser Team antwortet innerhalb von 24 bis 48 Geschäftsstunden. Wir sind hier, um zu helfen!" },
        { label: "VERSION 2 — Wärmer", text: "Hallo! Es tut uns leid für die Unannehmlichkeiten. Um Ihre Situation mit der gebührenden Aufmerksamkeit zu lösen, bitten wir Sie, uns per E-Mail zu kontaktieren: [E-Mail des Shops] Geben Sie Ihre Bestellnummer an und unser Team antwortet innerhalb von 24 bis 48 Geschäftsstunden." },
        { label: "VERSION 3 — Super kurz", text: "Hallo! Bei Fragen zu Bestellungen senden Sie uns eine E-Mail an [E-Mail des Shops] mit Ihrer Bestellnummer. Wir antworten innerhalb von 24-48h!" },
      ],
      tip: "Im Alltag verwenden Sie Version 3 für schnelle Antworten."
    },
    part2: {
      title: "Feed-Kommentare: Preisfragen",
      versions: [
        { label: "VERSION 1 — Neutral und direkt", text: "Hallo! Alle Informationen zu Preis, Größen und Verfügbarkeit finden Sie auf unserer Website, Zugang über den Link in der Bio!" },
        { label: "VERSION 2 — Enthusiastisch", text: "Hallo! Sie können den Preis und alle Details zu diesem Produkt direkt auf unserer Website sehen, klicken Sie einfach auf den Link in der Bio! Wir bieten kostenlosen Versand in Deutschland" },
      ],
      tip: "Niemals den Preis in den Kommentaren angeben."
    },
    part3: {
      title: "Kommentare: Wo kann ich kaufen?",
      versions: [
        { label: "EINZIGE VERSION", text: "Hallo! Besuchen Sie einfach unsere Website über den Link in der Bio, wählen Sie Ihre Größe und Farbe und schließen Sie Ihren Kauf ab! Kostenloser Versand in Deutschland." },
      ],
      tip: "Einfache Antwort, die zur Website führt."
    },
    part4: {
      title: "DM: Haben Sie ein Ladengeschäft?",
      versions: [
        { label: "VERSION 1 — Emotional", text: "Hallo! Unser Ladengeschäft in [Stadt] hat während der Pandemie 2020 geschlossen. Aber wir haben uns neu erfunden! Heute erreichen wir ganz Deutschland über unsere Website [site] mit kostenlosem Versand." },
        { label: "VERSION 2 — Kurz", text: "Hallo! Unser Ladengeschäft hat 2020 geschlossen. Seitdem sind wir online und liefern in ganz Deutschland! Besuchen Sie uns auf [site]" },
      ],
      tip: "Version 1 vermenschlicht die Marke und schafft Empathie."
    }
  }
}

// Email Templates for all languages
const EMAIL_TEMPLATES: Record<string, { refund: any[]; delivery: any[]; legal: any[] }> = {
  PT: {
    refund: [
      {
        label: "DEFEITO / INCORRETO — REENVIO GRATUITO",
        subject: "Re: Problema com a Encomenda #[nº_encomenda] — Solução Imediata",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar e pedimos sinceras desculpas pelo sucedido com a sua encomenda #[nº_encomenda].

Após analisar as fotografias que nos enviou, confirmamos que o artigo apresenta [defeito / foi enviado incorretamente]. Assumimos total responsabilidade por esta situação.

Como forma de resolução imediata, procedemos ao reenvio de um novo artigo sem qualquer custo adicional para si. Não necessita de devolver o artigo recebido.

O novo envio será processado nas próximas 24 a 48 horas úteis.

Agradecemos a sua paciência e pedimos desculpa pelo transtorno.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Use quando o fornecedor aceita reenviar."
      },
      {
        label: "TAMANHO ERRADO — NEGADO + VOUCHER",
        subject: "Re: Pedido de Devolução — Encomenda #[nº_encomenda]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar relativamente à sua encomenda #[nº_encomenda].

Lamentamos que o tamanho selecionado não tenha sido o mais adequado.

De acordo com a nossa Política de Reembolso, não aceitamos devoluções por motivos de tamanho, uma vez que disponibilizamos tabelas de tamanhos detalhadas.

No entanto, gostaríamos de oferecer-lhe um código de desconto de [10/15]% na sua próxima compra:

Código: [inserir cupom de desconto]

Este código é válido por 30 dias.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "O voucher amortiza a insatisfação e incentiva nova compra."
      }
    ],
    delivery: [
      {
        label: "EM TRÂNSITO — DENTRO DO PRAZO",
        subject: "Re: Acompanhamento — Encomenda #[nº_encomenda]",
        body: `Exma. Sr.ª [nome],

Obrigada por nos contactar relativamente à sua encomenda #[nº_encomenda].

Confirmamos que a sua encomenda foi enviada em [data_envio] com o número de rastreamento: [nº_rastreamento].

Pode acompanhar o estado da entrega aqui:
[inserir link de rastreamento]

O prazo habitual de entrega é de 6 a 9 dias úteis após envio.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail da loja]`
      }
    ],
    legal: [
      {
        label: "AMEAÇA COM ADVOGADO — RESPOSTA FORMAL",
        subject: "Re: Encomenda #[nº_encomenda] — Resposta Formal",
        body: `Exma. Sr.ª [nome],

Acusamos a receção da sua mensagem e tomamos nota da intenção de recorrer a assessoria jurídica relativamente à encomenda #[nº_encomenda].

A [nome da marca] opera em plena conformidade com a legislação portuguesa de defesa do consumidor.

Permanecemos disponíveis para resolver esta situação dentro das nossas políticas vigentes.

Com os melhores cumprimentos,
Equipe de Apoio ao Cliente — [nome da marca]
[e-mail jurídico da loja]`,
        tip: "IMPORTANTE: Enviar sempre do e-mail jurídico da loja."
      }
    ]
  },
  BR: {
    refund: [
      {
        label: "DEFEITO / INCORRETO — REENVIO GRATUITO",
        subject: "Re: Problema com o Pedido #[nº_pedido] — Solução Imediata",
        body: `Prezada Sra. [nome],

Obrigada por entrar em contato e pedimos sinceras desculpas pelo ocorrido com seu pedido #[nº_pedido].

Após analisar as fotos que nos enviou, confirmamos que o artigo apresenta [defeito / foi enviado incorretamente]. Assumimos total responsabilidade por essa situação.

Como forma de resolução imediata, procedemos ao reenvio de um novo artigo sem nenhum custo adicional para você. Não precisa devolver o artigo recebido.

O novo envio será processado nas próximas 24 a 48 horas úteis.

Agradecemos sua paciência e pedimos desculpas pelo transtorno.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`,
        tip: "Use quando o fornecedor aceita reenviar."
      }
    ],
    delivery: [
      {
        label: "EM TRÂNSITO — DENTRO DO PRAZO",
        subject: "Re: Acompanhamento — Pedido #[nº_pedido]",
        body: `Prezada Sra. [nome],

Obrigada por entrar em contato sobre seu pedido #[nº_pedido].

Confirmamos que seu pedido foi enviado em [data_envio] com o código de rastreamento: [código_rastreamento].

Você pode acompanhar o status da entrega aqui:
[inserir link de rastreamento]

O prazo habitual de entrega é de 6 a 9 dias úteis após envio.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail da loja]`
      }
    ],
    legal: [
      {
        label: "AMEAÇA COM ADVOGADO — RESPOSTA FORMAL",
        subject: "Re: Pedido #[nº_pedido] — Resposta Formal",
        body: `Prezada Sra. [nome],

Acusamos o recebimento de sua mensagem e tomamos nota da intenção de recorrer a assessoria jurídica em relação ao pedido #[nº_pedido].

A [nome da marca] opera em plena conformidade com a legislação brasileira de defesa do consumidor.

Permanecemos disponíveis para resolver esta situação dentro de nossas políticas vigentes.

Atenciosamente,
Equipe de Atendimento ao Cliente — [nome da marca]
[e-mail jurídico da loja]`,
        tip: "IMPORTANTE: Enviar sempre do e-mail jurídico da loja."
      }
    ]
  },
  ES: {
    refund: [
      {
        label: "DEFECTO / INCORRECTO — REENVÍO GRATUITO",
        subject: "Re: Problema con el Pedido #[nº_pedido] — Solución Inmediata",
        body: `Estimada Sra. [nombre],

Gracias por contactarnos y pedimos sinceras disculpas por lo ocurrido con su pedido #[nº_pedido].

Tras analizar las fotografías que nos envió, confirmamos que el artículo presenta [defecto / fue enviado incorrectamente]. Asumimos total responsabilidad por esta situación.

Como forma de resolución inmediata, procedemos al reenvío de un nuevo artículo sin ningún coste adicional para usted. No necesita devolver el artículo recibido.

El nuevo envío será procesado en las próximas 24 a 48 horas hábiles.

Agradecemos su paciencia y pedimos disculpas por las molestias.

Atentamente,
Equipo de Atención al Cliente — [nombre de la marca]
[e-mail de la tienda]`,
        tip: "Use cuando el proveedor acepta reenviar."
      }
    ],
    delivery: [
      {
        label: "EN TRÁNSITO — DENTRO DEL PLAZO",
        subject: "Re: Seguimiento — Pedido #[nº_pedido]",
        body: `Estimada Sra. [nombre],

Gracias por contactarnos sobre su pedido #[nº_pedido].

Confirmamos que su pedido fue enviado el [fecha_envío] con el número de seguimiento: [nº_seguimiento].

Puede seguir el estado de la entrega aquí:
[insertar link de seguimiento]

El plazo habitual de entrega es de 6 a 9 días hábiles tras el envío.

Atentamente,
Equipo de Atención al Cliente — [nombre de la marca]
[e-mail de la tienda]`
      }
    ],
    legal: [
      {
        label: "AMENAZA CON ABOGADO — RESPUESTA FORMAL",
        subject: "Re: Pedido #[nº_pedido] — Respuesta Formal",
        body: `Estimada Sra. [nombre],

Acusamos recibo de su mensaje y tomamos nota de su intención de recurrir a asesoría jurídica en relación al pedido #[nº_pedido].

[nombre de la marca] opera en pleno cumplimiento con la legislación española de defensa del consumidor.

Permanecemos disponibles para resolver esta situación dentro de nuestras políticas vigentes.

Atentamente,
Equipo de Atención al Cliente — [nombre de la marca]
[e-mail jurídico de la tienda]`,
        tip: "IMPORTANTE: Enviar siempre desde el e-mail jurídico de la tienda."
      }
    ]
  },
  GB: {
    refund: [
      {
        label: "DEFECT / INCORRECT — FREE RESEND",
        subject: "Re: Issue with Order #[order_number] — Immediate Solution",
        body: `Dear Ms [name],

Thank you for contacting us and we sincerely apologise for what happened with your order #[order_number].

After analysing the photographs you sent us, we confirm that the item has [defect / was sent incorrectly]. We take full responsibility for this situation.

As an immediate resolution, we are proceeding with sending a new item at no additional cost to you. You do not need to return the item received.

The new shipment will be processed within the next 24 to 48 business hours.

We appreciate your patience and apologise for the inconvenience.

Kind regards,
Customer Support Team — [brand name]
[store email]`,
        tip: "Use when the supplier accepts to resend."
      }
    ],
    delivery: [
      {
        label: "IN TRANSIT — WITHIN TIMEFRAME",
        subject: "Re: Tracking — Order #[order_number]",
        body: `Dear Ms [name],

Thank you for contacting us about your order #[order_number].

We confirm that your order was shipped on [shipping_date] with tracking number: [tracking_number].

You can track the delivery status here:
[insert tracking link]

The usual delivery time is 6 to 9 business days after shipping.

Kind regards,
Customer Support Team — [brand name]
[store email]`
      }
    ],
    legal: [
      {
        label: "THREAT WITH LAWYER — FORMAL RESPONSE",
        subject: "Re: Order #[order_number] — Formal Response",
        body: `Dear Ms [name],

We acknowledge receipt of your message and note your intention to seek legal advice regarding order #[order_number].

[brand name] operates in full compliance with UK consumer protection legislation.

We remain available to resolve this situation within our current policies.

Kind regards,
Customer Support Team — [brand name]
[legal store email]`,
        tip: "IMPORTANT: Always send from the store's legal email."
      }
    ]
  },
  US: {
    refund: [
      {
        label: "DEFECT / INCORRECT — FREE RESEND",
        subject: "Re: Issue with Order #[order_number] — Immediate Solution",
        body: `Dear Ms [name],

Thank you for contacting us and we sincerely apologize for what happened with your order #[order_number].

After analyzing the photographs you sent us, we confirm that the item has [defect / was sent incorrectly]. We take full responsibility for this situation.

As an immediate resolution, we are proceeding with sending a new item at no additional cost to you. You do not need to return the item received.

The new shipment will be processed within the next 24 to 48 business hours.

We appreciate your patience and apologize for the inconvenience.

Best regards,
Customer Support Team — [brand name]
[store email]`,
        tip: "Use when the supplier accepts to resend."
      }
    ],
    delivery: [
      {
        label: "IN TRANSIT — WITHIN TIMEFRAME",
        subject: "Re: Tracking — Order #[order_number]",
        body: `Dear Ms [name],

Thank you for contacting us about your order #[order_number].

We confirm that your order was shipped on [shipping_date] with tracking number: [tracking_number].

You can track the delivery status here:
[insert tracking link]

The usual delivery time is 6 to 9 business days after shipping.

Best regards,
Customer Support Team — [brand name]
[store email]`
      }
    ],
    legal: [
      {
        label: "THREAT WITH LAWYER — FORMAL RESPONSE",
        subject: "Re: Order #[order_number] — Formal Response",
        body: `Dear Ms [name],

We acknowledge receipt of your message and note your intention to seek legal advice regarding order #[order_number].

[brand name] operates in full compliance with US consumer protection legislation.

We remain available to resolve this situation within our current policies.

Best regards,
Customer Support Team — [brand name]
[legal store email]`,
        tip: "IMPORTANT: Always send from the store's legal email."
      }
    ]
  },
  CA: {
    refund: [
      {
        label: "DEFECT / INCORRECT — FREE RESEND",
        subject: "Re: Issue with Order #[order_number] — Immediate Solution",
        body: `Dear Ms [name],

Thank you for contacting us and we sincerely apologize for what happened with your order #[order_number].

After analyzing the photographs you sent us, we confirm that the item has [defect / was sent incorrectly]. We take full responsibility for this situation.

As an immediate resolution, we are proceeding with sending a new item at no additional cost to you. You do not need to return the item received.

The new shipment will be processed within the next 24 to 48 business hours.

We appreciate your patience and apologize for the inconvenience.

Best regards,
Customer Support Team — [brand name]
[store email]`,
        tip: "Use when the supplier accepts to resend."
      }
    ],
    delivery: [
      {
        label: "IN TRANSIT — WITHIN TIMEFRAME",
        subject: "Re: Tracking — Order #[order_number]",
        body: `Dear Ms [name],

Thank you for contacting us about your order #[order_number].

We confirm that your order was shipped on [shipping_date] with tracking number: [tracking_number].

You can track the delivery status here:
[insert tracking link]

The usual delivery time is 6 to 9 business days after shipping.

Best regards,
Customer Support Team — [brand name]
[store email]`
      }
    ],
    legal: [
      {
        label: "THREAT WITH LAWYER — FORMAL RESPONSE",
        subject: "Re: Order #[order_number] — Formal Response",
        body: `Dear Ms [name],

We acknowledge receipt of your message and note your intention to seek legal advice regarding order #[order_number].

[brand name] operates in full compliance with Canadian consumer protection legislation.

We remain available to resolve this situation within our current policies.

Best regards,
Customer Support Team — [brand name]
[legal store email]`,
        tip: "IMPORTANT: Always send from the store's legal email."
      }
    ]
  },
  IT: {
    refund: [
      {
        label: "DIFETTO / ERRATO — RISPEDIZIONE GRATUITA",
        subject: "Re: Problema con l'Ordine #[numero_ordine] — Soluzione Immediata",
        body: `Gentile Sig.ra [nome],

Grazie per averci contattato e ci scusiamo sinceramente per l'accaduto con il suo ordine #[numero_ordine].

Dopo aver analizzato le fotografie che ci ha inviato, confermiamo che l'articolo presenta [difetto / è stato inviato erroneamente]. Ci assumiamo la piena responsabilità di questa situazione.

Come soluzione immediata, procediamo alla rispedizione di un nuovo articolo senza alcun costo aggiuntivo per lei. Non è necessario restituire l'articolo ricevuto.

La nuova spedizione sarà elaborata entro le prossime 24-48 ore lavorative.

La ringraziamo per la pazienza e ci scusiamo per l'inconveniente.

Cordiali saluti,
Team di Assistenza Clienti — [nome del brand]
[e-mail del negozio]`,
        tip: "Usa quando il fornitore accetta di rispedire."
      }
    ],
    delivery: [
      {
        label: "IN TRANSITO — ENTRO I TEMPI",
        subject: "Re: Tracciamento — Ordine #[numero_ordine]",
        body: `Gentile Sig.ra [nome],

Grazie per averci contattato riguardo al suo ordine #[numero_ordine].

Confermiamo che il suo ordine è stato spedito il [data_spedizione] con numero di tracciamento: [numero_tracciamento].

Può seguire lo stato della consegna qui:
[inserire link di tracciamento]

Il tempo di consegna abituale è di 6-9 giorni lavorativi dalla spedizione.

Cordiali saluti,
Team di Assistenza Clienti — [nome del brand]
[e-mail del negozio]`
      }
    ],
    legal: [
      {
        label: "MINACCIA CON AVVOCATO — RISPOSTA FORMALE",
        subject: "Re: Ordine #[numero_ordine] — Risposta Formale",
        body: `Gentile Sig.ra [nome],

Accusiamo ricevimento del suo messaggio e prendiamo nota della sua intenzione di ricorrere a consulenza legale riguardo all'ordine #[numero_ordine].

[nome del brand] opera in piena conformità con la legislazione italiana a tutela del consumatore.

Restiamo disponibili a risolvere questa situazione nell'ambito delle nostre politiche vigenti.

Cordiali saluti,
Team di Assistenza Clienti — [nome del brand]
[e-mail legale del negozio]`,
        tip: "IMPORTANTE: Inviare sempre dall'e-mail legale del negozio."
      }
    ]
  },
  FR: {
    refund: [
      {
        label: "DÉFAUT / INCORRECT — RÉEXPÉDITION GRATUITE",
        subject: "Re: Problème avec la Commande #[numéro_commande] — Solution Immédiate",
        body: `Chère Madame [nom],

Merci de nous avoir contactés et nous vous présentons nos sincères excuses pour ce qui s'est passé avec votre commande #[numéro_commande].

Après avoir analysé les photographies que vous nous avez envoyées, nous confirmons que l'article présente [défaut / a été envoyé incorrectement]. Nous assumons l'entière responsabilité de cette situation.

Comme solution immédiate, nous procédons à la réexpédition d'un nouvel article sans aucun frais supplémentaire pour vous. Vous n'avez pas besoin de retourner l'article reçu.

La nouvelle expédition sera traitée dans les 24 à 48 heures ouvrables.

Nous vous remercions de votre patience et nous excusons pour le désagrément.

Cordialement,
Équipe du Service Client — [nom de la marque]
[e-mail du magasin]`,
        tip: "Utilisez quand le fournisseur accepte de réexpédier."
      }
    ],
    delivery: [
      {
        label: "EN TRANSIT — DANS LES DÉLAIS",
        subject: "Re: Suivi — Commande #[numéro_commande]",
        body: `Chère Madame [nom],

Merci de nous avoir contactés concernant votre commande #[numéro_commande].

Nous confirmons que votre commande a été expédiée le [date_expédition] avec le numéro de suivi : [numéro_suivi].

Vous pouvez suivre l'état de la livraison ici :
[insérer lien de suivi]

Le délai de livraison habituel est de 6 à 9 jours ouvrables après l'expédition.

Cordialement,
Équipe du Service Client — [nom de la marque]
[e-mail du magasin]`
      }
    ],
    legal: [
      {
        label: "MENACE AVEC AVOCAT — RÉPONSE FORMELLE",
        subject: "Re: Commande #[numéro_commande] — Réponse Formelle",
        body: `Chère Madame [nom],

Nous accusons réception de votre message et prenons note de votre intention de recourir à un conseiller juridique concernant la commande #[numéro_commande].

[nom de la marque] opère en pleine conformité avec la législation française de protection du consommateur.

Nous restons disponibles pour résoudre cette situation dans le cadre de nos politiques en vigueur.

Cordialement,
Équipe du Service Client — [nom de la marque]
[e-mail juridique du magasin]`,
        tip: "IMPORTANT: Toujours envoyer depuis l'e-mail juridique du magasin."
      }
    ]
  },
  DE: {
    refund: [
      {
        label: "DEFEKT / FALSCH — KOSTENLOSER NEUVERSAND",
        subject: "Re: Problem mit Bestellung #[Bestellnummer] — Sofortige Lösung",
        body: `Sehr geehrte Frau [Name],

Vielen Dank für Ihre Kontaktaufnahme und wir entschuldigen uns aufrichtig für das Geschehene mit Ihrer Bestellung #[Bestellnummer].

Nach Analyse der Fotos, die Sie uns geschickt haben, bestätigen wir, dass der Artikel [Defekt / falsch gesendet wurde]. Wir übernehmen die volle Verantwortung für diese Situation.

Als sofortige Lösung veranlassen wir den Versand eines neuen Artikels ohne zusätzliche Kosten für Sie. Sie müssen den erhaltenen Artikel nicht zurücksenden.

Der neue Versand wird innerhalb der nächsten 24 bis 48 Geschäftsstunden bearbeitet.

Wir danken Ihnen für Ihre Geduld und entschuldigen uns für die Unannehmlichkeiten.

Mit freundlichen Grüßen,
Kundenservice-Team — [Markenname]
[Shop-E-Mail]`,
        tip: "Verwenden Sie, wenn der Lieferant einen Neuversand akzeptiert."
      }
    ],
    delivery: [
      {
        label: "UNTERWEGS — IM ZEITRAHMEN",
        subject: "Re: Sendungsverfolgung — Bestellung #[Bestellnummer]",
        body: `Sehr geehrte Frau [Name],

Vielen Dank für Ihre Kontaktaufnahme bezüglich Ihrer Bestellung #[Bestellnummer].

Wir bestätigen, dass Ihre Bestellung am [Versanddatum] mit Sendungsnummer: [Sendungsnummer] versendet wurde.

Sie können den Lieferstatus hier verfolgen:
[Tracking-Link einfügen]

Die übliche Lieferzeit beträgt 6 bis 9 Werktage nach Versand.

Mit freundlichen Grüßen,
Kundenservice-Team — [Markenname]
[Shop-E-Mail]`
      }
    ],
    legal: [
      {
        label: "DROHUNG MIT ANWALT — FORMELLE ANTWORT",
        subject: "Re: Bestellung #[Bestellnummer] — Formelle Antwort",
        body: `Sehr geehrte Frau [Name],

Wir bestätigen den Eingang Ihrer Nachricht und nehmen Ihre Absicht zur Kenntnis, rechtliche Beratung bezüglich der Bestellung #[Bestellnummer] einzuholen.

[Markenname] arbeitet in voller Übereinstimmung mit dem deutschen Verbraucherschutzrecht.

Wir stehen weiterhin zur Verfügung, um diese Situation im Rahmen unserer geltenden Richtlinien zu lösen.

Mit freundlichen Grüßen,
Kundenservice-Team — [Markenname]
[Rechtliche Shop-E-Mail]`,
        tip: "WICHTIG: Immer von der rechtlichen Shop-E-Mail senden."
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
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F7]">E-mails</h1>
        <p className="text-[rgba(245,245,247,0.52)]">Templates de respostas para e-mails e redes sociais</p>
      </div>

      {/* Country Selector */}
      <div className="flex flex-wrap gap-2">
        {COUNTRIES.map((country) => (
          <button
            key={country.code}
            onClick={() => setSelectedCountry(country.code)}
            title={country.name}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              selectedCountry === country.code
                ? "bg-[#7B3FE4] ring-2 ring-[#A855F7] ring-offset-2 ring-offset-[#0B0B10]"
                : "bg-[#101018] border border-[rgba(255,255,255,0.1)] hover:bg-[#141424] hover:border-[rgba(255,255,255,0.2)]"
            }`}
          >
            <img 
              src={country.flagUrl} 
              alt={country.name}
              className="w-6 h-4 object-cover rounded-sm"
            />
            <span className="text-sm font-medium text-[#F5F5F7]">{country.code}</span>
          </button>
        ))}
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("instagram")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === "instagram"
              ? "bg-[#7B3FE4] text-white"
              : "bg-[#101018] border border-[rgba(255,255,255,0.1)] text-[#F5F5F7] hover:bg-[#141424]"
          }`}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === "email"
              ? "bg-[#7B3FE4] text-white"
              : "bg-[#101018] border border-[rgba(255,255,255,0.1)] text-[#F5F5F7] hover:bg-[#141424]"
          }`}
        >
          <Mail className="h-4 w-4" />
          E-mail
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-350px)]">
        {activeTab === "instagram" ? (
          <div className="space-y-6 pr-4">
            {/* Instagram Messages */}
            {[instagramMessages.part1, instagramMessages.part2, instagramMessages.part3, instagramMessages.part4].map((part, partIndex) => (
              <Card key={partIndex} className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
                <CardHeader className="bg-[#1a2744] py-3 px-4">
                  <CardTitle className="text-white text-sm font-semibold">{part.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {part.versions.map((version: any, vIndex: number) => (
                    <div key={vIndex} className="bg-[#0B0B10] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#A855F7] font-medium">{version.label}</span>
                        <button
                          onClick={() => copyToClipboard(version.text, `ig-${partIndex}-${vIndex}`)}
                          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] transition-colors"
                        >
                          {copiedIndex === `ig-${partIndex}-${vIndex}` ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{highlightBrackets(version.text)}</p>
                    </div>
                  ))}
                  {part.tip && (
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-200">{part.tip}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6 pr-4">
            {/* Instructions Banner */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-200">Instruções de Uso</p>
                <p className="text-xs text-amber-200/70 mt-1">
                  Os campos em <span className="text-red-400">[vermelho]</span> devem ser preenchidos com os dados específicos de cada caso antes de enviar.
                </p>
              </div>
            </div>

            {/* Refund Section */}
            <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
              <CardHeader className="bg-[#1a2744] py-3 px-4">
                <CardTitle className="text-white text-sm font-semibold">REEMBOLSO</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {emailTemplates.refund.map((template: any, index: number) => (
                  <div key={index} className="bg-[#0B0B10] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
                    <div className="text-xs text-[#A855F7] font-medium mb-3">{template.label}</div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[rgba(245,245,247,0.52)]">Assunto:</span>
                        <button
                          onClick={() => copyToClipboard(template.subject, `email-refund-subject-${index}`)}
                          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7]"
                        >
                          {copiedIndex === `email-refund-subject-${index}` ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-sm text-[#F5F5F7] font-medium">{highlightBrackets(template.subject)}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[rgba(245,245,247,0.52)]">Corpo:</span>
                        <button
                          onClick={() => copyToClipboard(template.body, `email-refund-body-${index}`)}
                          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7]"
                        >
                          {copiedIndex === `email-refund-body-${index}` ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{highlightBrackets(template.body)}</p>
                    </div>
                    
                    {template.tip && (
                      <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-200">{template.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Section */}
            <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
              <CardHeader className="bg-[#1a2744] py-3 px-4">
                <CardTitle className="text-white text-sm font-semibold">ENTREGA</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {emailTemplates.delivery.map((template: any, index: number) => (
                  <div key={index} className="bg-[#0B0B10] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
                    <div className="text-xs text-[#A855F7] font-medium mb-3">{template.label}</div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[rgba(245,245,247,0.52)]">Assunto:</span>
                        <button
                          onClick={() => copyToClipboard(template.subject, `email-delivery-subject-${index}`)}
                          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7]"
                        >
                          {copiedIndex === `email-delivery-subject-${index}` ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-sm text-[#F5F5F7] font-medium">{highlightBrackets(template.subject)}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[rgba(245,245,247,0.52)]">Corpo:</span>
                        <button
                          onClick={() => copyToClipboard(template.body, `email-delivery-body-${index}`)}
                          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7]"
                        >
                          {copiedIndex === `email-delivery-body-${index}` ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{highlightBrackets(template.body)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Legal Section */}
            <Card className="bg-[#101018] border-[rgba(255,255,255,0.06)]">
              <CardHeader className="bg-red-900/30 py-3 px-4">
                <CardTitle className="text-red-400 text-sm font-semibold">AMEAÇA LEGAL</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {emailTemplates.legal.map((template: any, index: number) => (
                  <div key={index} className="bg-[#0B0B10] rounded-lg p-4 border border-red-500/20">
                    <div className="text-xs text-red-400 font-medium mb-3">{template.label}</div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[rgba(245,245,247,0.52)]">Assunto:</span>
                        <button
                          onClick={() => copyToClipboard(template.subject, `email-legal-subject-${index}`)}
                          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7]"
                        >
                          {copiedIndex === `email-legal-subject-${index}` ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-sm text-[#F5F5F7] font-medium">{highlightBrackets(template.subject)}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[rgba(245,245,247,0.52)]">Corpo:</span>
                        <button
                          onClick={() => copyToClipboard(template.body, `email-legal-body-${index}`)}
                          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7]"
                        >
                          {copiedIndex === `email-legal-body-${index}` ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-sm text-[rgba(245,245,247,0.72)] whitespace-pre-wrap">{highlightBrackets(template.body)}</p>
                    </div>
                    
                    {template.tip && (
                      <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-200">{template.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
