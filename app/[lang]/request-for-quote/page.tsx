import RequestQuoteForm from "@/components/RequestQuoteForm";

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
            {/* We pass the translation dictionary 't' and current 'lang' 
                to the client component which handles the cart logic 
            */}
            <RequestQuoteForm lang={lang} t={t} />
          </div>
        </div>
      </section>
    </main>
  );
}