import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { safeEqual } from '@/lib/adminAuth';

const execFileAsync = promisify(execFile);

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_MAINTENANCE_TOKEN;
  const authHeader = request.headers.get('authorization') || '';

  if (!token || token.length < 16) return false;
  return safeEqual(authHeader, `Bearer ${token}`);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DB_SYNC !== 'true') {
    return NextResponse.json({ error: 'Database sync is disabled in production.' }, { status: 403 })
  }

  try {
    const args = ['prisma', 'db', 'push'];
    if (process.env.ALLOW_PRISMA_DATA_LOSS === 'true') args.push('--accept-data-loss');

    const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd: process.cwd(),
      timeout: 60_000,
    });

    return NextResponse.json({ success: true, stdout, stderr });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown database sync error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
