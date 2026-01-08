import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  let title = "Products";

  // 1. Handle Category Filter Logic
  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id, name, name_sw, name_fr, name_es, name_de, name_it")
      .eq("slug", categorySlug)
      .single();
    
    if (cat) {
      categoryData = cat;
      // Get translated title
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
    // Basic Supabase search (ilike is standard, for full-text search use .textSearch)
    query = query.ilike("name", `%${searchTerm}%`);
    title = searchTerm;
  }

  const { data: products, count, error } = await query
    .order("id", { ascending: true })
    .range(offset, offset + productsPerPage - 1);

  const totalPages = count ? Math.ceil(count / productsPerPage) : 0;

  // Translation Helper for Static Text
  const t = {
    noResults: {
      en: "No products found.",
      sw: "Hakuna bidhaa zilizopatikana.",
      fr: "Aucun produit trouvé.",
      es: "No se encontraron productos.",
      de: "Keine Produkte gefunden.",
      it: "Nessun prodotto trovato.",
    }[lang] || "No products found.",
    prev: lang === 'sw' ? 'Iliyopita' : 'Prev',
    next: lang === 'sw' ? 'Inayofuata' : 'Next',
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