'use client'
import React, { useState } from 'react'

export function ArchA11yFocusTrapDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <button type="button" onClick={() => setOpen(true)} className="rounded bg-zinc-900 px-3.5 py-1.5 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        접근성 모달 열기 (Focus Trap)
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="rounded border border-blue-300 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40 space-y-2">
          <h4 id="modal-title" className="font-bold text-blue-950 dark:text-blue-200">[보안] 접근성 포커스 트랩 모달</h4>
          <p className="text-zinc-600 dark:text-zinc-400">Tab 키를 눌러도 포커스가 모달 안에서만 순환합니다.</p>
          <button type="button" onClick={() => setOpen(false)} className="rounded bg-blue-600 px-3 py-1 font-bold text-white cursor-pointer">닫기 (Esc 지원)</button>
        </div>
      )}
    </div>
  )
}
