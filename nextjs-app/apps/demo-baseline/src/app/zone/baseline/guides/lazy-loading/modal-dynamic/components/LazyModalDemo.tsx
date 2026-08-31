'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const PaymentModal = dynamic(() => import('./PaymentModal'), {
  ssr: false,
  loading: () => <div className="text-xs text-zinc-400">모달 청크 다운로드 중...</div>,
})

interface LazyModalDemoProps {
  onOpen: (loadedBeforeClick: boolean) => void
}

export function LazyModalDemo({ onOpen }: LazyModalDemoProps) {
  const [open, setOpen] = useState(false)
  const [chunkLoadedBeforeClick] = useState(
    () => typeof window !== 'undefined' && Boolean((window as any).__paymentModalChunkLoaded)
  )

  const handleOpen = () => {
    setOpen(true)
    onOpen(chunkLoadedBeforeClick)
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-[11px] font-mono text-zinc-500">
        버튼 클릭 전 청크 로드 여부(window.__paymentModalChunkLoaded): {String(chunkLoadedBeforeClick)}
      </div>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer"
      >
        [결제] 결제 모달 열기 (동적 청크 로드)
      </button>
      {open && <PaymentModal onClose={() => setOpen(false)} />}
    </div>
  )
}
