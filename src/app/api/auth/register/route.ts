export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { makeRegisterUser } from '@/lib/container';

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  const uc = makeRegisterUser();
  const res = await uc.exec({ email, password, role });

  return res.ok
    ? NextResponse.json(res.value, { status: 201 })
    : NextResponse.json({ error: res.error }, { status: 400 });
}
