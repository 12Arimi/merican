import { createClient } from '@supabase/supabase-js';
import ServicesIcons from '@/components/ServicesIcons';
import FeaturedProducts from '@/components/FeaturedProducts';
import About from '@/components/About';
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
      title: "Experts in Commercial Kitchen Solutions & Stainless Steel Fabrication", 
      desc: "Learn how Merican Limited designs and manufactures world-class commercial kitchens. Leading experts in stainless steel fabrication for East Africa's hospitality industry." 
    },
    sw: { 
      title: "Wataalamu wa Majiko ya Hoteli na Utengenezaji wa Chuma (Stainless Steel)", 
      desc: "Fahamu jinsi Merican Limited inavyotengeneza majiko ya kisasa ya kibiashara na vifaa vya chuma imara kwa ajili ya mahoteli na migahawa Mashariki mwa Afrika." 
    },
    fr: { 
      title: "Experts en Solutions de Cuisine Commerciale et Fabrication d'Inox", 
      desc: "Découvrez comment Merican Limited conçoit des cuisines professionnelles et fabrique des équipements en acier inoxydable de qualité supérieure en Afrique de l'Est." 
    },
    es: { 
      title: "Expertos en Soluciones de Cocina Comercial y Fabricación de Acero Inoxidable", 
      desc: "Conozca cómo Merican Limited diseña cocinas industriales y fabrica equipos de acero inoxidable de alta calidad en África Oriental." 
    },
    de: { 
      title: "Experten für Großküchenlösungen & Edelstahlverarbeitung", 
      desc: "Erfahren Sie, wie Merican Limited erstklassige Großküchen plant und hochwertige Edelstahlgeräte für die Hotellerie in Ostafrika fertigt." 
    },
    it: { 
      title: "Esperti in Soluzioni per Cucine Professionali e Lavorazione Acciaio Inox", 
      desc: "Scopri come Merican Limited progetta cucine industriali e realizza attrezzature in acciaio inossidabile di alta qualità per il settore horeca in Africa Orientale." 
    }
  };

  const currentSeo = seo[lang] || seo.en;

  return {
    title: currentSeo.title,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/about`,
      siteName: 'Merican Limited',
      type: 'website',
    },
    // This helps Google understand this is a professional business
    keywords: ["commercial kitchen equipment", "stainless steel fabrication Kenya", "hotel kitchen design", "industrial kitchen supplies East Africa"]
  };
}

// Translation dictionary for the Banner UI
const translations: Record<string, string> = {
  en: "About",
  sw: "Kuhusu",
  fr: "À propos",
  es: "Acerca de",
  de: "Über uns",
  it: "Chi siamo"
};

interface PageProps {
  params: Promise<{ lang?: string }>;
}

export default async function AboutPage({ params }: PageProps) {
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
      
      <ServicesIcons />
      <FeaturedProducts />
      <About />
    </div>
  );
}