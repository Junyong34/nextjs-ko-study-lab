'use client'

import React, { useCallback, useRef, useState } from 'react'
import { ListChecks } from 'lucide-react'
import { LearningProgressDrawer } from './LearningProgressDrawer'

export function LearningProgressTrigger() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-4 text-xs font-bold text-white shadow-xl transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 lg:bottom-6"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <ListChecks className="h-5 w-5" aria-hidden="true" />
        <span>학습 기록</span>
      </button>
      <LearningProgressDrawer open={open} onClose={close} restoreFocusRef={triggerRef} />
    </>
  )
}
