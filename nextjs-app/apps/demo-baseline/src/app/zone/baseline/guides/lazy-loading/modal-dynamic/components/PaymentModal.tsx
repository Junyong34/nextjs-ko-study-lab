'use client'
import React from 'react'

// 이 최상위 부수효과는 모듈이 실제로 평가(evaluate)될 때만 실행된다.
// next/dynamic으로 지연 로드되면 버튼 클릭 전까지 이 코드가 아예 다운로드/실행되지 않는다.
if (typeof window !== 'undefined') {
  ;(window as any).__paymentModalChunkLoaded = true
}

export default function PaymentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/40 text-xs">
      <div className="font-bold text-emerald-900 dark:text-emerald-300">결제 모달 마운트 완료 (동적 청크 실제 로드됨)</div>
      <button type="button" onClick={onClose} className="mt-2 text-zinc-500 underline cursor-pointer">닫기</button>
    </div>
  )
}
