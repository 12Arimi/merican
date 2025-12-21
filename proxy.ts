// File Name: proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const languages = ['en', 'sw', 'fr', 'es', 'de', 'it'];
const defaultLanguage = 'en';

// RENAME THIS FROM 'middleware' TO 'proxy'
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = languages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLocale) return;

  const cookieLang = request.cookies.get('lang')?.value;
  const locale = languages.includes(cookieLang || '') ? cookieLang : defaultLanguage;

  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
  
  // 308 redirect is the gold standard for SEO and AI discovery
  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};