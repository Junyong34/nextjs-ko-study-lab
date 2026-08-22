'use client'
import React, { useState } from 'react'

export function ImageResponsiveDemo() {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">디바이스 뷰포트 시뮬레이션:</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setDevice('mobile')} className={`rounded px-2.5 py-1 text-xs font-bold ${device === 'mobile' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}>[모바일] 모바일 (375px)</button>
          <button type="button" onClick={() => setDevice('desktop')} className={`rounded px-2.5 py-1 text-xs font-bold ${device === 'desktop' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}> 데스크톱 (1200px)</button>
        </div>
      </div>
      <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-emerald-400">
        <div>// next/image 다운로드 파라미터:</div>
        <div>요청 URL: /_next/image?url=/banner.png&w={device === 'mobile' ? '640' : '1920'}&q=75</div>
        <div>다운로드 용량: {device === 'mobile' ? '42 KB (WebP)' : '185 KB (WebP)'}</div>
      </div>
    </div>
  )
}
