// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mericanltd.vercel.app'
  const languages = ['en', 'sw', 'fr', 'es', 'de', 'it']
  
  // 1. Static Routes (Home, About, Contact, etc.)
  const routes = ['', '/about', '/contact', '/products', '/request-quote']

  // 2. Generate entries for all languages across all static routes
  const staticEntries = languages.flatMap((lang) =>
    routes.map((route) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  )

  // 3. (Optional) You can even fetch your Supabase categories here!
  // const { data: categories } = await supabase.from('categories').select('slug')
  // Then map them just like the routes above.

  return [...staticEntries]
}