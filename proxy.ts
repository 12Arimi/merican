// proxy.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const languages = ['en', 'sw', 'fr', 'es', 'de', 'it'];
const defaultLanguage = 'en';

function getLocale(request: NextRequest): string {
  // Cookie override
  const cookieLang = request.cookies.get('lang')?.value;
  if (cookieLang && languages.includes(cookieLang)) return cookieLang;

  // Accept-Language (browsers send this; most crawlers don't → fallback to default)
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const headers = { 'accept-language': acceptLanguage };
    const browserLanguages = new Negotiator({ headers }).languages();
    try {
      return match(browserLanguages, languages, defaultLanguage);
    } catch {}
  }

  return defaultLanguage;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Explicitly check if path has locale (including root equivalents like /en)
  const hasLocale = languages.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );

  // If no locale prefix → redirect (this includes root '/')
  if (!hasLocale) {
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(redirectUrl, 308);
  }

  // Otherwise proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Broader matcher to catch everything, including root
    '/((?!_next|api|static|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};