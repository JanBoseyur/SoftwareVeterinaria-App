/**
 * API Route: GET /api/users
 * Capa: UI (Next.js App Router) – controlador del endpoint.
 *
 * Responsabilidad:
 * - Invocar el caso de uso `ListUsers` vía el contenedor.
 * - Devolver la lista de usuarios en formato JSON (sin exponer `passwordHash`).
 *
 * Notas:
 * - `ListUsers` usa `toPublicDTO()` en la entidad, por lo que
 *   nunca se filtra la contraseña.
 * - Actualmente no se aplica autorización por roles: cualquier
 *   petición autenticada podría listar usuarios (esto podría
 *   endurecerse en el futuro).
 */

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { makeListUsers } from '@/lib/container';

/**
 * Maneja la consulta de usuarios.
 * @returns 200 OK con lista de usuarios públicos.
 *
 * Cada usuario incluye:
 * - id
 * - email
 * - role
 * - createdAt
 *
 * Ejemplo de respuesta:
 * ```json
 * [
 *   { "id": "uuid-1", "email": "a@b.com", "role": "ADMIN", "createdAt": "..." },
 *   { "id": "uuid-2", "email": "b@c.com", "role": "VET", "createdAt": "..." }
 * ]
 * ```
 */
export async function GET() {
  // Caso de uso desde el contenedor (inyecta repo)
  const uc = makeListUsers();

  // Ejecuta la lógica de aplicación
  const users = await uc.exec();

  // Devuelve la lista (sin passwordHash)
  return NextResponse.json(users, { status: 200 });
}
