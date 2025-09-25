/**
 * API Route: POST /api/auth/login
 * Capa: UI (Next.js App Router) – controlador del endpoint.
 *
 * Responsabilidad:
 * - Validar input mínimo (email y password).
 * - Invocar el caso de uso `LoginUser` vía el contenedor (DIP).
 * - Gestionar la respuesta HTTP y setear cookie de sesión segura.
 *
 * Notas de seguridad:
 * - No expone el token en el body (solo cookie HttpOnly).
 * - Cookie con SameSite=strict y secure en producción.
 * - TTL: 15 min (alineado con TokenService).
 */

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { makeLoginUser } from '@/lib/container';

type LoginBody = { email?: string; password?: string };

/**
 * Maneja el login de usuario.
 * @param req Request con JSON { email, password }.
 * @returns 200 + cookie `access` en caso de éxito, o error 4xx en caso de fallo.
 *
 * Errores:
 * - 400 MISSING_FIELDS: faltan email o password.
 * - 400 INVALID_JSON: body no es JSON válido.
 * - 401 INVALID_CREDENTIALS: credenciales incorrectas (mapeado desde el use case).
 */
export async function POST(req: Request) {
  let body: LoginBody;

  // Parseo defensivo del body (evita explotar si el cliente envía JSON inválido)
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase(); // normaliza email para evitar falsos negativos
  const password = body.password;

  // Validación mínima de entrada (UI no hace negocio, solo sanea)
  if (!email || !password) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
  }

  // Inyección de dependencias vía composition root
  const uc = makeLoginUser();

  // Lógica de negocio encapsulada en el caso de uso (sin Prisma/JWT aquí)
  const res = await uc.exec({ email, password });

  // Mapeo de resultados de dominio → HTTP
  if (!res.ok) {
    // No revelamos detalles; el use case ya devuelve un código controlado
    return NextResponse.json({ error: res.error }, { status: 401 });
  }

  // Éxito: seteamos cookie HttpOnly con el token
  const resp = NextResponse.json({ ok: true }); // No exponemos el token en el body

  resp.cookies.set('access', res.value.token, {
    httpOnly: true,              // inaccesible desde JS del browser
    sameSite: 'strict',          // mitiga CSRF básico
    secure: process.env.NODE_ENV === 'production', // solo HTTPS en prod
    path: '/',
    maxAge: 60 * 15,             // 15 minutos
  });

  return resp;
}
