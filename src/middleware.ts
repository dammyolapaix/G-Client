import { type NextRequest, NextResponse } from 'next/server'

import { SignJWT, jwtVerify } from 'jose'

import { DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from './lib/routes'
import { SessionUser } from './types'

const protectedRoutes = DASHBOARD_ROUTE
const authRoutes = [LOGIN_ROUTE, REGISTER_ROUTE] as string[]

const key = new TextEncoder().encode(process.env.AUTH_SECRET)

const verifyToken = async (input: string) => {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })

  return payload as SessionUser
}

const signToken = async (payload: SessionUser) =>
  await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key)

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

  const res = NextResponse.next()

  if (sessionCookie && request.method === 'GET') {
    try {
      const parsed = await verifyToken(sessionCookie.value)

      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000)

      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString(),
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInOneDay,
      })
    } catch (error) {
      console.error('Error updating session:', error)
      res.cookies.delete('session')
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
