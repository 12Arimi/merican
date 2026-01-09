import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductActions from "@/components/ProductActions";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  // 1. Fetch data from Supabase
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name,
        name_sw,
        name_fr,
        name_es,
        name_de,
        name_it
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  // 2. Translation logic
  const langSuffix = lang === "en" ? "" : `_${lang}`;
  const name = product[`name${langSuffix}`] || product.name;
  const shortDesc = product[`short_description${langSuffix}`] || product.short_description;
  const specs = product[`specs${langSuffix}`] || product.specs;
  
  const category = product.categories;
  const categoryName = category ? (category[`name${langSuffix}`] || category.name) : "";

  // 3. Image URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imagePath = `${supabaseUrl}/storage/v1/object/public/images/${product.img}`;

  // 4. UI Dictionary
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
                <p>
                  <strong>{t.category[lang] || t.category.en}</strong> {categoryName}
                </p>
                <hr />
              </div>

              <p className="short-description-lg" style={{ whiteSpace: 'pre-line' }}>
                {shortDesc}
              </p>

              {/* Client Component injected here */}
              <ProductActions product={product} lang={lang} />
            </div>
          </div>

          {specs && (
            <div className="product-specs mt-5">
              <h3>{t.specs[lang] || t.specs.en}</h3>
              <div 
                className="specs-content"
                dangerouslySetInnerHTML={{ __html: specs }} 
              />
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