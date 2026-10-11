'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Compass,
  ArrowUp,
  Copy,
  Check
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const CONTEXT_GUIDES: Record<string, { title: string; subtitle: string; chips: string[] }> = {
  '/day-1': {
    title: 'Ngày 1: Khám Bệnh Doanh Nghiệp',
    subtitle: 'Tìm ra việc ngốn nhiều giờ nhất, hay làm sót nhất',
    chips: [
      'Khâu nào hay làm tốn thời gian nhất?',
      'Ví dụ các việc lặp lại hay làm mất thời gian',
      'Làm sao tính số giờ nhân viên bị lãng phí?'
    ]
  },
  '/day-2': {
    title: 'Ngày 2: Tính Tiền & Quỹ Lương',
    subtitle: 'Nhẩm chi phí lương, giá trị 1 giờ làm việc',
    chips: [
      'Cách nhẩm chi phí lương từng bộ phận?',
      'Khách hay bỏ đi vì những lý do gì?',
      'Tính giá trị 1 giờ làm việc của nhân sự'
    ]
  },
  '/day-3': {
    title: 'Ngày 3: Lắng Nghe Nhân Viên',
    subtitle: 'Xem nhân viên đang ức chế và vướng chỗ nào',
    chips: [
      'Nhân viên thường ức chế chuyện gì nhất?',
      'Làm sao biết sự thật ở văn phòng/xưởng?',
      'Cách thu hẹp khoảng cách giữa sếp và nhân viên'
    ]
  },
  '/day-4': {
    title: 'Ngày 4: Nhìn Lại Luồng Công Việc',
    subtitle: 'Từ lúc khách hỏi -> làm hàng -> giao hàng -> chăm sóc',
    chips: [
      'Khâu bán hàng và giao hàng hay bị nghẽn ở đâu?',
      'Làm sao để không bị sót việc, sót đơn?',
      'Khâu nào nhân viên làm sai là khách phàn nàn?'
    ]
  },
  '/day-5': {
    title: 'Ngày 5: Chọn Việc Dễ Làm Trước',
    subtitle: 'Làm cái gì nhanh ra kết quả, tránh tốn tiền vô ích',
    chips: [
      'Nên làm việc gì trước để thấy kết quả ngay?',
      'Làm sao tránh những thứ phức tạp tốn tiền?',
      'Chọn 3 việc cấp bách nhất cần làm'
    ]
  },
  '/day-6': {
    title: 'Ngày 6: Bài Toán Kinh Tế & Thu Hồi Vốn',
    subtitle: 'Tiết kiệm được mấy đồng, bao lâu thu hồi vốn',
    chips: [
      'Làm AI thì bao lâu thu hồi vốn?',
      'Cách tính số tiền tiết kiệm được mỗi tháng',
      'Chi phí đầu tư gồm những khoản nào?'
    ]
  },
  '/day-7': {
    title: 'Ngày 7: Kế Hoạch Từng Bước',
    subtitle: '30 ngày đầu làm gì để nhân viên quen dần',
    chips: [
      '30 ngày đầu nên bắt đầu từ việc gì?',
      'Làm sao để nhân viên không sợ AI cướp việc?',
      'Cách hướng dẫn nhân sự làm quen với AI'
    ]
  },
  '/day-8': {
    title: 'Ngày 8: Viết Yêu Cầu Giao Việc',
    subtitle: 'Mô tả rõ ràng để đưa cho đội IT làm đúng ý',
    chips: [
      'Cách viết yêu cầu để giao cho đội làm công nghệ',
      'Làm sao để người duyệt trước khi AI gửi đi?',
      'Những trường hợp AI bị sai cần phòng ngừa'
    ]
  },
  '/day-9': {
    title: 'Ngày 9: Kịch Bản Giao Việc Cho AI',
    subtitle: 'Đóng gói hướng dẫn chuẩn để máy chạy mượt mà',
    chips: [
      'Kịch bản giao việc cho AI chạy chuẩn',
      'Cách thử nghiệm xem AI làm đúng ý chưa',
      'Khi nào thì đưa vào chạy thực tế?'
    ]
  },
  '/results': {
    title: 'Báo Cáo Tổng Hợp Doanh Nghiệp',
    subtitle: 'Bức tranh toàn cảnh và các bước tiếp theo',
    chips: [
      'Giải thích các con số trong bản báo cáo?',
      'Bước tiếp theo sau khi làm xong bản đồ là gì?',
      'Tư vấn triển khai trọn gói cùng Striver AI'
    ]
  }
}

const DEFAULT_GUIDE = {
  title: 'Bản Đồ Hành Động AI Cho Doanh Nghiệp',
  subtitle: 'Đồng hành giúp bạn bớt việc chân tay, tiết kiệm chi phí',
  chips: [
    'Tôi chưa rành công nghệ, nên bắt đầu từ đâu?',
    'Công ty tôi có áp dụng được AI không?',
    'Khâu nào nên tự động hóa trước để đỡ mệt?'
  ]
}

export default function RaiChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentGuide = CONTEXT_GUIDES[pathname] || DEFAULT_GUIDE

  // Load chat history from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('rai_chat_history')
      if (saved) {
        setMessages(JSON.parse(saved))
      } else {
        const initialMsg: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Chào bạn! Tôi là **RAI** 🧭 — Trợ lý đồng hành cùng bạn làm Bản đồ Hành động AI cho doanh nghiệp.\n\nTôi ở đây để giúp bạn tìm ra những chỗ đang ngốn nhiều thời gian và tiền bạc nhất trong công ty để tự động hóa gọn gàng — bạn không cần biết về công nghệ hay AI, cứ chia sẻ như hai người làm kinh doanh với nhau nhé.\n\nHiện tại công ty bạn đang kinh doanh mảng gì, và khâu nào trong ngày làm bạn thấy mệt mỏi nhất?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages([initialMsg])
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, [])

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('rai_chat_history', JSON.stringify(messages))
      } catch {}
    }
  }, [messages])

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [isOpen])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat-rai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          currentPath: pathname
        })
      })

      if (!res.ok) {
        throw new Error('Lỗi kết nối tới máy chủ')
      }

      const data = await res.json()
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Xin lỗi, tôi chưa nhận được câu trả lời.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Không thể kết nối tới máy chủ tư vấn lúc này. Bạn vui lòng thử lại sau ít giây nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Bạn có muốn xóa cuộc trò chuyện và bắt đầu phiên tư vấn mới?')) {
      const initialMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Tôi đã làm mới phiên tư vấn. Chúng ta bắt đầu lại nhé! Bạn đang cần tôi hỗ trợ bước nào trong hành trình?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([initialMsg])
      sessionStorage.removeItem('rai_chat_history')
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const parseInlineStyles = (str: string) => {
    const parts: React.ReactNode[] = []
    let remaining = str
    let keyIdx = 0

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/)
      const codeMatch = remaining.match(/`(.*?)`/)

      const firstMatchIndex = Math.min(
        boldMatch && boldMatch.index !== undefined ? boldMatch.index : Infinity,
        codeMatch && codeMatch.index !== undefined ? codeMatch.index : Infinity
      )

      if (firstMatchIndex === Infinity) {
        parts.push(remaining)
        break
      }

      if (firstMatchIndex > 0) {
        parts.push(remaining.substring(0, firstMatchIndex))
      }

      if (boldMatch && boldMatch.index === firstMatchIndex) {
        parts.push(
          <strong key={keyIdx++} style={{ fontWeight: 600, color: '#ffffff' }}>
            {boldMatch[1]}
          </strong>
        )
        remaining = remaining.substring(firstMatchIndex + boldMatch[0].length)
      } else if (codeMatch && codeMatch.index === firstMatchIndex) {
        parts.push(
          <code
            key={keyIdx++}
            style={{
              padding: '2px 6px',
              margin: '0 3px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#6ee7b7',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}
          >
            {codeMatch[1]}
          </code>
        )
        remaining = remaining.substring(firstMatchIndex + codeMatch[0].length)
      }
    }

    return parts
  }

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} style={{ height: '8px' }} />
      }

      if (line.startsWith('### ')) {
        return (
          <p key={idx} style={{ fontWeight: 600, color: '#ffffff', marginTop: '8px', marginBottom: '4px', fontSize: '13.5px' }}>
            {line.replace('### ', '')}
          </p>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <p key={idx} style={{ fontWeight: 700, color: '#ffffff', marginTop: '10px', marginBottom: '4px', fontSize: '14.5px' }}>
            {line.replace('## ', '')}
          </p>
        )
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2)
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '2px 0', paddingLeft: '4px' }}>
            <span style={{ color: '#86868b', marginTop: '4px', fontSize: '10px' }}>•</span>
            <span style={{ flex: 1, fontSize: '13px', lineHeight: 1.55, color: '#f5f5f7' }}>{parseInlineStyles(content)}</span>
          </div>
        )
      }

      const numMatch = line.match(/^(\d+)\.\s+(.*)$/)
      if (numMatch) {
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '2px 0', paddingLeft: '4px' }}>
            <span style={{ color: '#86868b', fontSize: '12px', fontWeight: 500 }}>{numMatch[1]}.</span>
            <span style={{ flex: 1, fontSize: '13px', lineHeight: 1.55, color: '#f5f5f7' }}>{parseInlineStyles(numMatch[2])}</span>
          </div>
        )
      }

      return (
        <p key={idx} style={{ fontSize: '13px', lineHeight: 1.55, color: '#f5f5f7', margin: '2px 0' }}>
          {parseInlineStyles(line)}
        </p>
      )
    })
  }

  return (
    <>
      {/* ================= FIXED FLOATING LAUNCHER BUTTON ================= */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 18px 10px 14px',
              borderRadius: '999px',
              background: 'rgba(18, 18, 20, 0.92)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 16px 42px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            aria-label="Mở tư vấn cùng RAI"
          >
            {/* Iridescent Compass Icon container */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #34d399)',
                padding: '2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#0a0a0c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Compass style={{ width: '18px', height: '18px', color: '#6ee7b7' }} />
              </div>

              {/* Pulsing Emerald Dot */}
              <span
                style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #000000',
                  boxShadow: '0 0 8px #10b981'
                }}
              />
            </div>

            {/* Label */}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  Hỏi RAI
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(52, 211, 153, 0.3)'
                  }}
                >
                  AI Consultant
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#86868b', lineHeight: 1.2, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentGuide.title.split(':')[0]}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* ================= FIXED FROSTED GLASS CHAT WINDOW ================= */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999999,
            width: 'calc(100vw - 32px)',
            maxWidth: '420px',
            height: '82vh',
            maxHeight: '640px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            background: 'rgba(18, 18, 20, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            overflow: 'hidden',
            fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7, #34d399)',
                  padding: '2px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#0a0a0c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Compass style={{ width: '18px', height: '18px', color: '#6ee7b7' }} />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid #121214'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', margin: 0 }}>RAI</h3>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Consultant
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#86868b', margin: 0, lineHeight: 1.2 }}>
                  Đồng hành chẩn đoán 9 Ngày
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={handleReset}
                title="Làm mới cuộc trò chuyện"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#86868b',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw style={{ width: '15px', height: '15px' }} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#86868b',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          {/* Context pill banner */}
          <div
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.08), transparent)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#34d399',
                display: 'inline-block',
                boxShadow: '0 0 6px #34d399'
              }}
            />
            <div style={{ flex: 1, fontSize: '11px', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentGuide.title}</strong>
              <span style={{ color: '#71717a', marginLeft: '6px' }}>({currentGuide.subtitle})</span>
            </div>
          </div>

          {/* Messages scroll container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant'
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAssistant ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{ maxWidth: '88%' }}>
                    {/* Message Bubble */}
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: isAssistant ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        fontSize: '13px',
                        background: isAssistant ? 'rgba(28, 28, 32, 0.95)' : 'linear-gradient(135deg, #38383e, #28282c)',
                        color: '#f5f5f7',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      {renderFormattedText(m.content)}

                      {/* Copy action */}
                      {isAssistant && m.id !== 'welcome' && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '6px',
                            paddingTop: '4px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                        >
                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '10px',
                              color: '#71717a',
                              cursor: 'pointer'
                            }}
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check style={{ width: '12px', height: '12px', color: '#34d399' }} />
                                <span style={{ color: '#34d399' }}>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy style={{ width: '12px', height: '12px' }} />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <span style={{ fontSize: '10px', color: '#71717a', marginTop: '3px', padding: '0 4px' }}>
                    {m.timestamp}
                  </span>
                </div>
              )
            })}

            {/* Loading typing indicator */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(28, 28, 32, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  width: 'fit-content'
                }}
              >
                <Sparkles style={{ width: '14px', height: '14px', color: '#34d399' }} />
                <span style={{ fontSize: '11px', color: '#86868b' }}>RAI đang suy nghĩ...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips bar */}
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(255, 255, 255, 0.01)'
            }}
          >
            <p
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#71717a',
                margin: '0 0 6px 4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles style={{ width: '10px', height: '10px', color: '#34d399' }} />
              Gợi ý câu hỏi nhanh:
            </p>
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}
            >
              {currentGuide.chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  disabled={isLoading}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    color: '#d4d4d8',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            style={{
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.45)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi RAI về Ngày chẩn đoán, PRD, ROI..."
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '13px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  position: 'absolute',
                  right: '6px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                  opacity: input.trim() && !isLoading ? 1 : 0.25,
                  transition: 'opacity 0.2s'
                }}
              >
                <ArrowUp style={{ width: '15px', height: '15px', strokeWidth: 2.5 }} />
              </button>
            </div>
            <p style={{ fontSize: '10px', textAlign: 'center', color: '#52525b', margin: '6px 0 0 0' }}>
              RAI tư vấn dựa trên cấu trúc chuẩn của hệ thống Striver
            </p>
          </form>
        </div>
      )}
    </>
  )
}
