import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";

export const revalidate = 86400; // 24 hours

// -----------------------------
// CACHED DB HELPERS
// -----------------------------

const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    const pool = db();
    const [cats]: any = await pool.query(
      "SELECT id, name, name_sw, name_fr, name_es, name_de, name_it FROM categories WHERE slug = ? LIMIT 1",
      [slug]
    );
    return cats?.[0] || null;
  },
  ["category-by-slug"],
  { revalidate: 86400, tags: ["products"] }
);

const getProductsCached = unstable_cache(
  async (
    categoryId: number | null,
    searchTerm: string | null,
    limit: number,
    offset: number
  ) => {
    const pool = db();

    let productQuery = "SELECT * FROM products WHERE 1=1";
    let queryParams: any[] = [];

    if (categoryId) {
      productQuery += " AND category_id = ?";
      queryParams.push(categoryId);
    }

    if (searchTerm) {
      productQuery += " AND name LIKE ?";
      queryParams.push(`%${searchTerm}%`);
    }

    productQuery += " ORDER BY id ASC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    const [rows]: any = await pool.query(productQuery, queryParams);
    return rows;
  },
  ["products-list"],
  { revalidate: 86400, tags: ["products"] }
);

const getProductsCountCached = unstable_cache(
  async (categoryId: number | null, searchTerm: string | null) => {
    const pool = db();

    let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
    let queryParams: any[] = [];

    if (categoryId) {
      countQuery += " AND category_id = ?";
      queryParams.push(categoryId);
    }

    if (searchTerm) {
      countQuery += " AND name LIKE ?";
      queryParams.push(`%${searchTerm}%`);
    }

    const [rows]: any = await pool.query(countQuery, queryParams);
    return rows[0]?.total || 0;
  },
  ["products-count"],
  { revalidate: 86400, tags: ["products"] }
);

// -----------------------------
// SEO METADATA
// -----------------------------

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; cat?: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { q } = await searchParams;

  const seo: Record<string, { title: string; desc: string }> = {
    en: {
      title: "Commercial Kitchen Equipment & Stainless Steel Supplies",
      desc: "Browse our extensive catalog of high-quality commercial kitchen equipment.",
    },
    sw: {
      title: "Vifaa vya Jikoni vya Kibiashara na Bidhaa za Chuma",
      desc: "Vinjari orodha yetu pana ya vifaa vya jikoni vya kibiashara.",
    },
    fr: {
      title: "Équipement de Cuisine Commerciale et Fournitures en Inox",
      desc: "Parcourez notre catalogue complet d'équipements de cuisine professionnelle.",
    },
    es: {
      title: "Equipos de Cocina Comercial y Suministros de Acero Inoxidable",
      desc: "Explore nuestro catálogo de equipos de cocina industrial.",
    },
    de: {
      title: "Gewerbeküchengeräte & Edelstahl-Zubehör",
      desc: "Durchsuchen Sie unseren Katalog für hochwertige Großküchengeräte.",
    },
    it: {
      title: "Attrezzature per Cucine Professionali e Prodotti in Acciaio Inox",
      desc: "Sfoglia il nostro catalogo di attrezzature professionali per cucine.",
    },
  };

  const currentSeo = seo[lang] || seo.en;
  let finalTitle = currentSeo.title;

  if (q) finalTitle = `${q} | ${currentSeo.title}`;

  return {
    title: finalTitle,
    description: currentSeo.desc,
    openGraph: {
      title: finalTitle,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/products`,
      type: "website",
    },
  };
}

// -----------------------------
// PAGE
// -----------------------------

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

  let categoryData: any = null;
  let title = lang === "sw" ? "Bidhaa" : "Products";

  // Category lookup (cached)
  if (categorySlug) {
    categoryData = await getCategoryBySlug(categorySlug);

    if (categoryData) {
      const langKey = lang === "en" ? "name" : `name_${lang}`;
      title = categoryData[langKey] || categoryData.name;
    }
  }

  // Products (cached)
  const products = await getProductsCached(
    categoryData?.id || null,
    searchTerm || null,
    productsPerPage,
    offset
  );

  const count = await getProductsCountCached(
    categoryData?.id || null,
    searchTerm || null
  );

  const totalPages = Math.ceil(count / productsPerPage);

  const t = {
    noResults:
      {
        en: "No products found.",
        sw: "Hakuna bidhaa zilizopatikana.",
        fr: "Aucun produit trouvé.",
        es: "No se encontraron productos.",
        de: "Keine Produkte gefunden.",
        it: "Nessun prodotto trovato.",
      }[lang] || "No products found.",
    prev:
      { en: "Prev", sw: "Iliyopita", fr: "Précédent", es: "Anterior", de: "Zurück", it: "Prec" }[
        lang
      ] || "Prev",
    next:
      { en: "Next", sw: "Inayofuata", fr: "Suivant", es: "Siguiente", de: "Weiter", it: "Succ" }[
        lang
      ] || "Next",
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
                  href={`/${lang}/products?page=${currentPage - 1}${
                    searchTerm ? `&q=${searchTerm}` : ""
                  }${categorySlug ? `&cat=${categorySlug}` : ""}`}
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
                  href={`/${lang}/products?page=${p}${
                    searchTerm ? `&q=${searchTerm}` : ""
                  }${categorySlug ? `&cat=${categorySlug}` : ""}`}
                  className={`pagination-link ${p === currentPage ? "active" : ""}`}
                >
                  {p}
                </Link>
              ))}

              {currentPage < totalPages ? (
                <Link
                  href={`/${lang}/products?page=${currentPage + 1}${
                    searchTerm ? `&q=${searchTerm}` : ""
                  }${categorySlug ? `&cat=${categorySlug}` : ""}`}
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
