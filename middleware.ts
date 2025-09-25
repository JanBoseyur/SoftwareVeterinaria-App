import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware global de Next.js
 *
 * Responsabilidad:
 * - Interceptar requests antes de que lleguen a la ruta destino.
 * - Verificar si existe la cookie `access` (token de sesión).
 * - Redirigir a `/login` si la ruta es protegida y el usuario no tiene token.
 *
 * Notas:
 * - La verificación aquí es mínima (solo presencia de cookie).
 *   La validación real del token (firma, expiración) se hace en
 *   los adaptadores (`JwtTokenService`) o en endpoints como `/api/auth/me`.
 * - Esto implementa un control básico de **autenticación**,
 *   no de autorización por roles.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get('access')?.value;

  // Si no hay cookie y la ruta es protegida, redirige al login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Caso por defecto: continuar al recurso solicitado
  return NextResponse.next();
}

/**
 * Configuración del middleware.
 *
 * `matcher` define qué rutas serán interceptadas y protegidas.
 * - En este caso: cualquier ruta bajo `/dashboard/*`.
 * - Se pueden añadir más patrones (ej: `/patients`, `/appointments`).
 */
export const config = {
  matcher: ['/dashboard/:path*'],
};
