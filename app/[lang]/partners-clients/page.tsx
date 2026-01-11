import { createClient } from '@supabase/supabase-js';
import Clients from "@/components/Clients";
import Partners from "@/components/Partners";
import { Metadata } from 'next';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🔍 SEO METADATA GENERATION
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (await params).lang || 'en';

  const seo: Record<string, { title: string; desc: string }> = {
    en: { 
      title: "Our Partners & Clients | Trusted Commercial Kitchen Projects", 
      desc: "Explore the prestigious partners and clients who trust Merican Limited for world-class commercial kitchen equipment and stainless steel fabrication." 
    },
    sw: { 
      title: "Washirika na Wateja Wetu | Miradi Inayoaminika ya Jikoni", 
      desc: "Tazama washirika na wateja mashuhuri wanaoiaridhia Merican Limited kwa vifaa vya jikoni vya kibiashara na utengenezaji wa chuma bora." 
    },
    fr: { 
      title: "Nos Partenaires et Clients | Projets de Cuisine Commerciale de Confiance", 
      desc: "Découvrez les partenaires et clients prestigieux qui font confiance à Merican Limited pour l'équipement de cuisine commerciale et la fabrication d'inox." 
    },
    es: { 
      title: "Nuestros Socios y Clientes | Proyectos de Cocina Comercial de Confianza", 
      desc: "Explore los socios y clientes que confían en Merican Limited para equipos de cocina industrial y fabricación de acero inoxidable de clase mundial." 
    },
    de: { 
      title: "Unsere Partner und Kunden | Vertrauenswürdige Großküchenprojekte", 
      desc: "Entdecken Sie die Partner und Kunden, die Merican Limited bei Großküchengeräten und hochwertiger Edelstahlverarbeitung vertrauen." 
    },
    it: { 
      title: "I Nostri Partner e Clienti | Progetti per Cucine Professionali", 
      desc: "Scopri i partner e i clienti che si affidano a Merican Limited per attrezzature per cucine professionali e lavorazioni in acciaio inossidabile." 
    }
  };

  const currentSeo = seo[lang] || seo.en;

  return {
    title: currentSeo.title,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/partners-clients`,
      type: 'website',
    }
  };
}

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
  params: Promise<{ lang?: string }>; 
}

export default async function PartnersPage({ params }: PageProps) {
  const lang = (await params).lang || 'en';
  const title = translations[lang] || translations.en;

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
      
      <Clients initialClients={clients || []} />        
      <Partners />
    </div>
  );
}