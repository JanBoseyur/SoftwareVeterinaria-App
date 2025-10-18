/**
 * API Route: GET /api/auth/me
 * Capa: UI (Next.js App Router) – controlador del endpoint.
 *
 * Responsabilidad:
 * - Determinar si el usuario actual está autenticado.
 * - Leer el token de la cookie `access` y validarlo con `JwtTokenService`.
 * - Responder con el estado de autenticación y el `userId` si es válido.
 *
 * Notas:
 * - Este endpoint no requiere body (solo GET).
 * - La cookie es HttpOnly → no se accede desde JS del cliente, solo desde el servidor.
 * - Devuelve un JSON simple `{ authenticated: boolean, userId? }`.
 */

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { JwtTokenService } from '@/infrastructure/adapters/JwtTokenService';

/**
 * Verifica autenticación del usuario actual.
 * @returns 200 OK con:
 *  - `{ authenticated: false }` si no hay cookie o token inválido.
 *  - `{ authenticated: true, userId }` si el token es válido.
 */
export async function GET() {
  // Accede al almacenamiento de cookies en el request
  const cookieStore = await cookies();  // ⚠️ no necesita `await` en Next.js 13+, pero no rompe
  const token = cookieStore.get('access')?.value;

  // Caso: no hay cookie -> usuario no autenticado
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  // Instancia del servicio de tokens (adaptador JWT)
  const tokens = new JwtTokenService(process.env.ACCESS_SECRET!);

  // Verifica token (firma y expiración)
  const res = await tokens.verify(token);

  if (!res.valid) {
    // Token inválido o expirado
    return NextResponse.json({ authenticated: false });
  }

  // Token válido: usuario autenticado
  return NextResponse.json({ authenticated: true, userId: res.userId });
}
