import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Header from "@/components/Header";
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const { data: item, error } = await supabase
    .from('projects_services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!item || error) {
    notFound();
  }

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
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url;
  };

  // --- IMPROVED CONTENT PROCESSING ---
  let processedContent = item.content || "";
  
  // This regex is now more robust against spaces, newlines, or tabs between images
  // It groups 2 or more <img> tags into a gallery div
  processedContent = processedContent.replace(
    /(<img[^>]+>[\s\r\n]*){2,}/gi,
    (match) => `<div class="image-gallery">${match}</div>`
  );

  return (
    <div className="merican-detail-wrapper">
      <Header />
      
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">
            {item.item_type === 'project' ? 'Our Projects' : 'Our Services'}
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

            {/* 🛠️ RENDERED HTML CONTENT */}
            <div 
              className="rendered-html-content" 
              dangerouslySetInnerHTML={{ __html: processedContent }} 
            />
          </div>

          <aside className="project-sidebar">
            <h2 className="sidebar-title">
              {item.item_type === 'project' ? 'Other Projects' : 'Other Services'}
            </h2>
            <ul className="sidebar-list">
              {otherItems?.map((row) => (
                <li key={row.slug} className="sidebar-item">
                  <Link href={`/services-projects/${row.slug}`} className="sidebar-link">
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