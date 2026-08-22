'use client'
import React from 'react'

export function NextRequestGeoDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">NextRequest 텔레메트리:</div>
      <div className="text-zinc-500">• req.geo.country: "KR" (대한민국)</div>
      <div className="text-zinc-500">• req.ip: "211.234.120.10"</div>
      <div className="text-emerald-600">[확인] 자동 통화 매핑: 원화(KRW) 결제 모듈 활성화</div>
    </div>
  )
}
