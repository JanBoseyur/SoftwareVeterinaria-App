export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { makeListUsers } from '@/lib/container';

export async function GET() {
  const uc = makeListUsers();
  const users = await uc.exec();
  return NextResponse.json(users, { status: 200 });
}
