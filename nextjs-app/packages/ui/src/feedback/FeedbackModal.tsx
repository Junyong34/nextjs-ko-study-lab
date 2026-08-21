'use client'

import React, { useState } from 'react'
import { X, MessageSquare } from 'lucide-react'
import { IconButton } from '../primitives/IconButton'
import { ACCENT_SURFACE } from '../styles'
import { FeedbackForm } from './FeedbackForm'
import { FeedbackSuccess } from './FeedbackSuccess'

export interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  /** mailto 목적지 */
  to: string
}

/** 모달 껍데기. 내용은 폼 또는 전송 완료 안내 둘 중 하나다. */
export function FeedbackModal({ isOpen, onClose, to }: FeedbackModalProps) {
  const [isSent, setIsSent] = useState(false)

  if (!isOpen) return null

  const handleSent = () => {
    setIsSent(true)
    setTimeout(() => {
      setIsSent(false)
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${ACCENT_SURFACE}`}
            >
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
          <IconButton onClick={onClose} aria-label="닫기">
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        {isSent ? (
          <FeedbackSuccess />
        ) : (
          <FeedbackForm to={to} onSent={handleSent} onCancel={onClose} />
        )}
      </div>
    </div>
  )
}
