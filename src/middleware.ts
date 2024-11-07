import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "@/config/i18n";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = i18n.locales;
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  const isAuthPath = pathname.includes("/auth/");
  const isRegisterPath = pathname.includes("/auth/register");
  const isRootPath = pathname === "/";
  const authToken = request.cookies.get("authToken")?.value;
  const locale = getLocale(request);

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const sanitizedPathname = pathname.startsWith("/")
      ? pathname.substring(1)
      : pathname;
    return NextResponse.redirect(
      new URL(`/${locale}/${sanitizedPathname || "home"}`, request.url)
    );
  }

  // If user is not authenticated and trying to access protected routes
  if (!authToken && !isAuthPath && !isRootPath) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // If user is authenticated and trying to access auth pages
  if (authToken && isRegisterPath) {
    return NextResponse.redirect(new URL(`/${locale}/index/home`, request.url));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
