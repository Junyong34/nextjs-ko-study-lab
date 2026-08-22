'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface HistoryEntry {
  step: number
  path: string
  title: string
  cachedTime: string
  latencyMs: number
}

export function RouterCacheBackDemo() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([
    { step: 1, path: '/catalog', title: '상품 목록 (카탈로그)', cachedTime: '13:00:10', latencyMs: 0 },
    { step: 2, path: '/catalog/prod-001', title: '프로 무선 기계식 키보드', cachedTime: '13:00:15', latencyMs: 0 },
    { step: 3, path: '/checkout', title: '주문서 작성 및 결제', cachedTime: '13:00:22', latencyMs: 0 },
  ])
  const [currentIndex, setCurrentIndex] = useState<number>(2)
  const [lastRestoredInfo, setLastRestoredInfo] = useState<string | null>(null)

  const handleBack = () => {
    if (currentIndex > 0) {
      const target = history[currentIndex - 1]
      setCurrentIndex((i) => i - 1)
      setLastRestoredInfo(
        `[Router Cache 0ms 즉각 복구] "${target.title}" (${target.path}) 클라이언트 캐시 적중 -> 서버 네트워크 요청 0건, 스크롤 위치 유지`
      )
    }
  }

  const handleForward = () => {
    if (currentIndex < history.length - 1) {
      const target = history[currentIndex + 1]
      setCurrentIndex((i) => i + 1)
      setLastRestoredInfo(
        `[Router Cache 0ms 전진 복구] "${target.title}" (${target.path}) 캐시된 RSC 페이로드 즉시 렌더링`
      )
    }
  }

  const currentRoute = history[currentIndex]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 헤더 및 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            Next.js App Router 클라이언트 Router Cache 0ms 뒤로가기 복구 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            이전에 방문한 세그먼트의 RSC 페이로드를 브라우저 메모리에 캐싱하여 뒤로가기/앞으로가기 시 서버 재요청 없이 즉각 복원합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            ← router.back() (0ms 뒤로가기)
          </button>
          <button
            type="button"
            onClick={handleForward}
            disabled={currentIndex === history.length - 1}
            className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer shadow-2xs"
          >
            router.forward() →
          </button>
        </div>
      </div>

      {/* 2. 현재 활성 라우트 뷰 */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              ACTIVE ROUTE
            </span>
            <span className="font-mono text-xs font-bold text-indigo-950 dark:text-indigo-200">
              {currentRoute.path}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
            로드 지연: 0ms (Router Cache Hit)
          </span>
        </div>
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          화면 제목: {currentRoute.title}
        </div>
      </div>

      {/* 3. 클라이언트 Router Cache 히스토리 스택 */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          브라우저 메모리 Router Cache 세그먼트 트리:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {history.map((entry, idx) => (
            <div
              key={entry.step}
              className={`rounded-lg border p-3 space-y-1 transition ${
                idx === currentIndex
                  ? 'border-indigo-500 bg-white ring-2 ring-indigo-500/20 shadow-xs dark:bg-zinc-900'
                  : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 opacity-75'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span>STEP #{entry.step}</span>
                <span>{entry.cachedTime}</span>
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                {entry.title}
              </div>
              <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                {entry.path}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 캐시 복구 로그 */}
      {lastRestoredInfo && (
        <div className="rounded bg-emerald-50 p-3 text-xs font-mono text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          ✓ {lastRestoredInfo}
        </div>
      )}
    </div>
  )
}
