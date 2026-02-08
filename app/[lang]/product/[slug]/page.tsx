import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductActions from "@/components/ProductActions";
import { Metadata } from 'next';

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const pool = db();

  try {
    const [products]: any = await pool.query(
      "SELECT name, name_sw, name_fr, name_es, name_de, name_it, short_description FROM products WHERE slug = ? LIMIT 1",
      [slug]
    );

    const product = products[0];
    if (!product) return { title: "Product | Merican Limited" };

    const langSuffix = lang === "en" ? "" : `_${lang}`;
    const productName = product[`name${langSuffix}`] || product.name;
    const cleanDesc = (product[`short_description${langSuffix}`] || product.short_description || "")
      .replace(/<[^>]*>?/gm, '').substring(0, 155) + "...";

    return {
      title: `${productName} | Merican Limited`,
      description: cleanDesc,
      openGraph: { title: productName, description: cleanDesc }
    };
  } catch (e) {
    return { title: "Merican Limited" };
  }
}

// 📦 2. PRODUCT DETAILS COMPONENT
export default async function ProductDetails({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const pool = db();
  
  let product: any = null;

  // Attempt to fetch data with error handling for ECONNRESET
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.*, 
        c.name as cat_name, 
        c.name_sw as cat_name_sw, 
        c.name_fr as cat_name_fr, 
        c.name_es as cat_name_es, 
        c.name_de as cat_name_de, 
        c.name_it as cat_name_it
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? 
      LIMIT 1
    `, [slug]);
    
    product = rows[0];
  } catch (error) {
    console.error("Database connection reset:", error);
    // On shared hosting, a simple retry or a 500 page is better than a crash
    throw new Error("Database connection interrupted. Please refresh.");
  }

  if (!product) {
    notFound();
  }

  // Translation mapping logic
  const langSuffix = lang === "en" ? "" : `_${lang}`;
  const name = product[`name${langSuffix}`] || product.name;
  const shortDesc = product[`short_description${langSuffix}`] || product.short_description;
  const specs = product[`specs${langSuffix}`] || product.specs;
  const categoryName = product[`cat_name${langSuffix}`] || product.cat_name;

  // Image Logic
  // 3. Image URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imagePath = `${supabaseUrl}/storage/v1/object/public/images/${product.img}`;

  const t: any = {
    category: { en: 'Category:', sw: 'Kategoria:', fr: 'Catégorie:', es: 'Categoría:', de: 'Kategorie:', it: 'Categoria:' },
    specs: { en: 'Product Specifications', sw: 'Maelezo ya Bidhaa', fr: 'Spécifications du produit', es: 'Especificaciones', de: 'Produktspezifikationen', it: 'Specifiche del prodotto' },
    back: { en: 'Browse All Products', sw: 'Angalia Bidhaa Zote', fr: 'Parcourir tous les produits', es: 'Ver todos', de: 'Alle Produkte', it: 'Sfoglia tutti' }
  };

  return (
    <main>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{name}</h1>
        </div>
      </section>

      <section className="merican-page-section">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-image-col">
              <img 
                src={product.img ? imagePath : '/placeholder.png'} 
                alt={name} 
                className="main-product-img"
              />
            </div>

            <div className="product-info-col">
              <h2>{name}</h2>
              <div className="product-meta">
                <p><strong>{t.category[lang] || t.category.en}</strong> {categoryName}</p>
                <hr />
              </div>
              <p className="short-description-lg" style={{ whiteSpace: 'pre-line' }}>{shortDesc}</p>
              <ProductActions product={product} lang={lang} />
            </div>
          </div>

          {specs && (
            <div className="product-specs mt-5">
              <h3>{t.specs[lang] || t.specs.en}</h3>
              <div className="specs-content" dangerouslySetInnerHTML={{ __html: specs }} />
            </div>
          )}

          <div className="text-center mt-5">
             <Link href={`/${lang}/products`} className="cta-button">
                {t.back[lang] || t.back.en}
             </Link>
          </div>
        </div>
      </section>
    </main>
  );
}