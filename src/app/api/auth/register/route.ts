/**
 * API Route: POST /api/auth/register
 * Capa: UI (Next.js App Router) – controlador del endpoint.
 *
 * Responsabilidad:
 * - Recibir datos de registro (email, password, role?).
 * - Invocar al caso de uso `RegisterUser` a través del contenedor.
 * - Mapear la respuesta del caso de uso a HTTP:
 *   - 201 Created si se registró correctamente.
 *   - 400 Bad Request con código de error si falló.
 *
 * Notas:
 * - La lógica de validación y unicidad de email está en el caso de uso (no en la capa UI).
 * - La respuesta incluye un DTO público del usuario (sin exponer `passwordHash`).
 */

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { makeRegisterUser } from '@/lib/container';

/**
 * Maneja el registro de un nuevo usuario.
 * @param req Request con JSON { email, password, role? }.
 * @returns 201 + DTO de usuario en éxito, o 400 con error en caso de fallo.
 *
 * Errores posibles (propagados desde `RegisterUser`):
 * - EMAIL_IN_USE → el email ya está registrado.
 * - EMAIL_INVALID → formato incorrecto de email.
 * - WEAK_PASSWORD → contraseña demasiado débil (< 8 chars).
 */
export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  // Caso de uso desde el contenedor (inyecta dependencias: repo + hasher)
  const uc = makeRegisterUser();

  // Ejecuta la lógica de registro
  const res = await uc.exec({ email, password, role });

  // Mapea resultado → HTTP
  return res.ok
    ? NextResponse.json(res.value, { status: 201 }) // usuario creado (DTO público)
    : NextResponse.json({ error: res.error }, { status: 400 }); // error controlado
}
