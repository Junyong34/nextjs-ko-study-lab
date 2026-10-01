'use client'

import React, { useRef, useState } from 'react'
import { takeSnapshot } from '../lib/measure'
import { VIDEO_ROUTE, type Snapshot } from '../types'

/** 비교군: 마운트되자마자 src와 preload="auto"를 가진 일반 <video>. 스크롤 없이도 요청이 발생한다. */
export function EagerCompare({ eager, onSnapshot }: { eager: Snapshot | null; onSnapshot: (s: Snapshot | null) => void }) {
  const [run, setRun] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const mount = () => {
    onSnapshot(null)
    setRun(`eager-${Math.random().toString(36).slice(2, 8)}`)
  }
  const measure = async () => {
    if (run) onSnapshot(await takeSnapshot(1, videoRef.current, run))
  }

  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">비교: 즉시 로드 영상</span>
        <button type="button" onClick={mount} className="cursor-pointer rounded bg-zinc-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800">
          즉시 로드 영상 마운트
        </button>
        <button type="button" onClick={measure} disabled={!run} className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900">
          비교군 요청 수 측정
        </button>
        {eager && <span className="font-mono text-[11px] text-zinc-500">서버 {eager.serverRequests}건 · 브라우저 {eager.browserRequests}건 · readyState {eager.readyState}</span>}
      </div>
      {run && (
        <video key={run} ref={videoRef} src={`${VIDEO_ROUTE}?run=${run}`} preload="auto" muted loop autoPlay playsInline className="aspect-video w-40 rounded bg-zinc-800" />
      )}
    </div>
  )
}
