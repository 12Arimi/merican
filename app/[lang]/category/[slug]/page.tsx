import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Metadata } from "next";

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const pool = db();

  try {
    const [rows]: any = await pool.query(
      "SELECT name, name_sw, name_fr, name_es, name_de, name_it FROM categories WHERE slug = ? LIMIT 1",
      [slug]
    );

    const cat = rows[0];
    if (!cat) return { title: "Products | Merican Limited" };

    const langKey = lang === 'en' ? 'name' : `name_${lang}`;
    const categoryName = cat[langKey] || cat.name;

    const descriptions: Record<string, string> = {
      en: `Explore high-quality ${categoryName} for commercial kitchens. Expertly crafted stainless steel solutions by Merican Limited.`,
      sw: `Gundua ${categoryName} za hali ya juu kwa ajili ya majiko ya kibiashara. Masuluhisho ya chuma yaliyotengenezwa na Merican Limited.`,
      fr: `Découvrez des ${categoryName} de haute qualité pour les cuisines commerciales. Solutions en acier inoxydable par Merican Limited.`,
      es: `Explore ${categoryName} de alta calidad para cocinas comerciales. Soluciones de acero inoxidable de Merican Limited.`,
      de: `Entdecken Sie hochwertige ${categoryName} für Großküchen. Edelstahl-Lösungen von Merican Limited.`,
      it: `Scopri ${categoryName} di alta qualità per cucine professionali. Soluzioni in acciaio inossidabile di Merican Limited.`,
    };

    const description = descriptions[lang] || descriptions.en;

    return {
      title: `${categoryName} | Commercial Kitchen Equipment`,
      description: description,
      openGraph: {
        title: `${categoryName} | Merican Limited`,
        description: description,
        url: `https://mericanltd.com/${lang}/category/${slug}`,
        type: 'website',
      }
    };
  } catch (e) {
    return { title: "Products | Merican Limited" };
  }
}

// 📦 2. CATEGORY PAGE COMPONENT
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { lang, slug } = await params;
  const { q: searchTerm, page } = await searchParams;

  const productsPerPage = 15;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const offset = (currentPage - 1) * productsPerPage;

  const pool = db();
  let categoryData: any = null;
  let title = lang === 'sw' ? 'Bidhaa' : 'Products'; 

  try {
    // 1. Fetch Category Data
    const [cats]: any = await pool.query(
      "SELECT id, name, name_sw, name_fr, name_es, name_de, name_it FROM categories WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (cats && cats.length > 0) {
      categoryData = cats[0];
      const langKey = lang === 'en' ? 'name' : `name_${lang}`;
      title = categoryData[langKey] || categoryData.name;
    }

    // 2. Build Queries
    let productQuery = "SELECT * FROM products WHERE category_id = ?";
    let countQuery = "SELECT COUNT(*) as total FROM products WHERE category_id = ?";
    let queryParams: any[] = [categoryData?.id || 0];

    if (searchTerm) {
      productQuery += " AND name LIKE ?";
      countQuery += " AND name LIKE ?";
      queryParams.push(`%${searchTerm}%`);
      title = `"${searchTerm}"`;
    }

    productQuery += " ORDER BY id ASC LIMIT ? OFFSET ?";
    
    // 3. Execute
    const [products]: any = await pool.query(productQuery, [...queryParams, productsPerPage, offset]);
    const [countResult]: any = await pool.query(countQuery, queryParams.slice(0, queryParams.length));
    
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
                    href={`/${lang}/category/${slug}?page=${currentPage - 1}${searchTerm ? `&q=${searchTerm}` : ''}`} 
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
                    href={`/${lang}/category/${slug}?page=${p}${searchTerm ? `&q=${searchTerm}` : ''}`}
                    className={`pagination-link ${p === currentPage ? "active" : ""}`}
                  >
                    {p}
                  </Link>
                ))}

                {currentPage < totalPages ? (
                  <Link 
                    href={`/${lang}/category/${slug}?page=${currentPage + 1}${searchTerm ? `&q=${searchTerm}` : ''}`} 
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
  } catch (error) {
    console.error("Category Page Error:", error);
    throw new Error("Failed to load category products. Please try again.");
  }
}