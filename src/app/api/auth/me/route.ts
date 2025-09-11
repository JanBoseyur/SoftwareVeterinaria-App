export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { JwtTokenService } from '@/infrastructure/adapters/JwtTokenService';

export async function GET() {
  const cookieStore = await cookies();           // 👈 await
  const token = cookieStore.get('access')?.value;

  if (!token) return NextResponse.json({ authenticated: false });

  const tokens = new JwtTokenService(process.env.ACCESS_SECRET!);
  const res = await tokens.verify(token);
  if (!res.valid) return NextResponse.json({ authenticated: false });

  return NextResponse.json({ authenticated: true, userId: res.userId });
}
