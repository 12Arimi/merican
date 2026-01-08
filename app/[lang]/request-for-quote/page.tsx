import RequestQuoteForm from "@/components/RequestQuoteForm";

export default async function RequestForQuote({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Dictionary for static UI text
  const t: any = {
    title: { en: 'Request For Quote', sw: 'Ombi la Nukuu', fr: 'Demande de devis' },
    itemsTitle: { en: 'Your Items for Quote', sw: 'Bidhaa Zako', fr: 'Vos articles' },
    detailsTitle: { en: 'Your Details', sw: 'Maelezo Yako', fr: 'Vos coordonnées' },
  };

  return (
    <main>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{t.title[lang] || t.title.en}</h1>
        </div>
      </section>

      <section className="rfq-section">
        <div className="rfq-container">
          <div className="rfq-layout">
            {/* We wrap the logic in a client component */}
            <RequestQuoteForm lang={lang} t={t} />
          </div>
        </div>
      </section>
    </main>
  );
}