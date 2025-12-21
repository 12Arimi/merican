// proxy.ts (place in project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const languages = ['en', 'sw', 'fr', 'es', 'de', 'it'];
const defaultLanguage = 'en';

function getLocale(request: NextRequest): string {
  // 1. Check cookie first (user's explicit choice)
  const cookieLang = request.cookies.get('lang')?.value;
  if (cookieLang && languages.includes(cookieLang)) {
    return cookieLang;
  }

  // 2. Detect from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const headers = { 'accept-language': acceptLanguage };
    const browserLanguages = new Negotiator({ headers }).languages();
    try {
      return match(browserLanguages, languages, defaultLanguage);
    } catch {
      // Fallback if matching fails
    }
  }

  // 3. Default to English (most crawlers don't send Accept-Language)
  return defaultLanguage;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip if already has a locale prefix
  const pathnameHasLocale = languages.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Determine the best locale
  const locale = getLocale(request);

  // Build redirect URL preserving query params
  const redirectUrl = new URL(`/${locale}${pathname}${search}`, request.url);

  // Use 308 Permanent Redirect (safe for SEO, preserves method & body)
  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: [
    // Apply to all routes except static files, API, _next internals, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};