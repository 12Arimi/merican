import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";

export const revalidate = 86400; 

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
  ["category-slug-lookup"],
  { revalidate: 86400, tags: ["categories"] }
);

const getCategoryProducts = unstable_cache(
  async (categoryId: number, searchTerm: string | null, limit: number, offset: number) => {
    const pool = db();
    let query = "SELECT * FROM products WHERE category_id = ?";
    let params: any[] = [categoryId];

    if (searchTerm) {
      query += " AND name LIKE ?";
      params.push(`%${searchTerm}%`);
    }

    query += " ORDER BY id ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows]: any = await pool.query(query, params);
    return rows;
  },
  ["category-products-list"],
  { revalidate: 86400, tags: ["products"] }
);

const getCategoryProductsCount = unstable_cache(
  async (categoryId: number, searchTerm: string | null) => {
    const pool = db();
    let query = "SELECT COUNT(*) as total FROM products WHERE category_id = ?";
    let params: any[] = [categoryId];

    if (searchTerm) {
      query += " AND name LIKE ?";
      params.push(`%${searchTerm}%`);
    }

    const [rows]: any = await pool.query(query, params);
    return rows[0]?.total || 0;
  },
  ["category-products-count"],
  { revalidate: 86400, tags: ["products"] }
);

// -----------------------------
// SEO METADATA (Updated to use cache)
// -----------------------------

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const cat = await getCategoryBySlug(slug);

  if (!cat) return { title: "Products | Merican Limited" };

  const langKey = lang === 'en' ? 'name' : `name_${lang}`;
  const categoryName = cat[langKey] || cat.name;

  return {
    title: `${categoryName} | Commercial Kitchen Equipment`,
    description: `Explore high-quality ${categoryName} for commercial kitchens.`,
  };
}

// -----------------------------
// PAGE COMPONENT
// -----------------------------

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

  const categoryData = await getCategoryBySlug(slug);
  
  if (!categoryData) {
     return <div>Category not found</div>;
  }

  const products = await getCategoryProducts(categoryData.id, searchTerm || null, productsPerPage, offset);
  const count = await getCategoryProductsCount(categoryData.id, searchTerm || null);
  const totalPages = Math.ceil(count / productsPerPage);

  const title = searchTerm ? `"${searchTerm}"` : (categoryData[lang === 'en' ? 'name' : `name_${lang}`] || categoryData.name);

  const t = {
    noResults: { en: "No products found.", sw: "Hakuna bidhaa zilizopatikana." }[lang] || "No products found.",
    prev: { en: 'Prev', sw: 'Iliyopita' }[lang] || 'Prev',
    next: { en: 'Next', sw: 'Inayofuata' }[lang] || 'Next',
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
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {currentPage > 1 && (
                <Link href={`/${lang}/category/${slug}?page=${currentPage - 1}${searchTerm ? `&q=${searchTerm}` : ''}`} className="pagination-link">
                  &laquo; {t.prev}
                </Link>
              )}
              {/* ... Page Numbers ... */}
              {currentPage < totalPages && (
                <Link href={`/${lang}/category/${slug}?page=${currentPage + 1}${searchTerm ? `&q=${searchTerm}` : ''}`} className="pagination-link">
                  {t.next} &raquo;
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}