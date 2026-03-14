import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decrypt } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'No user' });

    const payload = await decrypt(req.headers.get('cookie')?.split('session=')[1]?.split(';')[0] || '');
    
    const data = { mapData: JSON.stringify({ "acquisition": [] }) };
    const result = await prisma.day4Data.upsert({
      where: { userId: user.id },
      update: { ...data },
      create: { userId: user.id, ...data }
    });
    
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack, name: err.name });
  }
}
