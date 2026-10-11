import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt, readSessionCookie } from '@/lib/auth'
import { safeJsonParse, type PrdItem } from '@/lib/prd'
import { type SiItem } from '@/lib/systemInstruction'
import { generateGoClawPackage } from '@/lib/agentRuntimes'
import { createTarGz } from '@/lib/tarGz'

export const dynamic = 'force-dynamic'

async function getUserFromSession(req: Request) {
  const token = readSessionCookie(req)
  if (!token) return null

  try {
    const payload = await decrypt(token)
    if (!payload?.userId) return null
    return prisma.user.findUnique({
      where: { id: payload.userId },
      include: { day8Data: true, day9Data: true }
    })
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const useCaseIndex = parseInt(searchParams.get('useCaseIndex') || '1', 10)

  const prds = safeJsonParse<PrdItem[]>(user.day8Data?.prdData, [])
  const sis = safeJsonParse<SiItem[]>(user.day9Data?.siData, [])

  const activePrd = prds.find(p => p.useCaseIndex === useCaseIndex) || prds[0]
  const activeSi = sis.find(s => s.useCaseIndex === useCaseIndex) || sis[0]

  if (!activeSi?.markdown && !activePrd?.markdown) {
    return NextResponse.json({ error: 'Chưa có dữ liệu System Instruction cho use-case này.' }, { status: 404 })
  }

  const pkg = generateGoClawPackage(activePrd, activeSi)
  const slug = (activePrd?.useCaseTitle || activeSi?.useCaseTitle || 'agent')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Package all native files expected by GoClaw
  const files: Record<string, string> = {
    'AGENTS.md': pkg.agentsMd,
    'SOUL.md': pkg.soulMd,
    'IDENTITY.md': pkg.identityMd,
    'USER.md': pkg.userMd,
    'USER_PREDEFINED.md': pkg.userPredefinedMd,
    'CAPABILITIES.md': pkg.capabilitiesMd,
    'HEARTBEAT.md': pkg.heartbeatMd
  }

  const tarGzBuffer = createTarGz(files)
  const filename = `goclaw-${slug || 'agent'}.tar.gz`

  return new NextResponse(new Uint8Array(tarGzBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/gzip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': tarGzBuffer.length.toString(),
      'Cache-Control': 'no-store'
    }
  })
}
