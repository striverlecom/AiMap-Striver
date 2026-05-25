'use client'

import { useState } from 'react'
import { slugifyFileName, type PrdItem, type PrdUseCase } from '@/lib/prd'

const PRD_SECTIONS = [
  'Thẻ điều hành',
  'Ngữ cảnh người dùng',
  'Kiến trúc quy trình',
  'Data Workflow JSON',
  'Data Flow Map',
  'Concrete Example',
  'Đặc tả Agent theo RCICE',
  'INPUT SCHEMA và OUTPUT SCHEMA cho từng Agent',
  'Knowledge Base Strategy',
  'Integration & Technical Requirements',
  'Human-in-the-loop & Failure Paths',
  'Evaluation Framework',
  'Roadmap & Risks',
  'Open Questions/TODO'
]

type Props = {
  useCases: PrdUseCase[]
  initialPrds: PrdItem[]
  isConfigured: boolean
}

export default function Day8Client({ useCases, initialPrds, isConfigured }: Props) {
  const [items, setItems] = useState<PrdItem[]>(initialPrds)
  const [activeIndex, setActiveIndex] = useState(initialPrds[0]?.useCaseIndex || 1)
  const [loading, setLoading] = useState<number | 'all' | null>(null)
  const [error, setError] = useState('')
  const activeItem = items.find(item => item.useCaseIndex === activeIndex) || items[0]
  const hasEnoughUseCases = useCases.length === 3

  const generate = async (useCaseIndex?: number) => {
    setLoading(useCaseIndex || 'all')
    setError('')

    try {
      const res = await fetch('/api/prd/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useCaseIndex ? { useCaseIndex } : {})
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Không thể tạo PRD.')
      setItems(data.prdData)
      if (useCaseIndex) setActiveIndex(useCaseIndex)
    } catch (err: any) {
      setError(err.message)
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
    link.download = `${activeItem.useCaseIndex}-${slugifyFileName(activeItem.useCaseTitle)}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: 1200 }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>Ngày 8: PRD Triển Khai AI</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 760, margin: '0 auto' }}>
          Chuyển 3 chiến thắng nhỏ AI thành 3 bản PRD Markdown đủ chi tiết để đội triển khai có thể bắt tay vào xây dựng.
        </p>
      </header>

      {!isConfigured && (
        <div className="glass-panel" style={{ border: '1px solid var(--warning)', marginBottom: '2rem' }}>
          <strong style={{ color: 'var(--warning)' }}>Chưa cấu hình OpenAI PRD Agent.</strong>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>
            Máy chủ cần có OPENAI_API_KEY và OPENAI_PRD_VECTOR_STORE_ID trước khi tạo PRD.
          </p>
        </div>
      )}

      {!hasEnoughUseCases ? (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Chưa đủ 3 use-case AI</h2>
          <p style={{ color: 'var(--muted)' }}>
            Vui lòng quay lại Ngày 5 để chọn đủ 3 giải pháp Top 3, sau đó hoàn tất Ngày 6 và Ngày 7.
          </p>
        </div>
      ) : (
        <>
          <section className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--success)' }}>3 use-case sẽ được tạo PRD</h2>
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
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Các phần PRD sẽ triển khai</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {PRD_SECTIONS.map(section => (
                <div key={section} style={{ padding: '0.75rem', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--muted)' }}>
                  {section}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => generate()} disabled={!isConfigured || loading !== null}>
                {loading === 'all' ? 'Đang tạo 3 PRD...' : 'Tạo 3 PRD'}
              </button>
              {activeItem && (
                <button className="btn-secondary" onClick={() => generate(activeItem.useCaseIndex)} disabled={!isConfigured || loading !== null}>
                  {loading === activeItem.useCaseIndex ? 'Đang tạo lại...' : 'Tạo lại PRD đang chọn'}
                </button>
              )}
            </div>
            {error && <p style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          </section>

          {activeItem && (
            <section className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>PRD #{activeItem.useCaseIndex}: {activeItem.useCaseTitle}</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {activeItem.generatedAt ? `Tạo lúc ${new Date(activeItem.generatedAt).toLocaleString('vi-VN')}` : 'Chưa tạo PRD'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" onClick={copyMarkdown} disabled={!activeItem.markdown}>Copy</button>
                  <button className="btn-secondary" onClick={downloadMarkdown} disabled={!activeItem.markdown}>Download .md</button>
                </div>
              </div>

              {activeItem.errorMessage && (
                <div style={{ color: 'var(--error)', padding: '1rem', border: '1px solid var(--error)', borderRadius: 8, marginBottom: '1rem' }}>
                  {activeItem.errorMessage}
                </div>
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
                {activeItem.markdown || 'PRD Markdown sẽ xuất hiện ở đây sau khi tạo.'}
              </pre>
            </section>
          )}
        </>
      )}
    </div>
  )
}

