import { supabase } from "@/lib/supabase";
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

  // Fetch category name for the title
  const { data: cat } = await supabase
    .from("categories")
    .select("name, name_sw, name_fr, name_es, name_de, name_it")
    .eq("slug", slug)
    .single();

  if (!cat) {
    return { title: "Products | Merican Limited" };
  }

  // Determine localized title
  const langKey = lang === 'en' ? 'name' : `name_${lang}`;
  const categoryName = cat[langKey as keyof typeof cat] || cat.name;

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

  // 1. Fetch Category
  let categoryData = null;
  let title = lang === 'sw' ? 'Bidhaa' : 'Products'; 

  const { data: cat } = await supabase
    .from("categories")
    .select("id, name, name_sw, name_fr, name_es, name_de, name_it")
    .eq("slug", slug)
    .single();

  if (cat) {
    categoryData = cat;
    const langKey = lang === 'en' ? 'name' : `name_${lang}`;
    title = cat[langKey as keyof typeof cat] || cat.name;
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

  // Translation Helper
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
}