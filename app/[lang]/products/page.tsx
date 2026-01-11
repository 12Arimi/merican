import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Metadata } from 'next';

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string }>; 
  searchParams: Promise<{ q?: string; cat?: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const { q, cat } = await searchParams;

  // Base Titles & Descriptions for the main page
  const seo: Record<string, { title: string; desc: string }> = {
    en: { 
      title: "Commercial Kitchen Equipment & Stainless Steel Supplies", 
      desc: "Browse our extensive catalog of high-quality commercial kitchen equipment and custom stainless steel solutions for the hospitality industry." 
    },
    sw: { 
      title: "Vifaa vya Jikoni vya Kibiashara na Bidhaa za Chuma", 
      desc: "Vinjari orodha yetu pana ya vifaa vya jikoni vya kibiashara na bidhaa za chuma za hali ya juu kwa ajili ya mahoteli na migahawa." 
    },
    fr: { 
      title: "Équipement de Cuisine Commerciale et Fournitures en Inox", 
      desc: "Parcourez notre catalogue complet d'équipements de cuisine professionnelle et de solutions en acier inoxydable pour l'hôtellerie." 
    },
    es: { 
      title: "Equipos de Cocina Comercial y Suministros de Acero Inoxidable", 
      desc: "Explore nuestro catálogo de equipos de cocina industrial y soluciones personalizadas de acero inoxidable para hostelería." 
    },
    de: { 
      title: "Gewerbeküchengeräte & Edelstahl-Zubehör", 
      desc: "Durchsuchen Sie unseren Katalog für hochwertige Großküchengeräte und individuelle Edelstahllösungen für das Gastgewerbe." 
    },
    it: { 
      title: "Attrezzature per Cucine Professionali e Prodotti in Acciaio Inox", 
      desc: "Sfoglia il nostro catalogo di attrezzature professionali per cucine e soluzioni personalizzate in acciaio inossidabile." 
    }
  };

  const currentSeo = seo[lang] || seo.en;
  let finalTitle = currentSeo.title;

  // If searching, show the search term in the title
  if (q) {
    finalTitle = `${q} | ${currentSeo.title}`;
  } 
  // If viewing a category, we could fetch the category name here, 
  // but for the main products landing, the base "Rich" title is often strongest for SEO.

  return {
    title: finalTitle,
    description: currentSeo.desc,
    openGraph: {
      title: finalTitle,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/products`,
      type: 'website',
    }
  };
}

// 📦 2. PRODUCTS PAGE COMPONENT
export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const { lang } = await params;
  const { q: searchTerm, cat: categorySlug, page } = await searchParams;

  const productsPerPage = 15;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const offset = (currentPage - 1) * productsPerPage;

  let categoryData = null;
  let title = lang === 'sw' ? 'Bidhaa' : 'Products'; 

  // 1. Handle Category Filter Logic
  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id, name, name_sw, name_fr, name_es, name_de, name_it")
      .eq("slug", categorySlug)
      .single();
    
    if (cat) {
      categoryData = cat;
      const langKey = lang === 'en' ? 'name' : `name_${lang}`;
      title = cat[langKey as keyof typeof cat] || cat.name;
    }
  }

  // 2. Build Product Query
  let query = supabase
    .from("products")
    .select("*", { count: "exact" });

  if (categoryData) {
    query = query.eq("category_id", categoryData.id);
  }

  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
    title = `"${searchTerm}"`;
  }

  const { data: products, count } = await query
    .order("id", { ascending: true })
    .range(offset, offset + productsPerPage - 1);

  const totalPages = count ? Math.ceil(count / productsPerPage) : 0;

  // Translation Helper for Static UI Elements
  const t = {
    noResults: {
      en: "No products found.",
      sw: "Hakuna bidhaa zilizopatikana.",
      fr: "Aucun produit trouvé.",
      es: "No se encontraron productos.",
      de: "Keine Produkte gefunden.",
      it: "Nessun prodotto trovato.",
    }[lang] || "No products found.",
    prev: { en: 'Prev', sw: 'Iliyopita', fr: 'Précédent', es: 'Anterior', de: 'Zurück', it: 'Prec' }[lang] || 'Prev',
    next: { en: 'Next', sw: 'Inayofuata', fr: 'Suivant', es: 'Siguiente', de: 'Weiter', it: 'Succ' }[lang] || 'Next',
  };

  return (
    <div>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{title}</h1>
        </div>
      </section>

      <section className="merican-page-section">
        <div className="container">
          <div className="product-grid">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))
            ) : (
              <div className="no-results">
                <p>{t.noResults}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {currentPage > 1 ? (
                <Link 
                  href={`/${lang}/products?page=${currentPage - 1}${searchTerm ? `&q=${searchTerm}` : ''}${categorySlug ? `&cat=${categorySlug}` : ''}`} 
                  className="pagination-link"
                >
                  &laquo; {t.prev}
                </Link>
              ) : (
                <span className="pagination-link disabled">&laquo; {t.prev}</span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/${lang}/products?page=${p}${searchTerm ? `&q=${searchTerm}` : ''}${categorySlug ? `&cat=${categorySlug}` : ''}`}
                  className={`pagination-link ${p === currentPage ? "active" : ""}`}
                >
                  {p}
                </Link>
              ))}

              {currentPage < totalPages ? (
                <Link 
                  href={`/${lang}/products?page=${currentPage + 1}${searchTerm ? `&q=${searchTerm}` : ''}${categorySlug ? `&cat=${categorySlug}` : ''}`} 
                  className="pagination-link"
                >
                  {t.next} &raquo;
                </Link>
              ) : (
                <span className="pagination-link disabled">{t.next} &raquo;</span>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}