import { NextResponse } from 'next/server';

// Protege TUDO (pode afrouxar caminhos no matcher se quiser)
export const config = { matcher: ['/:path*'] };

export async function middleware(req) {
  const auth = req.headers.get('authorization');
  const USER = process.env.BASIC_USER;
  const PASS = process.env.BASIC_PASS;

  if (auth) {
    const [scheme, token] = auth.split(' ');
    if (scheme === 'Basic' && token) {
      // Edge runtime tem atob()
      const [user, pass] = atob(token).split(':');
      if (user === USER && pass === PASS) {
        return NextResponse.next();
      }
    }
  }

  // Pede credenciais nativas do navegador
  const res = new NextResponse('Auth required', { status: 401 });
  res.headers.set('WWW-Authenticate', 'Basic realm="AlmaNyx"');
  return res;
}