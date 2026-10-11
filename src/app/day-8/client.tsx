'use client'

import { useEffect, useMemo, useState } from 'react'
import { slugifyFileName, type PrdItem, type PrdUseCase } from '@/lib/prd'
import { evaluatePrdQuality } from '@/lib/prdRubric'
import ConsultingCta from '@/components/ConsultingCta'

type Mode = 'system' | 'custom'

type Props = {
  useCases: PrdUseCase[]
  initialPrds: PrdItem[]
  initialCustomPrds: PrdItem[]
  initialMode: Mode
  isConfigured: boolean
}

function isCustomItemValid(item: PrdItem) {
  return item.useCaseTitle.trim().length > 0 && item.sourceProblem.trim().length > 0 && item.manualWorkflow.trim().length > 0
}

export default function Day8Client({ useCases, initialPrds, initialCustomPrds, initialMode, isConfigured }: Props) {
  const hasSystemUseCases = useCases.length >= 1
  const [mode, setMode] = useState<Mode>(initialMode === 'custom' || !hasSystemUseCases ? 'custom' : 'system')
  const [systemItems, setSystemItems] = useState<PrdItem[]>(initialPrds)
  const [customItems, setCustomItems] = useState<PrdItem[]>(initialCustomPrds)
  const [activeIndex, setActiveIndex] = useState(initialPrds[0]?.useCaseIndex || 1)
  const [loading, setLoading] = useState<number | 'all' | null>(null)
  const [error, setError] = useState('')

  const items = mode === 'system' ? systemItems : customItems
  const setItems = mode === 'system' ? setSystemItems : setCustomItems
  const activeItem = items.find(item => item.useCaseIndex === activeIndex) || items[0]
  const validCustomItems = useMemo(() => customItems.filter(isCustomItemValid), [customItems])
  const rubric = useMemo(() => (activeItem?.markdown ? evaluatePrdQuality(activeItem.markdown) : null), [activeItem?.markdown])
  const hasGeneratingItem = items.some(item => item.status === 'generating')
  const activeItemIsGenerating = activeItem?.status === 'generating'
  const canGenerateAll = mode === 'system'
    ? items.length >= 1 && items.every(item => item.manualWorkflow.trim().length > 0)
    : validCustomItems.length > 0
  const canGenerateSelected = mode === 'system'
    ? Boolean(activeItem?.manualWorkflow.trim())
    : Boolean(activeItem && isCustomItemValid(activeItem))

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode)
    setError('')
    setLoading(null)
    const nextItems = nextMode === 'system' ? systemItems : customItems
    setActiveIndex(nextItems[0]?.useCaseIndex || 1)
  }

  const updateItem = (useCaseIndex: number, patch: Partial<PrdItem>) => {
    setItems(prev => prev.map(item => item.useCaseIndex === useCaseIndex ? { ...item, ...patch } : item))
  }

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
        const res = await fetch(`/api/prd/generate?mode=${mode}`, { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || stopped) return

        const nextItems = data.prdData as PrdItem[]
        if (nextItems[0]?.sourceType === 'custom') setCustomItems(nextItems)
        else setSystemItems(nextItems)

        const targetItems = nextItems.filter(item => targetIndexes.includes(item.useCaseIndex))
        const stillGenerating = targetItems.some(item => item.status === 'generating')
        const hasFinished = targetItems.some(item => item.status === 'completed' || item.status === 'failed')
        if (hasFinished && !stillGenerating) setLoading(null)
      } catch {
        // Polling is best effort; the submit request still owns the final error.
      }
    }

    const interval = window.setInterval(poll, 5000)
    poll()

    return () => {
      stopped = true
      window.clearInterval(interval)
    }
  }, [loading, hasGeneratingItem, items, mode])

  const generate = async (useCaseIndex?: number) => {
    const targetItems = mode === 'custom'
      ? useCaseIndex ? customItems.filter(item => item.useCaseIndex === useCaseIndex && isCustomItemValid(item)) : validCustomItems
      : useCaseIndex ? systemItems.filter(item => item.useCaseIndex === useCaseIndex) : systemItems

    if (targetItems.length === 0) {
      setError(mode === 'custom'
        ? 'Vui lòng nhập đủ tên use-case, vấn đề và luồng thủ công trước khi tạo PRD.'
        : 'Vui lòng nhập mô tả luồng thủ công trước khi tạo PRD.')
      return
    }

    setLoading(useCaseIndex || 'all')
    setError('')
    const targetIndexes = targetItems.map(item => item.useCaseIndex)
    setItems(prev => prev.map(item => targetIndexes.includes(item.useCaseIndex)
      ? { ...item, status: 'generating', errorMessage: null }
      : item
    ))

    try {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 210000)
      const res = await fetch('/api/prd/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          mode,
          ...(useCaseIndex ? { useCaseIndex } : {}),
          customUseCases: mode === 'custom' ? customItems : undefined,
          manualWorkflows: Object.fromEntries(items.map(item => [String(item.useCaseIndex), item.manualWorkflow]))
        })
      })
      window.clearTimeout(timeout)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Không thể tạo PRD.')
      if (mode === 'custom') setCustomItems(data.prdData)
      else setSystemItems(data.prdData)
      if (useCaseIndex) setActiveIndex(useCaseIndex)
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setError('Yêu cầu tạo PRD vẫn đang xử lý trên máy chủ. Trang sẽ tự cập nhật khi PRD hoàn tất.')
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
    link.download = `${activeItem.useCaseIndex}-${slugifyFileName(activeItem.useCaseTitle)}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: 1200 }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>Ngày 8: PRD Triển Khai AI</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 780, margin: '0 auto' }}>
          Tạo PRD từ 3 use-case hệ thống đề xuất, hoặc nhập trực tiếp use-case AI mới nằm ngoài hành trình 1-7.
        </p>
      </header>

      {!isConfigured && (
        <div className="glass-panel" style={{ border: '1px solid var(--warning)', marginBottom: '2rem' }}>
          <strong style={{ color: 'var(--warning)' }}>Chưa cấu hình PRD Agent.</strong>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Máy chủ cần có GEMINI_API_KEY trước khi tạo PRD.</p>
        </div>
      )}

      <section className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className={mode === 'system' ? 'btn-primary' : 'btn-secondary'} onClick={() => switchMode('system')}>
            Use-case hệ thống đề xuất
          </button>
          <button className={mode === 'custom' ? 'btn-primary' : 'btn-secondary'} onClick={() => switchMode('custom')}>
            Tự nhập use-case AI
          </button>
        </div>
        {!hasSystemUseCases && mode === 'custom' && (
          <p style={{ color: 'var(--warning)', marginTop: '1rem', textAlign: 'center' }}>
            Chưa đủ dữ liệu Ngày 5/6/7, nên hệ thống đang mở chế độ tự nhập use-case để tạo PRD trực tiếp.
          </p>
        )}
      </section>

      {mode === 'system' && !hasSystemUseCases ? (
        <section className="glass-panel" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Chưa có use-case từ hệ thống đề xuất</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 760, margin: '0 auto', lineHeight: 1.6 }}>
            Chế độ này cần dữ liệu Ngày 5, Ngày 6 và Ngày 7 để lấy use-case ưu tiên từ hành trình hệ thống. Nếu khách đã có use-case riêng, hãy chuyển sang tab “Tự nhập use-case AI”.
          </p>
        </section>
      ) : (
      <section className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--success)' }}>
          {mode === 'system' ? `${items.length} use-case hệ thống sẽ được tạo PRD` : 'Nhập 1-3 use-case AI tùy chỉnh'}
        </h2>
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
              <div style={{ fontWeight: 700, overflowWrap: 'anywhere', lineHeight: 1.4 }}>{item.useCaseTitle || 'Chưa nhập tên use-case'}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 8 }}>Trạng thái: {item.status}</div>
            </button>
          ))}
        </div>
      </section>
      )}

      {activeItem && (
        <section className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
            {mode === 'custom' ? `Thông tin use-case #${activeItem.useCaseIndex}` : `Mô tả luồng thủ công cho use-case #${activeItem.useCaseIndex}`}
          </h2>

          {mode === 'custom' && (
            <div style={{ display: 'grid', gap: '0.85rem', marginBottom: '1rem' }}>
              <input
                value={activeItem.useCaseTitle}
                onChange={event => updateItem(activeItem.useCaseIndex, { useCaseTitle: event.target.value, sourceSolution: event.target.value, sourceType: 'custom' })}
                placeholder="Tên use-case AI, ví dụ: Tự động tư vấn khách hàng Zalo"
                style={inputStyle}
              />
              <textarea
                value={activeItem.sourceProblem}
                onChange={event => updateItem(activeItem.useCaseIndex, { sourceProblem: event.target.value, sourceType: 'custom' })}
                placeholder="Vấn đề hiện tại cần giải quyết"
                style={{ ...inputStyle, minHeight: 92, resize: 'vertical' }}
              />
              <textarea
                value={activeItem.sourceSolution}
                onChange={event => updateItem(activeItem.useCaseIndex, { sourceSolution: event.target.value, sourceType: 'custom' })}
                placeholder="Giải pháp AI mong muốn"
                style={{ ...inputStyle, minHeight: 92, resize: 'vertical' }}
              />
            </div>
          )}

          <p style={{ color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Hãy mô tả chi tiết các luồng, các bước công việc thực tế nếu làm thủ công. PRD sẽ dùng phần mô tả này làm dữ liệu đầu vào chính để thiết kế workflow, Agent, schema, điểm duyệt con người và các đường lỗi.
          </p>
          <textarea
            value={activeItem.manualWorkflow}
            onChange={event => updateItem(activeItem.useCaseIndex, { manualWorkflow: event.target.value, sourceType: mode })}
            placeholder="Ví dụ: Nhân sự nhận yêu cầu qua Zalo/email, kiểm tra thông tin khách trong Google Sheet, phân loại nhu cầu, hỏi lại nếu thiếu dữ liệu, tạo báo giá, gửi trưởng nhóm duyệt, sau đó phản hồi khách hàng..."
            style={{ ...inputStyle, minHeight: 220, resize: 'vertical' }}
          />
          <p style={{ color: canGenerateSelected ? 'var(--success)' : 'var(--warning)', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            {canGenerateSelected ? 'Đã đủ dữ liệu tối thiểu cho use-case này.' : 'Cần nhập đủ dữ liệu tối thiểu trước khi tạo PRD cho use-case này.'}
          </p>
        </section>
      )}

      <section className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="btn-primary" onClick={() => generate()} disabled={!isConfigured || loading !== null || hasGeneratingItem || !canGenerateAll}>
            {loading === 'all' ? 'Đang tạo PRD...' : mode === 'custom' ? `Tạo PRD cho ${validCustomItems.length || 0} use-case` : 'Tạo 3 PRD'}
          </button>
          {activeItem && (
            <button className="btn-secondary" onClick={() => generate(activeItem.useCaseIndex)} disabled={!isConfigured || loading !== null || activeItemIsGenerating || !canGenerateSelected}>
              {loading === activeItem.useCaseIndex || activeItemIsGenerating ? 'Đang tạo lại...' : 'Tạo lại PRD đang chọn'}
            </button>
          )}
        </div>
        {error && <p style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
      </section>

      {activeItem && (
        <section className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>PRD #{activeItem.useCaseIndex}: {activeItem.useCaseTitle || 'Chưa nhập tên use-case'}</h2>
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
            <div style={{ color: 'var(--error)', padding: '1rem', border: '1px solid var(--error)', borderRadius: 8, marginBottom: '1rem' }}>{activeItem.errorMessage}</div>
          )}

          {/* PRD QUALITY RUBRIC CARD */}
          {rubric && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: `4px solid ${rubric.gradeColor}`,
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kết Quả Thẩm Định Kỹ Thuật (Enterprise Rubric)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: rubric.gradeColor }}>
                      {rubric.totalScore}/100
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${rubric.gradeColor}`,
                      color: rubric.gradeColor
                    }}>
                      {rubric.grade}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'right' }}>
                  Tiêu chuẩn: <strong style={{ color: 'var(--foreground)' }}>Architect Multi-Agent 2026</strong>
                </div>
              </div>

              {/* 4 Rubric Dimensions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                {Object.values(rubric.rubrics).map((r) => (
                  <div key={r.id} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--muted)' }}>{r.title}</span>
                      <strong style={{ color: r.status === 'pass' ? 'var(--success)' : r.status === 'warn' ? '#f5a623' : 'var(--error)' }}>
                        {r.score}/{r.maxScore}đ
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#8e8e93', lineHeight: 1.4 }}>
                      {r.details}
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths & Improvements */}
              {rubric.strengths.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--success)', display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                  <span>✓</span>
                  <span><strong>Điểm mạnh:</strong> {rubric.strengths.join(' ')}</span>
                </div>
              )}
              {rubric.improvements.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#f5a623', display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '0.25rem' }}>
                  <span>⚡</span>
                  <span><strong>Cần lưu ý khi triển khai:</strong> {rubric.improvements.join(' ')}</span>
                </div>
              )}
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

          {activeItem.markdown && (
            <div style={{
              background: 'rgba(50,215,75,0.06)',
              border: '1px solid rgba(50,215,75,0.2)',
              borderRadius: 8,
              padding: '1.25rem',
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <strong style={{ color: 'var(--success)', fontSize: '1rem' }}>✓ PRD đã hoàn tất &amp; sẵn sàng triển khai!</strong>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
                  Tiếp tục sang Ngày 9 để tạo System Instruction XML và xuất trọn bộ runtime cho GoClaw.sh, n8n Workflow, Claude Code.
                </p>
              </div>
              <a
                href="/day-9"
                className="btn-primary"
                style={{ textDecoration: 'none', padding: '0.6rem 1.25rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <span>Sang Ngày 9: System Instruction &amp; Runtimes</span>
                <span>➔</span>
              </a>
            </div>
          )}
        </section>
      )}

      {/* HUMAN-IN-THE-LOOP CONSULTING CTA */}
      <ConsultingCta
        variant="prd"
        source="day-8"
        defaultTopic="Triển khai Trọn gói Multi-Agent theo PRD"
      />
    </div>
  )
}

const inputStyle = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid var(--card-border)',
  background: 'rgba(0,0,0,0.28)',
  color: 'var(--foreground)',
  padding: '0.9rem 1rem',
  lineHeight: 1.6,
  fontSize: '1rem',
  outline: 'none'
} as const
