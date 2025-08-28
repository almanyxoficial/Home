// middleware.js (na raiz)
export function middleware(req) {
  const BASIC_USER = process.env.BASIC_USER;
  const BASIC_PASS = process.env.BASIC_PASS;

  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="AlmaNyx"' }
    });
  }

  // decode base64 (client-safe)
  const encoded = auth.replace('Basic ', '');
  const decoded = typeof atob !== 'undefined'
    ? atob(encoded)
    : Buffer.from(encoded, 'base64').toString(); // fallback em ambiente node

  const [user, pass] = decoded.split(':');

  if (user === BASIC_USER && pass === BASIC_PASS) {
    return; // OK, segue request
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="AlmaNyx"' }
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'
  ]
};
