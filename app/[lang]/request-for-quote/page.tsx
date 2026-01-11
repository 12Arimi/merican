import { Metadata } from 'next';
import RequestQuoteForm from "@/components/RequestQuoteForm";

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const seo: Record<string, { title: string; desc: string }> = {
    en: { 
      title: "Request a Custom Quote | Commercial Kitchen & Stainless Steel Pricing", 
      desc: "Get an accurate quote for your commercial kitchen project. Merican Limited provides competitive pricing for stainless steel fabrication and professional equipment in East Africa." 
    },
    sw: { 
      title: "Omba Nukuu ya Bei | Bei za Vifaa vya Jikoni na Chuma", 
      desc: "Pata nukuu sahihi ya bei kwa mradi wako wa jikoni. Merican Limited hutoa bei shindani kwa utengenezaji wa vifaa vya chuma na majiko ya kibiashara." 
    },
    fr: { 
      title: "Demander un Devis Personnalisé | Prix Équipement Cuisine et Inox", 
      desc: "Obtenez un devis précis pour votre projet de cuisine commerciale. Merican Limited offre des tarifs compétitifs pour la fabrication en inox et l'équipement professionnel." 
    },
    es: { 
      title: "Solicitar Presupuesto Personalizado | Precios de Equipos y Acero Inox", 
      desc: "Obtenga un presupuesto exacto para su proyecto de cocina industrial. Merican Limited ofrece precios competitivos en fabricación de acero inoxidable y equipos." 
    },
    de: { 
      title: "Individuelles Angebot anfordern | Preise für Großküchen & Edelstahl", 
      desc: "Erhalten Sie ein präzises Angebot für Ihr Großküchenprojekt. Merican Limited bietet wettbewerbsfähige Preise für Edelstahlverarbeitung und Profi-Equipment." 
    },
    it: { 
      title: "Richiedi un Preventivo Personalizzato | Prezzi Cucine e Acciaio Inox", 
      desc: "Ottieni un preventivo accurato per il tuo progetto di cucina professionale. Merican Limited offre prezzi competitivi per lavorazioni in inox e attrezzature." 
    }
  };

  const currentSeo = seo[lang] || seo.en;

  return {
    title: currentSeo.title,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/request-for-quote`,
      type: 'website',
    }
  };
}

// 📦 2. PAGE COMPONENT
export default async function RequestForQuote({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Dictionary for static UI text including all languages
  const t: any = {
    title: { 
      en: 'Request For Quote', 
      sw: 'Ombi la Nukuu', 
      fr: 'Demande de Devis',
      es: 'Solicitud de Presupuesto',
      de: 'Angebotsanfrage',
      it: 'Richiesta di Preventivo'
    },
    itemsTitle: { 
      en: 'Your Items for Quote', 
      sw: 'Bidhaa Zako za Nukuu', 
      fr: 'Vos Articles pour Devis',
      es: 'Sus Artículos para Presupuesto',
      de: 'Ihre Artikel für das Angebot',
      it: 'I Tuoi Articoli per il Preventivo'
    },
    detailsTitle: { 
      en: 'Your Details', 
      sw: 'Maelezo Yako', 
      fr: 'Vos Coordonnées',
      es: 'Sus Datos',
      de: 'Ihre Details',
      it: 'I Tuoi Dettagli'
    },
  };

  return (
    <main>
      {/* 🏙️ PAGE BANNER */}
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">
            {t.title[lang] || t.title.en}
          </h1>
        </div>
      </section>

      <section className="rfq-section">
        <div className="rfq-container">
          <div className="rfq-layout">
            <RequestQuoteForm lang={lang} t={t} />
          </div>
        </div>
      </section>
    </main>
  );
}