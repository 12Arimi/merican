// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // This wildcard (*) ensures that /en/search, /sw/search, etc., are all blocked
      disallow: ['/api/', '/_next/', '/*/search/'], 
    },
    sitemap: 'https://mericanltd.com/sitemap.xml',
  };
}