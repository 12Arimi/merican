import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mericanltd.com'; 
  const languages = ['en', 'sw', 'fr', 'es', 'de', 'it'];

  const staticRoutes = ['', '/about', '/products', '/services-projects', '/partners-clients', '/blog', '/contact', '/request-for-quote'];
  
  const categoryRoutes = [
    '/category/receiving', '/category/storage', '/category/preparation', '/category/production', 
    '/category/dispatch-servery', '/category/bar-area', '/category/wash-up-area', '/category/kitchen-support', 
    '/category/stainless-steel-fabrication', '/category/gas-section'
  ];

  const [{ data: products }, { data: projects }, { data: posts }] = await Promise.all([
    supabase.from('products').select('slug'),
    supabase.from('services_projects').select('slug'),
    supabase.from('posts').select('slug') 
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    // 1. Static & Category Routes
    [...staticRoutes, ...categoryRoutes].forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });

    // 2. Products - Using encodeURIComponent and trim for safety
    products?.forEach((product) => {
      if (product.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/products/${encodeURIComponent(product.slug.trim())}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    });

    // 3. Projects/Services
    projects?.forEach((item) => {
      if (item.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/services-projects/${encodeURIComponent(item.slug.trim())}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    });

    // 4. Blog Posts
    posts?.forEach((post) => {
      if (post.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/blog/${encodeURIComponent(post.slug.trim())}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
        });
      }
    });
  });

  return sitemapEntries;
}