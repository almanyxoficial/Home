// middleware.js
import { NextResponse } from 'next/server'

const decodeBase64 = (str) => {
  // Edge runtime tem atob; Node nem sempre. Fallback seguro:
  try { return atob(str) } catch { return Buffer.from(str, 'base64').toString() }
}

export function middleware(req) {
  const BASIC_USER = process.env.BASIC_USER
  const BASIC_PASS = process.env.BASIC_PASS

  // Cabeçalho de auth enviado pelo navegador:
  const auth = req.headers.get('authorization') || ''

  // Sem header ou formato inesperado → pede credenciais
  if (!auth.startsWith('Basic ')) {
    return new Response('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="AlmaNyx"',
        'Cache-Control': 'no-store',
      },
    })
  }

  // Decodifica "Basic base64(user:pass)"
  const encoded = auth.replace('Basic ', '')
  const [user, pass] = decodeBase64(encoded).split(':')

  // Confere com as envs do Vercel
  if (user === BASIC_USER && pass === BASIC_PASS) {
    return NextResponse.next()
  }

  // Credenciais erradas
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AlmaNyx", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  })
}

// Evita rodar em assets estáticos/_next para não bloquear favicon/imagens
export const config = {
  matcher: [
    // protege tudo, exceto assets:
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
}
