export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { makeLoginUser } from '@/lib/container';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
  }

  const uc = makeLoginUser();
  const res = await uc.exec({ email, password });

  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 401 });

  const resp = NextResponse.json({ ok: true }); // ya no enviamos el token en el body
  resp.cookies.set('access', res.value.token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 15, // 15 min
  });
  return resp;
}
