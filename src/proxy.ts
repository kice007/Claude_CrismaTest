// src/proxy.ts  — Next.js 16 protected routes guard
// IMPORTANT: Next.js 16 renamed middleware.ts → proxy.ts; function must be named `proxy` not `middleware`
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('crismatest_auth')?.value === '1'
  const { pathname } = request.nextUrl

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/test')) && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/test/:path*'],
}
