'use client'

import React, { useState } from 'react'
import { X, Send, MessageSquare, CheckCircle2 } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

const ADMIN_DESTINATION = 'wnsdyd21@gmail.com'

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [isSent, setIsSent] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    // 관리자 메일로 mailto 링크 생성
    const fullBody = senderEmail
      ? `[보낸 사람: ${senderEmail}]\n\n${message}`
      : message

    const mailtoUrl = `mailto:${ADMIN_DESTINATION}?subject=${encodeURIComponent(
      `[Next.js 학습 피드백] ${subject}`
    )}&body=${encodeURIComponent(fullBody)}`

    // 브라우저 메일 클라이언트 호출
    window.location.href = mailtoUrl
    setIsSent(true)

    setTimeout(() => {
      setIsSent(false)
      setSubject('')
      setMessage('')
      setSenderEmail('')
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14161a0f] text-zinc-900 dark:bg-white/10 dark:text-zinc-100">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                관리자에게 피드백 보내기
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                오류 제보, 번역 개선, 기능 제안 등 소중한 의견을 남겨주세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content / Form */}
        {isSent ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h4 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
              메일 프로그램이 열렸습니다
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              작성하신 내용이 관리자에게 전달됩니다. 소중한 의견 감사합니다!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                제목 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: Server Actions 데모 관련 질문 및 오타 제보"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                회신받으실 이메일 <span className="text-zinc-400 font-normal">(선택)</span>
              </label>
              <input
                type="email"
                placeholder="답변을 받아보실 이메일 주소"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                문의 및 피드백 내용 <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="개선 의견이나 건의 사항을 자세히 적어주시면 큰 도움이 됩니다."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300 resize-none"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Send className="h-3.5 w-3.5" />
                <span>관리자에게 보내기</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
