import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  // Protected paths that require authentication
  const isProtectedPath = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/day-') || 
    request.nextUrl.pathname.startsWith('/payment')

  // Auth pages (login, register) should redirect to dashboard if already logged in
  const isAuthPath = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/register')

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    try {
      const payload = await decrypt(token)
      if (isAuthPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // If user hasn't paid, they can only access /payment (or profile/dashboard minimal)
      // Here we allow them to /payment if not paid. Will implement detailed check in components.
    } catch (e) {
      if (isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
