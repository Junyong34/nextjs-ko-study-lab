'use client'

import React, { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { FeedbackModal } from './FeedbackModal'

export interface FeedbackTriggerProps {
  /** mailto 목적지 */
  to: string
}

/**
 * 피드백 버튼 + 모달.
 *
 * 이것만 클라이언트 컴포넌트이면 됩니다. 이전에는 Footer 전체가 모달 열림 상태 하나 때문에
 * `'use client'`였습니다.
 */
export function FeedbackTrigger({ to }: FeedbackTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-xs hover:border-zinc-300 hover:bg-zinc-100 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>피드백 보내기</span>
      </button>

      <FeedbackModal isOpen={open} onClose={() => setOpen(false)} to={to} />
    </>
  )
}
