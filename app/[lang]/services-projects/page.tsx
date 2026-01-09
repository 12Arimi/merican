import { createClient } from '@supabase/supabase-js';
import ServicesIcons from "@/components/ServicesIcons";
import ProjectsAndServices from "@/components/ProjectsAndServices";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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