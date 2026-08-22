'use client'
import React, { useState } from 'react'
export function ThirdPartyYoutubeDemo() {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">YouTube 라이트 플레이어</span>
        <span className="font-mono text-[10px] text-zinc-400">초기 JS 다운로드 0 KB</span>
      </div>
      <div onClick={() => setPlaying(true)} className="rounded bg-zinc-900 h-28 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-zinc-800">
        {playing ? '▶ 영상 스트리밍 재생 중...' : '▶ 클릭하여 영상 로드 (Lite Embed)'}
      </div>
    </div>
  )
}
