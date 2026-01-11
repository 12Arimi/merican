import { createClient } from '@supabase/supabase-js';
import ServicesIcons from "@/components/ServicesIcons";
import ProjectsAndServices from "@/components/ProjectsAndServices";
import { Metadata } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (await params).lang || 'en';

  const seo: Record<string, { title: string; desc: string }> = {
    en: { 
      title: "Commercial Kitchen Services & Projects | Merican Limited", 
      desc: "Explore our professional kitchen design, installation, and maintenance services. View our portfolio of successful commercial projects across East Africa." 
    },
    sw: { 
      title: "Huduma na Miradi ya Jikoni | Merican Limited", 
      desc: "Gundua huduma zetu za usanifu, usakinishaji, na matengenezo ya majiko. Tazama mkusanyiko wa miradi yetu iliyofanikiwa kote Mashariki mwa Afrika." 
    },
    fr: { 
      title: "Services et Projets de Cuisine | Merican Limited", 
      desc: "Découvrez nos services de conception, d'installation et de maintenance de cuisines. Voir notre portefeuille de projets commerciaux réussis en Afrique de l'Est." 
    },
    es: { 
      title: "Servicios y Proyectos de Cocina | Merican Limited", 
      desc: "Explore nuestros servicios de diseño, instalación y mantenimiento de cocinas profesionales. Vea nuestro portafolio de proyectos comerciales exitosos." 
    },
    de: { 
      title: "Großküchen-Dienstleistungen & Projekte | Merican Limited", 
      desc: "Entdecken Sie unsere Planung, Installation und Wartung für Großküchen. Sehen Sie sich unser Portfolio erfolgreicher Projekte in Ostafrika an." 
    },
    it: { 
      title: "Servizi e Progetti per Cucine Professionali | Merican Limited", 
      desc: "Scopri i nostri servizi di progettazione, installazione e manutenzione cucine. Visualizza il nostro portfolio di progetti commerciali di successo." 
    }
  };

  const currentSeo = seo[lang] || seo.en;

  return {
    title: currentSeo.title,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/services-projects`,
      type: 'website',
    }
  };
}

// Translation dictionary for the Server Component banner
const translations: Record<string, string> = {
  en: "Merican Services",
  sw: "Huduma za Merican",
  fr: "Services de Merican",
  es: "Servicios de Merican",
  de: "Merican Dienstleistungen",
  it: "Servizi Merican"
};

interface PageProps {
  params: Promise<{ lang?: string }>;
}

export default async function ServicesProjectsPage({ params }: PageProps) {
  // Determine locale
  const lang = (await params).lang || 'en';
  const title = translations[lang] || translations.en;

  // Fetch both projects and services in parallel
  const [projectsRes, servicesRes] = await Promise.all([
    supabase
      .from('projects_services')
      .select('slug, title, cover_image')
      .eq('item_type', 'project')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('projects_services')
      .select('slug, title, cover_image')
      .eq('item_type', 'service')
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  return (
    <div>
      {/* 🏙️ PAGE BANNER */}
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{title}</h1>
        </div>
      </section>

      {/* These components handle their own internal translations via JSON/useTranslation */}
      <ServicesIcons />
      <ProjectsAndServices
        projects={projectsRes.data || []} 
        services={servicesRes.data || []} 
      />
    </div>
  );
}