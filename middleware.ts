import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isClient = token?.role === 'CLIENT'
    const isAuth = !!token

    // Routes admin - seulement pour les admins
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/connexion', req.url))
      }
    }

    // Routes client - seulement pour les clients connectés
    if (req.nextUrl.pathname.startsWith('/client')) {
      if (!isClient && !isAdmin) {
        return NextResponse.redirect(new URL('/connexion', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Pour les routes admin, vérifier que l'utilisateur est admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        // Pour les routes client, vérifier que l'utilisateur est connecté
        if (req.nextUrl.pathname.startsWith('/client')) {
          return !!token
        }
        // Pour les autres routes, autoriser
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/client/:path*',
  ],
}
