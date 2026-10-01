'use client'

import React, { useRef, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useLazyVideo } from '../hooks/useLazyVideo'
import { judge } from '../lib/judge'
import { takeSnapshot } from '../lib/measure'
import { DEMO_BASE_PATH, VIDEO_ROUTE, type Snapshot } from '../types'
import { EagerCompare } from './EagerCompare'
import { LazyVideoStage } from './LazyVideoStage'
import { VerificationFooter } from './VerificationFooter'

export function LazyVideoDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { run, entered, events, reset } = useLazyVideo(rootRef, videoRef)
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [eager, setEager] = useState<Snapshot | null>(null)
  const [measuring, setMeasuring] = useState(false)

  const measure = async () => {
    if (!run) return
    setMeasuring(true)
    try {
      const snap = await takeSnapshot(snapshots.length + 1, videoRef.current, run)
      setSnapshots((prev) => [...prev, snap])
    } finally {
      setMeasuring(false)
    }
  }
  const resetAll = () => {
    setSnapshots([])
    setEager(null)
    reset()
  }

  const { matched, actual } = judge(snapshots, eager)

  return (
    <>
      <DemoPlaygroundCard title="뷰포트 진입 시 로드·자동 재생하는 <video> (guides/videos/lazy-video-player)">
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="max-w-xl text-[11px] leading-relaxed text-zinc-500">
              시뮬레이션이 아닙니다. 실제 <code>&lt;video&gt;</code>가 <code>{VIDEO_ROUTE}</code> Route Handler의 mp4 바이너리를 Range 요청으로 받습니다.
              요청 수는 브라우저 Resource Timing과 서버 기록(<code>{DEMO_BASE_PATH}/log</code>)을 함께 읽습니다.
            </p>
            <DemoResetButton label="초기화 (스크롤·요청 기록)" onReset={resetAll} />
          </div>
          <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">지연 로딩 영상 (IntersectionObserver)</span>
              <button type="button" onClick={measure} disabled={!run || measuring} className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900">
                {measuring ? '측정 중...' : '현재 요청 수·재생 상태 측정'}
              </button>
            </div>
            <LazyVideoStage run={run} entered={entered} events={events} rootRef={rootRef} videoRef={videoRef} />
            {snapshots.length > 0 && (
              <ul className="space-y-0.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                {snapshots.map((s) => (
                  <li key={s.seq}>
                    #{s.seq} {s.phase === 'before' ? '진입 전' : '진입 후'} · 요청 서버 {s.serverRequests} / 브라우저 {s.browserRequests} · readyState {s.readyState} · paused {String(s.paused)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <EagerCompare eager={eager} onSnapshot={setEager} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter matched={matched} actual={actual} />
    </>
  )
}
