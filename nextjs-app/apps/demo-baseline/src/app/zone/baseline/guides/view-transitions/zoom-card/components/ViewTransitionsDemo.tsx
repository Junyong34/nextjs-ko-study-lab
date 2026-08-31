'use client'
import React, { useState } from 'react'

interface ViewTransitionsDemoProps {
  onResult: (supported: boolean) => void
}

export function ViewTransitionsDemo({ onResult }: ViewTransitionsDemoProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleToggle = () => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    const supported = typeof doc.startViewTransition === 'function'

    if (supported) {
      doc.startViewTransition!(() => {
        setIsZoomed((z) => !z)
      })
    } else {
      setIsZoomed((z) => !z)
    }
    onResult(supported)
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">View Transition 상태: {isZoomed ? '확대 상세 뷰' : '썸네일 그리드 뷰'}</span>
        <button type="button" onClick={handleToggle} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">
          전환 애니메이션 실행
        </button>
      </div>
      <div
        style={{ viewTransitionName: 'product-hero' } as React.CSSProperties}
        className={`rounded bg-zinc-100 dark:bg-zinc-900 p-4 flex items-center justify-center font-bold text-xs ${
          isZoomed ? 'h-32 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200' : 'h-16'
        }`}
      >
        상품 이미지 (view-transition-name: product-hero)
      </div>
    </div>
  )
}
