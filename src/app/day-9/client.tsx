'use client'

import { useEffect, useState, useMemo } from 'react'
import { slugifyFileName, type PrdItem } from '@/lib/prd'
import type { SiItem } from '@/lib/systemInstruction'
import ConsultingCta from '@/components/ConsultingCta'
import {
  generateGoClawPackage,
  generateN8nWorkflow,
  generateClaudeCodePackage,
  type RuntimeTarget
} from '@/lib/agentRuntimes'

type Props = {
  prdCount: number
  prds: PrdItem[]
  initialItems: SiItem[]
  isConfigured: boolean
}

export default function Day9Client({ prdCount, prds, initialItems, isConfigured }: Props) {
  const [items, setItems] = useState<SiItem[]>(initialItems)
  const [activeIndex, setActiveIndex] = useState(initialItems[0]?.useCaseIndex || 1)
  const [loading, setLoading] = useState<number | 'all' | null>(null)
  const [error, setError] = useState('')

  // Runtime View States
  const [activeRuntime, setActiveRuntime] = useState<RuntimeTarget>('goclaw')
  const [activeGoclawFile, setActiveGoclawFile] = useState<'agents' | 'soul' | 'identity' | 'user' | 'userPredefined' | 'capabilities' | 'heartbeat'>('agents')
  const [copyNotice, setCopyNotice] = useState<string | null>(null)

  const activeItem = items.find(item => item.useCaseIndex === activeIndex) || items[0]
  const activePrd = prds.find(p => p.useCaseIndex === activeIndex) || prds[0]
  const hasEnoughPrds = prdCount >= 1
  const hasGeneratingItem = items.some(item => item.status === 'generating')
  const activeItemIsGenerating = activeItem?.status === 'generating'

  // Memoized Runtime Packages
  const goClawPkg = useMemo(() => {
    return generateGoClawPackage(activePrd, activeItem)
  }, [activePrd, activeItem])

  const n8nJson = useMemo(() => {
    return generateN8nWorkflow(activePrd, activeItem)
  }, [activePrd, activeItem])

  const claudePkg = useMemo(() => {
    return generateClaudeCodePackage(activePrd, activeItem)
  }, [activePrd, activeItem])

  useEffect(() => {
    if (loading === null && !hasGeneratingItem) return

    const targetIndexes = loading === 'all'
      ? items.map(item => item.useCaseIndex)
      : loading !== null
        ? [loading]
        : items.filter(item => item.status === 'generating').map(item => item.useCaseIndex)
    let stopped = false

    const poll = async () => {
      try {
        const res = await fetch('/api/si/generate', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || stopped) return
        setItems(data.siData)
        const targetItems = data.siData.filter((item: SiItem) => targetIndexes.includes(item.useCaseIndex))
        const stillGenerating = targetItems.some((item: SiItem) => item.status === 'generating')
        const hasFinished = targetItems.some((item: SiItem) => item.status === 'completed' || item.status === 'failed')
        if (hasFinished && !stillGenerating) setLoading(null)
      } catch {
        // Polling is best effort; the submit request or next poll will update the UI.
      }
    }

    const interval = window.setInterval(poll, 5000)
    poll()
    return () => {
      stopped = true
      window.clearInterval(interval)
    }
  }, [loading, hasGeneratingItem, items])

  const generate = async (useCaseIndex?: number) => {
    setLoading(useCaseIndex || 'all')
    setError('')
    const targetIndexes = useCaseIndex ? [useCaseIndex] : items.map(item => item.useCaseIndex)
    setItems(prev => prev.map(item => targetIndexes.includes(item.useCaseIndex)
      ? { ...item, status: 'generating', errorMessage: null }
      : item
    ))

    try {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 210000)
      const res = await fetch('/api/si/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(useCaseIndex ? { useCaseIndex } : {})
      })
      window.clearTimeout(timeout)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Không thể tạo System Instruction.')
      setItems(data.siData)
      if (useCaseIndex) setActiveIndex(useCaseIndex)
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setError('Yêu cầu tạo System Instruction vẫn đang xử lý trên máy chủ. Trang sẽ tự cập nhật khi hoàn tất.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(null)
    }
  }

  const downloadTextFile = (content: string, filename: string, mimeType = 'text/plain;charset=utf-8') => {
    if (!content) return
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyNotice(`Đã sao chép ${label}!`)
      setTimeout(() => setCopyNotice(null), 2500)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const downloadGoclawSetupScript = () => {
    const slug = slugifyFileName(activeItem?.useCaseTitle || 'agent')
    const script = `#!/bin/bash
# Script tự động tạo Workspace GoClaw cho: ${activeItem?.useCaseTitle || 'Agent'}
set -e
WORKSPACE="goclaw-${slug}"
echo "🚀 Đang khởi tạo Workspace GoClaw tại ./$WORKSPACE..."
mkdir -p "$WORKSPACE"

cat << 'EOF' > "$WORKSPACE/AGENTS.md"
${goClawPkg.agentsMd}
EOF

cat << 'EOF' > "$WORKSPACE/SOUL.md"
${goClawPkg.soulMd}
EOF

cat << 'EOF' > "$WORKSPACE/IDENTITY.md"
${goClawPkg.identityMd}
EOF

cat << 'EOF' > "$WORKSPACE/USER.md"
${goClawPkg.userMd}
EOF

cat << 'EOF' > "$WORKSPACE/USER_PREDEFINED.md"
${goClawPkg.userPredefinedMd}
EOF

cat << 'EOF' > "$WORKSPACE/CAPABILITIES.md"
${goClawPkg.capabilitiesMd}
EOF

cat << 'EOF' > "$WORKSPACE/HEARTBEAT.md"
${goClawPkg.heartbeatMd}
EOF

cat << 'EOF' > "$WORKSPACE/goclaw-agent.json"
${goClawPkg.importJson}
EOF

echo "✅ Đã tạo xong trọn bộ file cấu hình gốc của GoClaw:"
echo "   - AGENTS.md"
echo "   - SOUL.md"
echo "   - IDENTITY.md"
echo "   - USER.md"
echo "   - USER_PREDEFINED.md"
echo "   - CAPABILITIES.md"
echo "   - HEARTBEAT.md"
echo "   - goclaw-agent.json (gói Import 1-click)"
echo "👉 Cách dùng: cd $WORKSPACE hoặc kéo thả file vào GoClaw.sh"
`
    downloadTextFile(script, `setup-goclaw-${slug}.sh`)
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: 1200 }}>
      {/* Toast Notice */}
      {copyNotice && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--success)',
          color: '#000',
          padding: '0.75rem 1.25rem',
          borderRadius: 8,
          fontWeight: 700,
          zIndex: 9999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          ✓ {copyNotice}
        </div>
      )}

      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>Ngày 9: System Instruction & Đấu Nối Thực Chiến</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 850, margin: '0 auto', lineHeight: 1.6 }}>
          Chuyển PRD Ngày 8 thành System Instruction XML production-ready và tự động đóng gói sẵn sàng chạy ngay trên <strong>GoClaw.sh</strong>, <strong>n8n Workflow</strong>, và <strong>Claude Code / Cursor</strong>.
        </p>
      </header>

      {!isConfigured && (
        <div className="glass-panel" style={{ border: '1px solid var(--warning)', marginBottom: '2rem' }}>
          <strong style={{ color: 'var(--warning)' }}>Chưa cấu hình Gemini SI Agent.</strong>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Máy chủ cần có GEMINI_API_KEY trước khi tạo System Instruction.</p>
        </div>
      )}

      {!hasEnoughPrds ? (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Chưa có PRD completed từ Ngày 8</h2>
          <p style={{ color: 'var(--muted)' }}>Vui lòng quay lại Ngày 8 và tạo ít nhất 1 PRD trước khi sang Ngày 9.</p>
        </div>
      ) : (
        <>
          {/* USE-CASE SELECTOR */}
          <section className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--success)' }}>{items.length} use-case sẽ được tạo System Instruction & Agent Runtime</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {items.map(item => (
                <button
                  key={item.useCaseIndex}
                  onClick={() => setActiveIndex(item.useCaseIndex)}
                  style={{
                    textAlign: 'left',
                    padding: '1rem',
                    borderRadius: 8,
                    border: activeIndex === item.useCaseIndex ? '1px solid var(--success)' : '1px solid var(--card-border)',
                    background: activeIndex === item.useCaseIndex ? 'rgba(50,215,75,0.08)' : 'rgba(255,255,255,0.03)',
                    color: 'var(--foreground)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ color: 'var(--success)', fontWeight: 700, marginBottom: 8 }}>Use-case #{item.useCaseIndex}</div>
                  <div style={{ fontWeight: 700, overflowWrap: 'anywhere', lineHeight: 1.4 }}>{item.useCaseTitle}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 8 }}>
                    Trạng thái: <span style={{ color: item.status === 'completed' ? 'var(--success)' : 'inherit' }}>{item.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* GENERATE CONTROLS */}
          <section className="glass-panel" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button className="btn-primary" onClick={() => generate()} disabled={!isConfigured || loading !== null || hasGeneratingItem}>
                {loading === 'all' ? 'Đang tạo bộ SI...' : `Tạo System Instruction cho ${items.length} PRD`}
              </button>
              {activeItem && (
                <button className="btn-secondary" onClick={() => generate(activeItem.useCaseIndex)} disabled={!isConfigured || loading !== null || activeItemIsGenerating}>
                  {loading === activeItem.useCaseIndex || activeItemIsGenerating ? 'Đang tạo lại...' : 'Tạo lại SI đang chọn'}
                </button>
              )}
            </div>
            {error && <p style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          </section>

          {activeItem && (
            <section className="glass-panel">
              {/* RUNTIME PLATFORM TABS */}
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>
                      Đặc Tả Kỹ Thuật #{activeItem.useCaseIndex}: {activeItem.useCaseTitle}
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {activeItem.generatedAt ? `Tạo lúc ${new Date(activeItem.generatedAt).toLocaleString('vi-VN')}` : 'Chưa tạo System Instruction'}
                    </p>
                  </div>
                </div>

                {/* RUNTIME SELECTOR BUTTONS */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveRuntime('goclaw')}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: 8,
                      border: activeRuntime === 'goclaw' ? '1px solid var(--success)' : '1px solid var(--card-border)',
                      background: activeRuntime === 'goclaw' ? 'rgba(50,215,75,0.15)' : 'rgba(255,255,255,0.03)',
                      color: activeRuntime === 'goclaw' ? 'var(--success)' : 'var(--foreground)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>🦅 GoClaw.sh Agent</span>
                  </button>

                  <button
                    onClick={() => setActiveRuntime('n8n')}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: 8,
                      border: activeRuntime === 'n8n' ? '1px solid #FF6D5A' : '1px solid var(--card-border)',
                      background: activeRuntime === 'n8n' ? 'rgba(255,109,90,0.15)' : 'rgba(255,255,255,0.03)',
                      color: activeRuntime === 'n8n' ? '#FF6D5A' : 'var(--foreground)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>⚡ n8n Workflow (JSON)</span>
                  </button>

                  <button
                    onClick={() => setActiveRuntime('claudecode')}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: 8,
                      border: activeRuntime === 'claudecode' ? '1px solid #7C5CFF' : '1px solid var(--card-border)',
                      background: activeRuntime === 'claudecode' ? 'rgba(124,92,255,0.15)' : 'rgba(255,255,255,0.03)',
                      color: activeRuntime === 'claudecode' ? '#B8A4FF' : 'var(--foreground)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>💻 Claude Code / Cursor</span>
                  </button>

                  <button
                    onClick={() => setActiveRuntime('markdown')}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: 8,
                      border: activeRuntime === 'markdown' ? '1px solid var(--muted)' : '1px solid var(--card-border)',
                      background: activeRuntime === 'markdown' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                      color: 'var(--foreground)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>📄 System Instruction Gốc (XML)</span>
                  </button>
                </div>
              </div>

              {activeItem.errorMessage && (
                <div style={{ color: 'var(--error)', padding: '1rem', border: '1px solid var(--error)', borderRadius: 8, marginBottom: '1rem' }}>
                  {activeItem.errorMessage}
                </div>
              )}

              {/* 1. GOCLAW.SH RUNTIME TAB */}
              {activeRuntime === 'goclaw' && (
                <div>
                  <div style={{
                    background: 'rgba(50,215,75,0.05)',
                    border: '1px solid rgba(50,215,75,0.2)',
                    borderRadius: 8,
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <strong style={{ color: 'var(--success)', fontSize: '1.05rem' }}>🦅 GoClaw.sh / OpenClaw Autonomous Workspace</strong>
                        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
                          Trọn bộ cấu hình Workspace đạt chuẩn Harness Agent. Có thể tải về hoặc chạy lệnh 1-click để khởi chạy ngay trên máy chủ hoặc terminal cá nhân.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn-primary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#10b981', borderColor: '#10b981' }}
                          onClick={() => downloadTextFile(goClawPkg.importJson, `goclaw-agent-${slugifyFileName(activeItem?.useCaseTitle || 'agent')}.json`, 'application/json')}
                          disabled={!activeItem.markdown}
                          title="Tải file JSON để bấm nút 'Import Agent' trên GoClaw.sh"
                        >
                          📥 Tải File Nhập GoClaw (goclaw-agent.json)
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                          onClick={downloadGoclawSetupScript}
                          disabled={!activeItem.markdown}
                          title="Tải bash script tự động tạo thư mục và 6 file"
                        >
                          ⚡ Script Tạo Workspace
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                          onClick={() => copyToClipboard(goClawPkg.allInOne, 'Trọn bộ 6 file GoClaw')}
                          disabled={!activeItem.markdown}
                        >
                          📋 Sao chép All-in-One
                        </button>
                      </div>
                    </div>

                    {/* Quick instruction for GoClaw import */}
                    <div style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '0.75rem 1rem',
                      borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ color: 'var(--muted)' }}>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>Cách 1 (Nhanh nhất):</span> Bấm nút xanh <strong>"Tải File Nhập GoClaw"</strong> ➔ Trên GoClaw.sh chọn <strong>"Import Agent"</strong> ➔ Chọn file vừa tải.<br />
                        <span style={{ color: '#10b981', fontWeight: 600 }}>Cách 2:</span> Trên GoClaw.sh vào tab <strong>"Tệp"</strong> ➔ Chọn từng file (AGENTS.md, SOUL.md,...) ➔ Copy nội dung bên dưới dán vào.
                      </div>
                    </div>
                  </div>

                  {/* Sub-file tabs: Full native files of GoClaw */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                      { id: 'agents', label: 'AGENTS.md', desc: 'Danh sách Agents & Phân quyền' },
                      { id: 'soul', label: 'SOUL.md', desc: 'Bản sắc, Tính cách & Ranh giới' },
                      { id: 'identity', label: 'IDENTITY.md', desc: 'Định danh, Model & Vibe' },
                      { id: 'user', label: 'USER.md', desc: 'Ngữ cảnh người dùng (theo user)' },
                      { id: 'userPredefined', label: 'USER_PREDEFINED.md', desc: 'Bối cảnh nghiệp vụ & Input Schema' },
                      { id: 'capabilities', label: 'CAPABILITIES.md', desc: 'Quy trình thực thi & Output Schema' },
                      { id: 'heartbeat', label: 'HEARTBEAT.md', desc: 'Checklist định kỳ' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setActiveGoclawFile(f.id as any)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: 6,
                          fontSize: '0.82rem',
                          fontWeight: activeGoclawFile === f.id ? 700 : 500,
                          border: activeGoclawFile === f.id ? '1px solid var(--success)' : '1px solid var(--card-border)',
                          background: activeGoclawFile === f.id ? 'rgba(50,215,75,0.15)' : 'transparent',
                          color: activeGoclawFile === f.id ? 'var(--success)' : 'var(--muted)',
                          cursor: 'pointer'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => {
                          const contentMap: Record<string, { content: string, name: string }> = {
                            agents: { content: goClawPkg.agentsMd, name: 'AGENTS.md' },
                            soul: { content: goClawPkg.soulMd, name: 'SOUL.md' },
                            identity: { content: goClawPkg.identityMd, name: 'IDENTITY.md' },
                            user: { content: goClawPkg.userMd, name: 'USER.md' },
                            userPredefined: { content: goClawPkg.userPredefinedMd, name: 'USER_PREDEFINED.md' },
                            capabilities: { content: goClawPkg.capabilitiesMd, name: 'CAPABILITIES.md' },
                            heartbeat: { content: goClawPkg.heartbeatMd, name: 'HEARTBEAT.md' }
                          }
                          const cur = contentMap[activeGoclawFile]
                          if (cur) copyToClipboard(cur.content, cur.name)
                        }}
                        disabled={!activeItem.markdown}
                      >
                        Copy File
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => {
                          const contentMap: Record<string, { content: string, name: string }> = {
                            agents: { content: goClawPkg.agentsMd, name: 'AGENTS.md' },
                            soul: { content: goClawPkg.soulMd, name: 'SOUL.md' },
                            identity: { content: goClawPkg.identityMd, name: 'IDENTITY.md' },
                            user: { content: goClawPkg.userMd, name: 'USER.md' },
                            userPredefined: { content: goClawPkg.userPredefinedMd, name: 'USER_PREDEFINED.md' },
                            capabilities: { content: goClawPkg.capabilitiesMd, name: 'CAPABILITIES.md' },
                            heartbeat: { content: goClawPkg.heartbeatMd, name: 'HEARTBEAT.md' }
                          }
                          const cur = contentMap[activeGoclawFile]
                          if (cur) downloadTextFile(cur.content, cur.name)
                        }}
                        disabled={!activeItem.markdown}
                      >
                        Download File
                      </button>
                    </div>
                  </div>

                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 8,
                    padding: '1rem',
                    minHeight: 300,
                    maxHeight: 650,
                    overflow: 'auto',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '0.86rem',
                    lineHeight: 1.6
                  }}>
                    {activeGoclawFile === 'agents' && goClawPkg.agentsMd}
                    {activeGoclawFile === 'soul' && goClawPkg.soulMd}
                    {activeGoclawFile === 'identity' && goClawPkg.identityMd}
                    {activeGoclawFile === 'user' && goClawPkg.userMd}
                    {activeGoclawFile === 'userPredefined' && goClawPkg.userPredefinedMd}
                    {activeGoclawFile === 'capabilities' && goClawPkg.capabilitiesMd}
                    {activeGoclawFile === 'heartbeat' && goClawPkg.heartbeatMd}
                  </pre>
                </div>
              )}

              {/* 2. N8N WORKFLOW RUNTIME TAB */}
              {activeRuntime === 'n8n' && (
                <div>
                  <div style={{
                    background: 'rgba(255,109,90,0.06)',
                    border: '1px solid rgba(255,109,90,0.25)',
                    borderRadius: 8,
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <strong style={{ color: '#FF6D5A', fontSize: '1.05rem' }}>⚡ n8n AI Agent Workflow (Importable JSON)</strong>
                        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
                          Workflow chuẩn hóa gồm: <strong>Webhook</strong> ➔ <strong>AI Agent (Gemini)</strong> ➔ <strong>Structured Output Parser</strong> (chuẩn Schema từ PRD) ➔ <strong>Telegram Bot Duyệt (HITL)</strong>.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn-primary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#FF6D5A', borderColor: '#FF6D5A', color: '#fff' }}
                          onClick={() => downloadTextFile(n8nJson, `n8n-workflow-${slugifyFileName(activeItem.useCaseTitle)}.json`, 'application/json')}
                          disabled={!activeItem.markdown}
                        >
                          📥 Tải n8n-workflow.json
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                          onClick={() => copyToClipboard(n8nJson, 'n8n Workflow JSON')}
                          disabled={!activeItem.markdown}
                        >
                          📋 Sao chép JSON (Dán Canvas)
                        </button>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(0,0,0,0.4)',
                      padding: '0.85rem 1rem',
                      borderRadius: 6,
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      color: 'var(--muted)'
                    }}>
                      <div style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>Cách đưa vào n8n chạy ngay (30 giây):</div>
                      <div>1. Mở n8n (trên web hoặc desktop) ➔ Bấm phím tắt <kbd style={{ background: '#333', padding: '1px 5px', borderRadius: 4 }}>Ctrl + V</kbd> (hoặc menu <em>Import from File...</em>).</div>
                      <div>2. Trong node <strong>Google Gemini Model</strong>, chọn Credential API Key của bạn.</div>
                      <div>3. Trong node <strong>Telegram</strong>, điền Bot Token &amp; Chat ID của bạn ➔ Gạt công tắc <strong>Active</strong>!</div>
                    </div>
                  </div>

                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 8,
                    padding: '1rem',
                    minHeight: 300,
                    maxHeight: 650,
                    overflow: 'auto',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    color: '#FFB199'
                  }}>
                    {n8nJson}
                  </pre>
                </div>
              )}

              {/* 3. CLAUDE CODE / CODEX / CURSOR RUNTIME TAB */}
              {activeRuntime === 'claudecode' && (
                <div>
                  <div style={{
                    background: 'rgba(124,92,255,0.06)',
                    border: '1px solid rgba(124,92,255,0.25)',
                    borderRadius: 8,
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <strong style={{ color: '#B8A4FF', fontSize: '1.05rem' }}>💻 Claude Code / Codex / Cursor Agentic Scaffold</strong>
                        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
                          Dành cho lập trình viên: Tự động khởi tạo cấu trúc code backend (FastAPI/Node.js) với guardrails, Zod validation và Human-in-the-loop.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn-primary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#7C5CFF', borderColor: '#7C5CFF', color: '#fff' }}
                          onClick={() => downloadTextFile(claudePkg.cursorRules, '.cursorrules')}
                          disabled={!activeItem.markdown}
                        >
                          📥 Tải .cursorrules
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                          onClick={() => copyToClipboard(claudePkg.cliCommand, 'Lệnh CLI Claude Code')}
                          disabled={!activeItem.markdown}
                        >
                          📋 Sao chép Lệnh CLI
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                          onClick={() => copyToClipboard(claudePkg.fullPrompt, 'Blueprint Kickoff Prompt')}
                          disabled={!activeItem.markdown}
                        >
                          📋 Sao chép Full Blueprint Prompt
                        </button>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(0,0,0,0.5)',
                      padding: '0.75rem 1rem',
                      borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'monospace',
                      fontSize: '0.84rem',
                      color: '#D4C4FB',
                      overflowX: 'auto'
                    }}>
                      {claudePkg.cliCommand}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', color: '#B8A4FF', marginBottom: '0.5rem' }}>Nội dung file .cursorrules đề xuất:</h3>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 8,
                    padding: '1rem',
                    minHeight: 240,
                    maxHeight: 500,
                    overflow: 'auto',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '0.86rem',
                    lineHeight: 1.6
                  }}>
                    {claudePkg.cursorRules}
                  </pre>
                </div>
              )}

              {/* 4. RAW MARKDOWN XML TAB */}
              {activeRuntime === 'markdown' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => copyToClipboard(activeItem.markdown, 'System Instruction')}
                      disabled={!activeItem.markdown}
                    >
                      📋 Copy Markdown
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => downloadTextFile(activeItem.markdown, `${activeItem.useCaseIndex}-${slugifyFileName(activeItem.useCaseTitle)}-system-instructions.md`)}
                      disabled={!activeItem.markdown}
                    >
                      📥 Download .md
                    </button>
                  </div>

                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 8,
                    padding: '1rem',
                    minHeight: 320,
                    maxHeight: 720,
                    overflow: 'auto',
                    color: activeItem.markdown ? 'var(--foreground)' : 'var(--muted)',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '0.88rem',
                    lineHeight: 1.6
                  }}>
                    {activeItem.markdown || 'System Instruction Markdown sẽ xuất hiện ở đây sau khi tạo.'}
                  </pre>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* HUMAN-IN-THE-LOOP CONSULTING CTA */}
      <ConsultingCta
        variant="si"
        source="day-9"
        defaultTopic="Đấu nối System Instruction & Hạ tầng Agent"
      />
    </div>
  )
}
