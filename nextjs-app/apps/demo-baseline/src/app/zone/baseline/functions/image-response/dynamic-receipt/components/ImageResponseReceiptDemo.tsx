'use client'
import React from 'react'

export function ImageResponseReceiptDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">디지털 결제 영수증 ImageResponse:</div>
      <div className="text-zinc-500">• 주문번호: ORD-2026-9912 | 결제금액: 349,000원</div>
      <div className="text-emerald-600">[확인] PNG 다운로드 및 소셜 메신저 전송 지원</div>
    </div>
  )
}
