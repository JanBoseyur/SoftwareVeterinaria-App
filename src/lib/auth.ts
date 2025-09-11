import { cookies } from 'next/headers';
import { JwtTokenService } from '@/infrastructure/adapters/JwtTokenService';

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();                 // en route/page server
  const token = cookieStore.get('access')?.value;
  if (!token) return null;
  const tokens = new JwtTokenService(process.env.ACCESS_SECRET!);
  const v = await tokens.verify(token);
  return v.valid ? (v.userId ?? null) : null;
}
