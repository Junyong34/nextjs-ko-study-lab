'use client'

import React from 'react'
import { VIDEO_ROUTE, type VideoEvent } from '../types'

interface LazyVideoStageProps {
  run: string | null
  entered: boolean
  events: VideoEvent[]
  rootRef: React.RefObject<HTMLDivElement | null>
  videoRef: React.RefObject<HTMLVideoElement | null>
}

/** 220px 스크롤 박스. 영상은 박스 아래쪽에 있어 처음에는 보이지 않는다. */
export function LazyVideoStage({ run, entered, events, rootRef, videoRef }: LazyVideoStageProps) {
  return (
    <div className="space-y-2">
      <div ref={rootRef} className="h-56 overflow-y-auto rounded border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex h-[420px] items-center justify-center px-4 text-center text-xs text-zinc-500">
          상품 상세 본문 영역입니다. 아래로 스크롤하면 홍보 영상이 나타납니다.
        </div>
        <div className="p-3">
          <video
            key={run ?? 'pending'}
            ref={videoRef}
            src={entered && run ? `${VIDEO_ROUTE}?run=${run}` : undefined}
            preload={entered ? 'auto' : 'none'}
            muted
            loop
            playsInline
            className="aspect-video w-full max-w-sm rounded bg-zinc-800"
          />
          <p className="mt-1 text-[11px] text-zinc-500">겨울 러닝화 홍보 영상 (160x96 H.264 mp4, 약 7KB)</p>
        </div>
        <div className="h-24" />
      </div>
      <p className="font-mono text-[11px] text-zinc-500">
        {entered ? `뷰포트 진입 → src 부여 (run=${run}) · ` : '뷰포트 진입 전 · src 없음 · '}
        {events.length > 0 ? events.map((e) => `${e.name} +${e.at}ms`).join(' → ') : '이벤트 없음'}
      </p>
    </div>
  )
}
