import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ClientDetail({ slug }: { slug: string }) {
  // Fetch data
  const { data: client, error } = await supabase
    .from('clients')
    .select('name, logo, gallery')
    .eq('slug', slug)
    .single();

  if (error || !client) {
    return <p className="text-center mt-20">Client not found.</p>;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageBasePath = `${supabaseUrl}/storage/v1/object/public/images/clients/`;
  
  // Ensure galleryImages is typed as a string array
  const galleryImages: string[] = client.gallery ? client.gallery.split(',') : [];

  return (
    <>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{client.name}</h1>
        </div>
      </section>

      <section className="client-detail-section">
        <div className="client-detail-container">
          <div className="client-header">
            <img 
              src={client.logo ? `${imageBasePath}${client.logo}` : '/images/placeholder-client.png'} 
              alt={client.name} 
              className="client-detail-logo" 
            />
            <h1 className="client-detail-name">{client.name}</h1>
          </div>

          <div className="client-gallery-container">
            {galleryImages.length > 0 ? (
              <div className="client-gallery">
                {/* Fixed the 'any' error by adding types to img and index */}
                {galleryImages.map((img: string, index: number) => (
                  <img 
                    key={index}
                    src={`${imageBasePath}${img.trim()}`} 
                    alt={`Gallery image ${index + 1}`} 
                    className="gallery-img"
                  />
                ))}
              </div>
            ) : (
              <p className="no-gallery">No gallery images available for this client.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}