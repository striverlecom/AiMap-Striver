import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function isAuthorized(req: Request) {
  const token = process.env.ADMIN_MAINTENANCE_TOKEN;
  if (!token) return false;
  return req.headers.get('authorization') === `Bearer ${token}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debug route is disabled in production.' }, { status: 403 });
  }

  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'No user' });
    
    const data = { mapData: JSON.stringify({ "acquisition": [] }) };
    const result = await prisma.day4Data.upsert({
      where: { userId: user.id },
      update: { ...data },
      create: { userId: user.id, ...data }
    });
    
    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown debug error';
    return NextResponse.json({ error: message });
  }
}
