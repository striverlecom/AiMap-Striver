import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code !== 'striver2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');
    return NextResponse.json({ success: true, stdout, stderr });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
