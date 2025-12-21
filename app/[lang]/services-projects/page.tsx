import { createClient } from '@supabase/supabase-js';
import ServicesIcons from "@/components/ServicesIcons";
import ProjectsAndServices from "@/components/ProjectsAndServices";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ServicesProjectsPage() {
  // Fetch both projects and services in parallel from the new Postgres table
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
          <h1 className="merican-banner-title">Merican Services</h1>
        </div>
      </section>
        <ServicesIcons />
        <ProjectsAndServices
          projects={projectsRes.data || []} 
          services={servicesRes.data || []} 
        />
    </div>
  );
}