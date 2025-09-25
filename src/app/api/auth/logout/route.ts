/**
 * API Route: POST /api/auth/logout
 * Capa: UI (Next.js App Router) – controlador del endpoint.
 *
 * Responsabilidad:
 * - Invalida la sesión actual del usuario.
 * - Elimina la cookie `access` (JWT) estableciéndola con `maxAge=0`.
 *
 * Notas de seguridad:
 * - Usa HttpOnly para que el frontend no manipule el token.
 * - SameSite=strict mitiga ataques CSRF básicos.
 * - `secure` solo en producción (HTTPS obligatorio).
 */

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

/**
 * Cierra la sesión del usuario.
 * @returns 200 OK y cookie `access` expirada.
 *
 * Efecto:
 * - La cookie de sesión se sobrescribe con valor vacío y duración 0.
 * - El cliente debe redirigir a login o pantalla pública.
 */
export async function POST() {
  // Respuesta base
  const resp = NextResponse.json({ ok: true });

  // Invalida la cookie 'access' (equivalente a borrar sesión)
  resp.cookies.set('access', '', {
    httpOnly: true,                        // inaccesible desde JS del browser
    sameSite: 'strict',                    // evita CSRF básico
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,                             // expira inmediatamente
  });

  return resp;
}
