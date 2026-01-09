import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function SearchResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; term: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang, term } = await params;
  const { page } = await searchParams;

  // 1. Pagination Config (Identical to Products page)
  const productsPerPage = 15;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const offset = (currentPage - 1) * productsPerPage;

  // 2. Decode and Format Search Term
  const decodedTerm = decodeURIComponent(term).replace(/-/g, ' ');

  // 3. Build Multi-Language Search Query
  const searchFields = [
    'name', 'name_sw', 'name_fr', 'name_es', 'name_de', 'name_it',
    'short_description', 'short_description_sw', 'short_description_fr', 
    'short_description_es', 'short_description_de', 'short_description_it'
  ];
  
  const orQuery = searchFields
    .map(field => `${field}.ilike.%${decodedTerm}%`)
    .join(',');

  // Fetch with Pagination and Count
  const { data: products, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .or(orQuery)
    .order("id", { ascending: true })
    .range(offset, offset + productsPerPage - 1);

  const totalPages = count ? Math.ceil(count / productsPerPage) : 0;

  // 4. Translation Helper
  const t = {
    title: { 
      en: 'Results for', 
      sw: 'Matokeo ya',
      fr: 'Résultats pour',
      es: 'Resultados para',
      de: 'Ergebnisse für',
      it: 'Risultati per'
    }[lang] || 'Results for',
    noResults: { 
      en: "No products found.", 
      sw: "Hakuna bidhaa zilizopatikana.",
      fr: "Aucun produit trouvé." 
    }[lang] || "No products found.",
    prev: { en: 'Prev', sw: 'Iliyopita', fr: 'Précédent' }[lang] || 'Prev',
    next: { en: 'Next', sw: 'Inayofuata', fr: 'Suivant' }[lang] || 'Next',
  };

  return (
    <div>
      {/* IDENTICAL BANNER STRUCTURE */}
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">
            {t.title} "{decodedTerm}"
          </h1>
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
                <Link href={`/${lang}/products`} className="rfq-shop-btn" style={{ marginTop: '20px', display: 'inline-block' }}>
                   {lang === 'sw' ? 'Rudi Kwenye Bidhaa' : 'Back to Products'}
                </Link>
              </div>
            )}
          </div>

          {/* IDENTICAL PAGINATION LOGIC */}
          {totalPages > 1 && (
            <div className="pagination">
              {currentPage > 1 ? (
                <Link 
                  href={`/${lang}/search/${term}?page=${currentPage - 1}`} 
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
                  href={`/${lang}/search/${term}?page=${p}`}
                  className={`pagination-link ${p === currentPage ? "active" : ""}`}
                >
                  {p}
                </Link>
              ))}

              {currentPage < totalPages ? (
                <Link 
                  href={`/${lang}/search/${term}?page=${currentPage + 1}`} 
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