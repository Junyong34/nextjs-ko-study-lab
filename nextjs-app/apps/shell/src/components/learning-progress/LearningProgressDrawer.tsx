'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { FeedbackTrigger, SITE } from '@study/ui'
import {
  LearningProgressChecklist,
  type LearningProgressTab,
} from './LearningProgressChecklist'

export function LearningProgressDrawer({
  open,
  onClose,
  restoreFocusRef,
}: {
  open: boolean
  onClose: () => void
  restoreFocusRef: React.RefObject<HTMLButtonElement | null>
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const [tab, setTab] = useState<LearningProgressTab>('documents')

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        requestAnimationFrame(() => restoreFocusRef.current?.focus())
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        )
        const first = focusable[0]
        const last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, open, restoreFocusRef])

  const closeAndRestore = () => {
    onClose()
    requestAnimationFrame(() => restoreFocusRef.current?.focus())
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={closeAndRestore}
        tabIndex={-1}
        aria-label="학습 기록 닫기"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="learning-progress-drawer-title"
        className="absolute inset-y-0 right-0 flex w-[94vw] max-w-lg flex-col bg-white p-5 shadow-2xl dark:bg-zinc-950"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h2 id="learning-progress-drawer-title" className="text-lg font-bold">
            학습 기록
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeAndRestore}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="학습 기록 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-5 pr-1">
          <LearningProgressChecklist
            tab={tab}
            onTabChange={setTab}
            compact
          />
        </div>

        <div className="border-t border-zinc-200 pt-4 text-xs dark:border-zinc-800">
          <FeedbackTrigger to={SITE.feedbackTo} />
        </div>
      </aside>
    </div>
  )
}
