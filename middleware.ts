// middleware.ts (or proxy.ts, filename doesn't matter)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const languages = ['en', 'sw', 'fr', 'es', 'de', 'it'];
const defaultLanguage = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = languages.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const cookieLang = request.cookies.get('lang')?.value;
  const locale =
    languages.includes(cookieLang || '') ? cookieLang! : defaultLanguage;

  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};
