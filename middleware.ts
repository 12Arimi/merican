import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Define your supported languages
const languages = ['en', 'sw', 'fr', 'es', 'de', 'it'];
const defaultLanguage = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Check if the pathname already has a supported locale prefix
  // Example: /sw/contact or /en/about
  const pathnameHasLocale = languages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLocale) return;

  // 3. If NO locale prefix is present (e.g., website.com/contact)
  // Check if there is a 'lang' cookie or use the default
  const cookieLang = request.cookies.get('lang')?.value;
  const locale = languages.includes(cookieLang || '') ? cookieLang : defaultLanguage;

  // 4. Perform a 301 Redirect to the version with the locale
  // website.com/contact -> website.com/en/contact
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl, {
    status: 301, // Permanent redirect for SEO
  });
}

// 5. Configure which paths should trigger the middleware
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static assets, etc.)
    // We only want to redirect actual page requests
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};