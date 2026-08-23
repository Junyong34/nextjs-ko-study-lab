'use client'
import React from 'react'
export function BandwidthSaverDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-emerald-950 dark:text-emerald-200">[분석] 대역폭 절감 통계:</div>
      <div>• 기본 prefetch 시: 120개 요청 (1.8 MB)</div>
      <div className="text-emerald-600 dark:text-emerald-400 font-bold">• 최적화 적용 후: 6개 요청 (92 KB) -{'>'} 95% 대역폭 절감</div>
    </div>
  )
}
