'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  MessageSquare,
  X,
  Send,
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
    title: 'Ngày 1: Sự Thật & Khám Sức Khỏe',
    subtitle: 'Bóc tách Top 3 vấn đề, đo số giờ lãng phí',
    chips: [
      'Làm sao tính số giờ lãng phí chuẩn xác?',
      'Gợi ý Top 3 vấn đề cho ngành Agency?',
      'Thang điểm 1-5 tự chấm như thế nào?'
    ]
  },
  '/day-2': {
    title: 'Ngày 2: Tài Chính & Quy Mô',
    subtitle: 'Quỹ lương phòng ban, doanh thu & metrics',
    chips: [
      'Cách điền quỹ lương để tính ROI chuẩn?',
      'Cách tính tỷ lệ khách hàng rời bỏ (Churn)?',
      'Gợi ý trả lời 4 câu hỏi định tính'
    ]
  },
  '/day-3': {
    title: 'Ngày 3: Phỏng Vấn Sâu',
    subtitle: 'Góc nhìn Lãnh đạo vs Nhân viên thực thi',
    chips: [
      'Nên hỏi nhân viên thực thi những câu gì?',
      'Cách rút ra 5 phát hiện cốt lõi (Findings)?',
      'Làm sao thu hẹp khoảng cách giữa sếp và nhân viên?'
    ]
  },
  '/day-4': {
    title: 'Ngày 4: Chuỗi Giá Trị 3 Động Cơ',
    subtitle: 'Acquisition, Delivery & Support Mapping',
    chips: [
      'Giải thích nguyên lý 3 Động cơ trong Striver?',
      'Quy trình mẫu chuỗi giá trị cho Bán lẻ?',
      'Cách xác định bước nào là rủi ro chất lượng?'
    ]
  },
  '/day-5': {
    title: 'Ngày 5: Ma Trận Ưu Tiên Use-Case',
    subtitle: 'Impact vs Effort & Lựa chọn Top 3',
    chips: [
      'Tiêu chí chấm điểm Impact và Effort?',
      'Quick Wins khác gì Strategic Bets?',
      'Làm sao chọn Top 3 giải pháp thực chiến nhất?'
    ]
  },
  '/day-6': {
    title: 'Ngày 6: Bài Toán Tài Chính & ROI',
    subtitle: 'Thời gian hoàn vốn Payback & Lợi nhuận ròng',
    chips: [
      'Công thức tính ROI hoàn vốn trong Striver?',
      'Chi phí đầu tư AI gồm những khoản nào?',
      'Thời gian hoàn vốn bao lâu là tốt?'
    ]
  },
  '/day-7': {
    title: 'Ngày 7: Lộ Trình 30-60-90 Ngày',
    subtitle: 'Roadmap hành động & Quản trị thay đổi',
    chips: [
      'Phase 1 (30 ngày đầu) nên bắt đầu từ đâu?',
      'Làm sao để nhân viên không sợ bị AI thay thế?',
      'Khi nào nên chuyển sang tự động hóa cấp L2?'
    ]
  },
  '/day-8': {
    title: 'Ngày 8: Soạn Thảo PRD Enterprise',
    subtitle: '14 mục bắt buộc, Rubric thẩm định 80đ',
    chips: [
      '14 mục bắt buộc trong PRD Ngày 8 là gì?',
      'Làm sao để PRD đạt trên 80 điểm Rubric?',
      'Phân biệt Autonomy Tier L0, L1, L2, L3?'
    ]
  },
  '/day-9': {
    title: 'Ngày 9: Thiết Kế System Instruction',
    subtitle: 'XML 5 thẻ: role, context, instructions, criteria, examples',
    chips: [
      'Cấu trúc XML 5 thẻ của System Instruction?',
      'Viết mẫu System Instruction cho 1 Agent?',
      'Happy path và Edge case cần có gì?'
    ]
  },
  '/results': {
    title: 'Báo Cáo Tổng Hợp Bản Đồ',
    subtitle: 'Đánh giá mức độ sẵn sàng toàn diện',
    chips: [
      'Giải thích các chỉ số trong bản báo cáo?',
      'Bước tiếp theo sau khi hoàn thành là gì?',
      'Tư vấn triển khai trọn gói cùng Striver AI'
    ]
  }
}

const DEFAULT_GUIDE = {
  title: 'Bản Đồ Hành Động AI Cho Doanh Nghiệp',
  subtitle: 'Đồng hành cùng bạn hoàn tất 9 ngày chẩn đoán',
  chips: [
    'Tôi là người mới, nên bắt đầu từ đâu?',
    'Hành trình 9 Ngày của Striver hoạt động thế nào?',
    'AI có thể giúp gì cho ngành của tôi?'
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
        // Initial greeting
        const initialMsg: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Xin chào! Tôi là **RAI** — Chuyên gia Tư vấn Cấp cao về Trí tuệ Nhân tạo & Kiến trúc sư Multi-Agent của hệ thống **AiMap-Striver**.\n\nTôi ở đây để đồng hành 1:1, giúp bạn tháo gỡ mọi vướng mắc và hoàn thành trọn vẹn **9 Ngày Chẩn đoán AI**.\n\nBạn đang làm đến phần nào, hoặc cần tôi hỗ trợ bước nào hôm nay?`,
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

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
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
    } catch (err: any) {
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

  // Apple-style formatting helper
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />
      }

      // Headers (e.g. ### Header)
      if (line.startsWith('### ')) {
        return <p key={idx} className="font-semibold text-white mt-2 mb-1 text-[13.5px]">{line.replace('### ', '')}</p>
      }
      if (line.startsWith('## ')) {
        return <p key={idx} className="font-bold text-white mt-2.5 mb-1 text-[14.5px]">{line.replace('## ', '')}</p>
      }

      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2)
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-1">
            <span className="text-[#86868b] mt-1 text-[10px]">•</span>
            <span className="flex-1 text-[13px] leading-relaxed text-[#f5f5f7]">{parseInlineStyles(content)}</span>
          </div>
        )
      }

      // Numbered list
      const numMatch = line.match(/^(\d+)\.\s+(.*)$/)
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-1">
            <span className="text-[#86868b] text-[12px] font-medium">{numMatch[1]}.</span>
            <span className="flex-1 text-[13px] leading-relaxed text-[#f5f5f7]">{parseInlineStyles(numMatch[2])}</span>
          </div>
        )
      }

      // Regular line
      return (
        <p key={idx} className="text-[13px] leading-relaxed text-[#f5f5f7] my-0.5">
          {parseInlineStyles(line)}
        </p>
      )
    })
  }

  const parseInlineStyles = (str: string) => {
    const parts: React.ReactNode[] = []
    let remaining = str
    let keyIdx = 0

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/)
      // Code `code`
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
          <strong key={keyIdx++} className="font-semibold text-white">
            {boldMatch[1]}
          </strong>
        )
        remaining = remaining.substring(firstMatchIndex + boldMatch[0].length)
      } else if (codeMatch && codeMatch.index === firstMatchIndex) {
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-white/10 text-emerald-300 font-mono text-[11px]"
          >
            {codeMatch[1]}
          </code>
        )
        remaining = remaining.substring(firstMatchIndex + codeMatch[0].length)
      }
    }

    return parts
  }

  return (
    <>
      {/* ================= APPLE-STYLE LAUNCHER BUTTON ================= */}
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-full bg-[#121214]/90 hover:bg-[#1c1c20] text-white border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              boxShadow: '0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)'
            }}
            aria-label="Mở tư vấn cùng RAI"
          >
            {/* Compass Icon with iridescent gradient */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-sm">
              <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center">
                <Compass className="w-4 h-4 text-emerald-300 animate-spin-slow" />
              </div>
              {/* Online pulsing green dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-black"></span>
              </span>
            </div>

            {/* Label */}
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold tracking-tight text-white flex items-center gap-1.5">
                Hỏi RAI <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-emerald-300 font-normal">AI Consultant</span>
              </span>
              <span className="text-[11px] text-[#86868b] leading-tight line-clamp-1 max-w-[150px]">
                {currentGuide.title.split(':')[0]}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* ================= CHAT WINDOW (FROSTED GLASS MODAL) ================= */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-[9999] w-[92vw] sm:w-[420px] h-[85vh] sm:h-[620px] max-h-[720px] flex flex-col rounded-[26px] bg-[#121214]/88 border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{
            boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center">
                  <Compass className="w-4.5 h-4.5 text-emerald-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#121214]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[14px] font-semibold text-white tracking-tight">RAI</h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Consultant
                  </span>
                </div>
                <p className="text-[11px] text-[#86868b] line-clamp-1">
                  Đồng hành chẩn đoán 9 Ngày
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Làm mới cuộc trò chuyện"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context pill alert */}
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border-b border-white/5 flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex-1 text-[11px] text-[#a1a1aa] line-clamp-1">
              <strong className="text-white font-medium">{currentGuide.title}</strong>
              <span className="text-[#71717a] ml-1.5">({currentGuide.subtitle})</span>
            </div>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 custom-scrollbar">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant'
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-end gap-1.5 max-w-[88%] group">
                    {/* Bubble */}
                    <div
                      className={`relative px-3.5 py-2.5 rounded-[18px] text-[13px] ${
                        isAssistant
                          ? 'bg-[#1c1c20]/95 text-[#f5f5f7] border border-white/10 rounded-bl-sm shadow-sm'
                          : 'bg-gradient-to-r from-neutral-800 to-neutral-700 text-white rounded-br-sm border border-white/10 shadow-sm'
                      }`}
                    >
                      {renderFormattedText(m.content)}

                      {/* Assistant copy action button */}
                      {isAssistant && m.id !== 'welcome' && (
                        <div className="flex justify-end mt-1 pt-1 border-t border-white/5">
                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            className="flex items-center gap-1 text-[10px] text-[#71717a] hover:text-white transition-colors"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-[#71717a] mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              )
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-center gap-1.5 px-4 py-3 rounded-[18px] bg-[#1c1c20]/80 border border-white/10 w-fit">
                <span className="text-[11px] text-[#86868b] mr-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" /> RAI đang suy nghĩ
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Context Quick Chips */}
          <div className="px-3 pt-2 pb-1 border-t border-white/5 bg-white/[0.01]">
            <p className="text-[10px] font-medium text-[#71717a] mb-1.5 px-1 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Gợi ý câu hỏi nhanh:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
              {currentGuide.chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] text-[#a1a1aa] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
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
            className="p-3 bg-black/40 border-t border-white/10"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi RAI về Ngày chẩn đoán, PRD, ROI..."
                disabled={isLoading}
                className="w-full pl-4 pr-11 py-2.5 rounded-full bg-white/10 focus:bg-white/15 text-white placeholder-[#71717a] text-[13px] border border-white/10 focus:border-white/30 focus:outline-none transition-all disabled:opacity-50"
                style={{
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 w-7 h-7 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-20 disabled:hover:bg-white flex items-center justify-center transition-all active:scale-90"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
            <p className="text-[10px] text-center text-[#52525b] mt-1.5">
              RAI phản hồi dựa trên cấu trúc chuẩn của hệ thống Striver
            </p>
          </form>
        </div>
      )}
    </>
  )
}
