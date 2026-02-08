// app/[lang]/products/page.tsx
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Metadata } from 'next';
export const revalidate = 86400; // Cache for 24 hours (in seconds)

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string }>; 
  searchParams: Promise<{ q?: string; cat?: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const { q } = await searchParams;

  const seo: Record<string, { title: string; desc: string }> = {
    en: { 
      title: "Commercial Kitchen Equipment & Stainless Steel Supplies", 
      desc: "Browse our extensive catalog of high-quality commercial kitchen equipment." 
    },
    sw: { 
      title: "Vifaa vya Jikoni vya Kibiashara na Bidhaa za Chuma", 
      desc: "Vinjari orodha yetu pana ya vifaa vya jikoni vya kibiashara." 
    },
    fr: { 
      title: "Équipement de Cuisine Commerciale et Fournitures en Inox", 
      desc: "Parcourez notre catalogue complet d'équipements de cuisine professionnelle." 
    },
    es: { 
      title: "Equipos de Cocina Comercial y Suministros de Acero Inoxidable", 
      desc: "Explore nuestro catálogo de equipos de cocina industrial." 
    },
    de: { 
      title: "Gewerbeküchengeräte & Edelstahl-Zubehör", 
      desc: "Durchsuchen Sie unseren Katalog für hochwertige Großküchengeräte." 
    },
    it: { 
      title: "Attrezzature per Cucine Professionali e Prodotti in Acciaio Inox", 
      desc: "Sfoglia il nostro catalogo di attrezzature professionali per cucine." 
    }
  };

  const currentSeo = seo[lang] || seo.en;
  let finalTitle = currentSeo.title;

  if (q) {
    finalTitle = `${q} | ${currentSeo.title}`;
  } 

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

  const pool = db();
  let categoryData: any = null;
  let title = lang === 'sw' ? 'Bidhaa' : 'Products'; 

  // 1. Handle Category Filter Logic
  if (categorySlug) {
    const [cats]: any = await pool.query(
      "SELECT id, name, name_sw, name_fr, name_es, name_de, name_it FROM categories WHERE slug = ? LIMIT 1",
      [categorySlug]
    );
    
    if (cats && cats.length > 0) {
      categoryData = cats[0];
      const langKey = lang === 'en' ? 'name' : `name_${lang}`;
      title = categoryData[langKey] || categoryData.name;
    }
  }

  // 2. Build Product Query & Count Query
  let productQuery = "SELECT * FROM products WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
  let queryParams: any[] = [];

  if (categoryData) {
    productQuery += " AND category_id = ?";
    countQuery += " AND category_id = ?";
    queryParams.push(categoryData.id);
  }

  if (searchTerm) {
    productQuery += " AND name LIKE ?";
    countQuery += " AND name LIKE ?";
    queryParams.push(`%${searchTerm}%`);
    title = `"${searchTerm}"`;
  }

  productQuery += " ORDER BY id ASC LIMIT ? OFFSET ?";
  
  // 3. Execute Queries
  const [products]: any = await pool.query(productQuery, [...queryParams, productsPerPage, offset]);
  const [countResult]: any = await pool.query(countQuery, queryParams.slice(0, queryParams.length)); // use only filter params for count
  
  const count = countResult[0].total;
  const totalPages = Math.ceil(count / productsPerPage);

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
              products.map((product: any) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))
            ) : (
              <div className="no-results">
                <p>{t.noResults}</p>
              </div>
            )}
          </div>

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