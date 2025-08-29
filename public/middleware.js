// middleware.js (na raiz do projeto)

export function middleware(req) {
  const BASIC_USER = process.env.BASIC_USER;
  const BASIC_PASS = process.env.BASIC_PASS;

  // Pega o header de autenticação
  const auth = req.headers.get("authorization");

  // Se não tem header ou não começa com "Basic", pede login
  if (!auth || !auth.startsWith("Basic ")) {
    return new Response("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected"',
      },
    });
  }

  // Decodifica o Base64
  const encoded = auth.replace("Basic ", "");
  const decoded =
    typeof atob !== "undefined"
      ? atob(encoded)
      : Buffer.from(encoded, "base64").toString();

  const [user, pass] = decoded.split(":");

  // Confere usuário e senha
  if (user === BASIC_USER && pass === BASIC_PASS) {
    return; // ok, segue request normal
  }

  // Se falhar, retorna 401
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected"',
    },
  });
}
