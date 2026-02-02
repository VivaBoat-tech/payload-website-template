import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const LOCALES = ['es', 'en']
const DEFAULT_LOCALE = 'es'

function getLocale(request: NextRequest): string | boolean {
  const { pathname } = new URL(request.url)
  const maybeLocale = pathname.split('/')[1] // "es" => /es/lo-que-sea

  if (LOCALES.includes(maybeLocale)) {
    return maybeLocale
  }

  return DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json)$/.test(request.nextUrl.pathname)) {
    return
  }

  const { pathname } = request.nextUrl

  // 1. Comprobar si el path ya tiene locale
  const pathnameIsMissingLocale = LOCALES.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Si YA tiene locale, no hacemos nada
  if (!pathnameIsMissingLocale) {
    return
  }

  // 2. Verificar y obtener el locale
  const locale = getLocale(request)

  // 3. Redirigir añadiendo el locale al path
  return NextResponse.redirect(
    new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url),
  )
}

export const config = {
  matcher: [
    // Rutas con locale
    '/(en|es)/:path*',

    // Rutas sin locale (para redirigir)
    '/((?!api|admin|next/preview|_next).*)',
  ],
}
