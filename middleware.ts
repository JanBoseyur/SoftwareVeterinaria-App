import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access')?.value;
  // si no hay cookie y la ruta es protegida, redirige a login
  if (!token) {
    const loginUrl = new URL('/(auth)/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

// protege solo estas rutas (ajústalo a tu gusto)
export const config = {
  matcher: ['/dashboard/:path*'], // agrega más patrones /patients, /appointments, etc.
};
