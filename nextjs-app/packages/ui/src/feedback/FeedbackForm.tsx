'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../primitives/Button'
import { Input, Textarea } from '../primitives/Input'

export interface FeedbackFormProps {
  /** mailto 목적지 */
  to: string
  onSent: () => void
  onCancel: () => void
}

/** 제목·회신 주소·본문 3필드. 제출하면 mailto 링크를 연다. */
export function FeedbackForm({ to, onSent, onCancel }: FeedbackFormProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [senderEmail, setSenderEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    const fullBody = senderEmail ? `[보낸 사람: ${senderEmail}]\n\n${message}` : message

    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(
      `[Next.js 학습 피드백] ${subject}`,
    )}&body=${encodeURIComponent(fullBody)}`

    window.location.href = mailtoUrl
    onSent()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          제목 <span className="text-rose-500">*</span>
        </label>
        <Input
          type="text"
          required
          placeholder="예: Server Actions 데모 관련 질문 및 오타 제보"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          회신받으실 이메일 <span className="text-zinc-400 font-normal">(선택)</span>
        </label>
        <Input
          type="email"
          placeholder="답변을 받아보실 이메일 주소"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          문의 및 피드백 내용 <span className="text-rose-500">*</span>
        </label>
        <Textarea
          required
          rows={4}
          placeholder="개선 의견이나 건의 사항을 자세히 적어주시면 큰 도움이 됩니다."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          취소
        </button>
        <Button type="submit" shape="submit">
          <Send className="h-3.5 w-3.5" />
          <span>관리자에게 보내기</span>
        </Button>
      </div>
    </form>
  )
}
