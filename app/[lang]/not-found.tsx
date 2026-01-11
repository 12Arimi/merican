'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const params = useParams();
  const pathname = usePathname();
  const lang = useMemo(() => (params?.lang as string) || 'en', [params]);

  const [aiData, setAiData] = useState<{ message: string, suggestionLink: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const t: any = {
    en: {
      title: "You’re not lost — just exploring",
      subtitle: "We couldn't find this page, but we can help you get back on track.",
      thinking: "Our assistant is reviewing your request…",
      suggestion: "Suggested destination",
      explore: "Take me there",
      home: "Home",
      products: "Products",
      projects: "Projects",
      contact: "Contact"
    },
    sw: {
      title: "Hujapotea — bado uko safarini",
      subtitle: "Ukurasa huu haukupatikana, lakini tunaweza kukusaidia.",
      thinking: "Msaidizi wetu anachakata ombi lako…",
      suggestion: "Pendekezo",
      explore: "Nipeleke huko",
      home: "Mwanzo",
      products: "Bidhaa",
      projects: "Miradi",
      contact: "Wasiliana"
    },
    fr: {
      title: "Vous n’êtes pas perdu",
      subtitle: "Cette page est introuvable, mais nous pouvons vous guider.",
      thinking: "Analyse de votre demande…",
      suggestion: "Suggestion",
      explore: "Découvrir",
      home: "Accueil",
      products: "Produits",
      projects: "Projets",
      contact: "Contact"
    },
    es: {
      title: "No estás perdido",
      subtitle: "No encontramos esta página, pero podemos ayudarte.",
      thinking: "Analizando tu solicitud…",
      suggestion: "Sugerencia",
      explore: "Explorar",
      home: "Inicio",
      products: "Productos",
      projects: "Proyectos",
      contact: "Contacto"
    },
    de: {
      title: "Sie sind nicht verloren",
      subtitle: "Diese Seite existiert nicht, aber wir helfen Ihnen weiter.",
      thinking: "Analyse läuft…",
      suggestion: "Empfehlung",
      explore: "Ansehen",
      home: "Startseite",
      products: "Produkte",
      projects: "Projekte",
      contact: "Kontakt"
    },
    it: {
      title: "Non sei perso",
      subtitle: "Questa pagina non esiste, ma possiamo aiutarti.",
      thinking: "Analisi in corso…",
      suggestion: "Suggerimento",
      explore: "Vai alla pagina",
      home: "Home",
      products: "Prodotti",
      projects: "Progetti",
      contact: "Contatti"
    }
  }[lang];

  useEffect(() => {
    async function fetchGuidance() {
      try {
        const res = await fetch('/api/ai-404', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brokenUrl: pathname, lang }),
        });
        const data = await res.json();
        setAiData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuidance();
  }, [pathname, lang]);

return (
  <main>
    {/* Restored Merican Banner with calming text */}
    <section className="merican-page-banner">
      <div className="merican-banner-overlay">
        <h1 className="merican-banner-title">
          {lang === 'sw' && "Tuko hapa kukusaidia"}
          {lang === 'fr' && "Nous sommes là pour vous guider"}
          {lang === 'es' && "Estamos aquí para ayudarte"}
          {lang === 'de' && "Wir helfen Ihnen weiter"}
          {lang === 'it' && "Siamo qui per aiutarti"}
          {lang === 'en' && "We’re here to guide you"}
        </h1>
      </div>
    </section>

    {/* New redesigned 404 experience */}
    <section className="smart-404">
      <div className="smart-404-wrapper">

        <h1 className="smart-404-title">{t.title}</h1>
        <p className="smart-404-sub">{t.subtitle}</p>

        <div className="smart-404-ai">
          {loading ? (
            <p className="smart-404-loading">{t.thinking}</p>
          ) : (
            <>
              <p className="smart-404-label">{t.suggestion}</p>
              <p className="smart-404-message">{aiData?.message}</p>

              {aiData?.suggestionLink && (
                <Link href={aiData.suggestionLink} className="smart-404-cta">
                  {t.explore}
                </Link>
              )}
            </>
          )}
        </div>

        <div className="smart-404-nav">
          <Link href={`/${lang}`}>{t.home}</Link>
          <Link href={`/${lang}/products`}>{t.products}</Link>
          <Link href={`/${lang}/services-projects`}>{t.projects}</Link>
          <Link href={`/${lang}/contact`}>{t.contact}</Link>
        </div>

      </div>
    </section>
  </main>
);
}
