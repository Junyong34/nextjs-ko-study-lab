'use client'
import React, { useState } from 'react'
export function ImageBlurPlaceholderDemo() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">이미지 로드 상태: {loaded ? '[확인] 원본 고화질 렌더 완료' : '블러 플레이스홀더 표시 중'}</span>
        <button type="button" onClick={() => setLoaded(l => !l)} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">로드 상태 토글</button>
      </div>
      <div className={`h-32 rounded flex items-center justify-center font-bold text-xs transition-all duration-700 ${loaded ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-zinc-300 blur-xs text-zinc-600 dark:bg-zinc-800'}`}>
        {loaded ? 'HD 프로모션 배너 (1920x1080)' : 'Base64 Blur Placeholder...'}
      </div>
    </div>
  )
}
