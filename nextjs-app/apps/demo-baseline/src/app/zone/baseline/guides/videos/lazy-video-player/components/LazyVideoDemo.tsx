'use client'
import React, { useState } from 'react'
export function LazyVideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">뷰포트 감지 비디오 플레이어</span>
        <button type="button" onClick={() => setIsPlaying(p => !p)} className="rounded bg-blue-600 px-2.5 py-1 text-xs font-bold text-white cursor-pointer">{isPlaying ? '일시정지' : '자동재생 시뮬레이션'}</button>
      </div>
      <div className="h-24 rounded bg-zinc-900 flex items-center justify-center text-white text-xs font-mono">
        {isPlaying ? '▶ 4K 고화질 홍보 영상 스트리밍 중...' : '⏸ 뷰포트 진입 대기 (대역폭 보존 중)'}
      </div>
    </div>
  )
}
