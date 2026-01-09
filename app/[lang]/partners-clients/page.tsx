import { createClient } from '@supabase/supabase-js';
import Clients from "@/components/Clients";
import Partners from "@/components/Partners";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Translation dictionary for the Server Component
const translations: Record<string, string> = {
  en: "Partners and Clients",
  sw: "Washirika na Wateja",
  fr: "Partenaires et Clients",
  es: "Socios y Clientes",
  de: "Partner und Kunden",
  it: "Partner e Clienti"
};

interface PageProps {
  params: Promise<{ lang?: string }>; // If your folder structure uses [lang]
}

export default async function PartnersPage({ params }: PageProps) {
  // Determine locale (default to 'en' if not found)
  const lang = (await params).lang || 'en';
  const title = translations[lang] || translations.en;

  // Fetch data on the server
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, slug, logo')
    .order('id', { ascending: false });

  return (
    <div>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{title}</h1>
        </div>
      </section>
      
      {/* These child components already use "use client" and useTranslation() internally */}
      <Clients initialClients={clients || []} />        
      <Partners />
    </div>
  );
}