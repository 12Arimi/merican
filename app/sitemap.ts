// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mericanltd.vercel.app';
  const languages = ['en', 'sw', 'fr', 'es', 'de', 'it'];

  // Add all your static routes here
  const routes = [
    '',
    '/about',
    '/contact',
    '/products',
    '/services-projects',        // adjust to your actual paths
    '/partners-clients',
    '/blog',
    '/request-quote',
    // Add more as needed (e.g., '/projects', '/team', etc.)
  ];

  // Generate one entry per route per language, with full hreflang alternates
  return routes.flatMap((route) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1.0 : route.includes('contact') || route.includes('quote') ? 0.9 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          languages.map((l) => [l, `${baseUrl}/${l}${route}`])
        ),
        'x-default': `${baseUrl}/en${route}`, // English as default
      },
    }))
  );
}