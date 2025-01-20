import { type NextRequest, NextResponse } from 'next/server'

import { DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from './lib/routes'

const protectedRoutes = DASHBOARD_ROUTE
const authRoutes = [LOGIN_ROUTE, REGISTER_ROUTE] as string[]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')
  const isProtectedRoute = pathname.startsWith(protectedRoutes)
  const isAuthRoute = authRoutes.includes(pathname)
  // Redirect user to the login page if no session cookie.
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url))
  }

  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL(protectedRoutes, request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
