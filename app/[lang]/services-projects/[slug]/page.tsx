import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; lang: string }> 
}): Promise<Metadata> {
  const { slug, lang } = await params;

  const { data: item } = await supabase
    .from('projects_services')
    .select('title, item_type')
    .eq('slug', slug)
    .single();

  if (!item) return { title: "Merican Limited" };

  const isProject = item.item_type === 'project';
  
  // Localized Titles & Descriptions
  const seoData: Record<string, { title: string; desc: string }> = {
    en: {
      title: `${item.title} | ${isProject ? 'Project' : 'Service'}`,
      desc: `Detailed overview of ${item.title}. Explore how Merican Limited delivers professional commercial kitchen ${isProject ? 'solutions' : 'services'} in East Africa.`
    },
    sw: {
      title: `${item.title} | ${isProject ? 'Mradi' : 'Huduma'}`,
      desc: `Maelezo ya kina kuhusu ${item.title}. Angalia jinsi Merican Limited inavyotoa ${isProject ? 'suluhisho' : 'huduma'} za jikoni Mashariki mwa Afrika.`
    },
    fr: {
      title: `${item.title} | ${isProject ? 'Projet' : 'Service'}`,
      desc: `Aperçu détaillé de ${item.title}. Découvrez comment Merican Limited fournit des ${isProject ? 'solutions' : 'services'} de cuisine professionnelle.`
    },
    es: {
      title: `${item.title} | ${isProject ? 'Proyecto' : 'Servicio'}`,
      desc: `Descripción detallada de ${item.title}. Explore cómo Merican Limited ofrece ${isProject ? 'soluciones' : 'servicios'} de cocina industrial.`
    },
    de: {
      title: `${item.title} | ${isProject ? 'Projekt' : 'Dienstleistung'}`,
      desc: `Detaillierte Übersicht von ${item.title}. Erfahren Sie, wie Merican Limited professionelle Großküchen-${isProject ? 'Lösungen' : 'Dienstleistungen'} anbietet.`
    },
    it: {
      title: `${item.title} | ${isProject ? 'Progetto' : 'Servizio'}`,
      desc: `Panoramica dettagliata di ${item.title}. Scopri come Merican Limited offre ${isProject ? 'soluzioni' : 'servizi'} per cucine professionali.`
    }
  };

  const currentSeo = seoData[lang] || seoData.en;

  return {
    title: `${currentSeo.title} | Merican Limited`,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/services-projects/${slug}`,
      type: 'article',
    }
  };
}

// 📦 2. PAGE COMPONENT
export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string; lang: string }> 
}) {
  const { slug, lang } = await params;

  // Fetch the main project/service details
  const { data: item, error } = await supabase
    .from('projects_services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!item || error) {
    notFound();
  }

  // Fetch related items for the sidebar
  const { data: otherItems } = await supabase
    .from('projects_services')
    .select('slug, title, cover_image')
    .eq('item_type', item.item_type)
    .not('slug', 'eq', slug)
    .order('created_at', { ascending: false })
    .limit(10);

  const imageBasePath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/projects-services/`;

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match: RegExpMatchArray | null = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url;
  };

  let processedContent = item.content || "";
  processedContent = processedContent.replace(
    /(<img[^>]+>[\s\r\n]*){2,}/gi,
    (match: string) => `<div class="image-gallery">${match}</div>`
  );

  return (
    <div className="merican-detail-wrapper">
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">
            {lang === 'sw' ? (item.item_type === 'project' ? 'Miradi Yetu' : 'Huduma Zetu') : 
             item.item_type === 'project' ? 'Our Projects' : 'Our Services'}
          </h1>
        </div>
      </section>

      <section className="project-page-section">
        <div className="project-page-container">
          
          <div className="project-main">
            <h1 className="project-title">{item.title}</h1>

            {item.cover_image && (
              <img
                src={`${imageBasePath}${item.cover_image}`}
                alt={item.title}
                className="project-cover-img"
              />
            )}

            {item.video_url && (
              <div className="project-video-container">
                <iframe
                  src={getEmbedUrl(item.video_url)!}
                  allowFullScreen
                  className="project-video-frame"
                  title="Project Video"
                ></iframe>
              </div>
            )}

            <div 
              className="rendered-html-content" 
              dangerouslySetInnerHTML={{ __html: processedContent }} 
            />
          </div>

          <aside className="project-sidebar">
            <h2 className="sidebar-title">
              {lang === 'sw' ? (item.item_type === 'project' ? 'Miradi Mingine' : 'Huduma Zingine') :
               item.item_type === 'project' ? 'Other Projects' : 'Other Services'}
            </h2>
            <ul className="sidebar-list">
              {otherItems?.map((row) => (
                <li key={row.slug} className="sidebar-item">
                  <Link href={`/${lang}/services-projects/${row.slug}`} className="sidebar-link">
                    {row.cover_image ? (
                      <img
                        src={`${imageBasePath}${row.cover_image}`}
                        alt={row.title}
                        className="sidebar-thumb"
                      />
                    ) : (
                      <div className="sidebar-thumb-placeholder" />
                    )}
                    <span className="sidebar-item-title">{row.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

        </div>
      </section>
    </div>
  );
}