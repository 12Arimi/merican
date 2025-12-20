import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
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

  /**
   * Converts a standard YouTube URL into an embeddable format.
   * Fixed the 'implicit any' error by typing the match variable.
   */
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match: RegExpMatchArray | null = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url;
  };

  // --- IMPROVED CONTENT PROCESSING ---
  let processedContent = item.content || "";
  
  /**
   * Regex Fix: We explicitly type 'match' as a string to satisfy TypeScript.
   * This wraps 2 or more consecutive <img> tags into a gallery div for grid styling.
   */
  processedContent = processedContent.replace(
    /(<img[^>]+>[\s\r\n]*){2,}/gi,
    (match: string) => `<div class="image-gallery">${match}</div>`
  );

  return (
    <div className="merican-detail-wrapper">
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

            {/* Main Cover Image */}
            {item.cover_image && (
              <img
                src={`${imageBasePath}${item.cover_image}`}
                alt={item.title}
                className="project-cover-img"
              />
            )}

            {/* Video Player */}
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

            {/* 🛠️ RENDERED HTML CONTENT 
                Now contains the processed <div class="image-gallery"> wrappers.
            */}
            <div 
              className="rendered-html-content" 
              dangerouslySetInnerHTML={{ __html: processedContent }} 
            />
          </div>

          {/* Sidebar Section */}
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