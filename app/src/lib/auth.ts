import { cookies } from 'next/headers';
import { JwtTokenService } from '@/infrastructure/adapters/JwtTokenService';

/**
 * Helper de autenticación: obtiene el ID del usuario actual
 * a partir de la cookie `access` (token JWT).
 *
 * Responsabilidad:
 * - Leer la cookie HttpOnly de la request en un entorno server (Next.js).
 * - Verificar el token con `JwtTokenService`.
 * - Devolver el `userId` si el token es válido, o `null` en caso contrario.
 *
 * Notas:
 * - Este helper está pensado para usarse en **server components, server actions
 *   o API routes** de Next.js (no en el cliente).
 * - No realiza control de roles ni permisos, solo identificación.
 * - Si el token expiró o no existe la cookie, devuelve `null`.
 */
export async function getCurrentUserId(): Promise<string | null> {
  // Accede al storage de cookies del request actual (solo en server)
  const cookieStore = await cookies();

  // Extrae el valor del token almacenado en la cookie 'access'
  const token = cookieStore.get('access')?.value;
  if (!token) return null;

  // Servicio de tokens JWT (adaptador de infraestructura)
  const tokens = new JwtTokenService(process.env.ACCESS_SECRET!);

  // Verifica el token (firma y expiración)
  const v = await tokens.verify(token);

  // Devuelve el userId si es válido, o null en caso contrario
  return v.valid ? (v.userId ?? null) : null;
}
