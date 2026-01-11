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

  const productsPerPage = 15;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const offset = (currentPage - 1) * productsPerPage;

  const decodedTerm = decodeURIComponent(term).replace(/-/g, ' ');

  const searchFields = [
    'name', 'name_sw', 'name_fr', 'name_es', 'name_de', 'name_it',
    'short_description', 'short_description_sw', 'short_description_fr', 
    'short_description_es', 'short_description_de', 'short_description_it'
  ];
  
  const orQuery = searchFields
    .map(field => `${field}.ilike.%${decodedTerm}%`)
    .join(',');

  const { data: products, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .or(orQuery)
    .order("id", { ascending: true })
    .range(offset, offset + productsPerPage - 1);

  const totalPages = count ? Math.ceil(count / productsPerPage) : 0;

  // 🌍 COMPLETED DICTIONARY FOR ALL LANGUAGES
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
      fr: "Aucun produit trouvé.",
      es: "No se encontraron productos.",
      de: "Keine Produkte gefunden.",
      it: "Nessun prodotto trovato."
    }[lang] || "No products found.",
    prev: { 
      en: 'Prev', sw: 'Iliyopita', fr: 'Précédent', es: 'Anterior', de: 'Zurück', it: 'Prec' 
    }[lang] || 'Prev',
    next: { 
      en: 'Next', sw: 'Inayofuata', fr: 'Suivant', es: 'Siguiente', de: 'Weiter', it: 'Succ' 
    }[lang] || 'Next',
    backBtn: {
      en: 'Back to Products',
      sw: 'Rudi Kwenye Bidhaa',
      fr: 'Retour aux produits',
      es: 'Volver a productos',
      de: 'Zurück zu Produkten',
      it: 'Torna ai prodotti'
    }[lang] || 'Back to Products'
  };

  return (
    <div>
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
                <Link 
                  href={`/${lang}/products`} 
                  className="rfq-shop-btn" 
                  style={{ 
                    marginTop: '20px', 
                    display: 'inline-block', 
                    color: '#ffffff' // This ensures the text is visible on the button color
                  }}
                >
                  {t.backBtn}
                </Link>
              </div>
            )}
          </div>

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