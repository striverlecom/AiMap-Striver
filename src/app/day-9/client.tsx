'use client'

import { useEffect, useState } from 'react'
import { slugifyFileName } from '@/lib/prd'
import type { SiItem } from '@/lib/systemInstruction'

type Props = {
  prdCount: number
  initialItems: SiItem[]
  isConfigured: boolean
}

const SI_SECTIONS = [
  'Danh sách Agent sẽ đặc tả',
  'Header: [Số thứ tự]. [Tên Agent tiếng Việt]',
  '```xml code fence cho từng Agent',
  '<role>',
  '<context> + Input JSON Schema',
  '<instructions> + Output JSON Schema',
  '<criteria> có ngưỡng đo lường',
  '<examples> happy path + edge case'
]

export default function Day9Client({ prdCount, initialItems, isConfigured }: Props) {
  const [items, setItems] = useState<SiItem[]>(initialItems)
  const [activeIndex, setActiveIndex] = useState(initialItems[0]?.useCaseIndex || 1)
  const [loading, setLoading] = useState<number | 'all' | null>(null)
  const [error, setError] = useState('')

  const activeItem = items.find(item => item.useCaseIndex === activeIndex) || items[0]
  const hasEnoughPrds = prdCount === 3
  const hasGeneratingItem = items.some(item => item.status === 'generating')
  const activeItemIsGenerating = activeItem?.status === 'generating'

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

  const copyMarkdown = async () => {
    if (!activeItem?.markdown) return
    await navigator.clipboard.writeText(activeItem.markdown)
  }

  const downloadMarkdown = () => {
    if (!activeItem?.markdown) return
    const blob = new Blob([activeItem.markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeItem.useCaseIndex}-${slugifyFileName(activeItem.useCaseTitle)}-system-instructions.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: 1200 }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>Ngày 9: System Instruction</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 800, margin: '0 auto' }}>
          Chuyển 3 PRD từ Ngày 8 thành System Instruction XML production-ready cho từng Agent bên trong từng use-case AI.
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
          <h2 style={{ marginBottom: '1rem' }}>Chưa đủ 3 PRD completed từ Ngày 8</h2>
          <p style={{ color: 'var(--muted)' }}>Vui lòng quay lại Ngày 8 và tạo đủ 3 PRD trước khi sang Ngày 9.</p>
        </div>
      ) : (
        <>
          <section className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--success)' }}>3 use-case sẽ được tạo System Instruction</h2>
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
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 8 }}>Trạng thái: {item.status}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Các phần System Instruction sẽ triển khai</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {SI_SECTIONS.map(section => (
                <div key={section} style={{ padding: '0.75rem', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--muted)' }}>{section}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => generate()} disabled={!isConfigured || loading !== null || hasGeneratingItem}>
                {loading === 'all' ? 'Đang tạo 3 bộ SI...' : 'Tạo System Instruction cho 3 PRD'}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>System Instruction #{activeItem.useCaseIndex}: {activeItem.useCaseTitle}</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {activeItem.generatedAt ? `Tạo lúc ${new Date(activeItem.generatedAt).toLocaleString('vi-VN')}` : 'Chưa tạo System Instruction'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" onClick={copyMarkdown} disabled={!activeItem.markdown}>Copy</button>
                  <button className="btn-secondary" onClick={downloadMarkdown} disabled={!activeItem.markdown}>Download .md</button>
                </div>
              </div>

              {activeItem.errorMessage && (
                <div style={{ color: 'var(--error)', padding: '1rem', border: '1px solid var(--error)', borderRadius: 8, marginBottom: '1rem' }}>{activeItem.errorMessage}</div>
              )}

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
            </section>
          )}
        </>
      )}
    </div>
  )
}
