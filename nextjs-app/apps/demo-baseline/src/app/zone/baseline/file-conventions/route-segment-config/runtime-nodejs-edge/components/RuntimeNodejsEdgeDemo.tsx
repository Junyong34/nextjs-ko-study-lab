'use client'

import React, { useState } from 'react'

export function RuntimeNodejsEdgeDemo() {
  const [selectedRuntime, setSelectedRuntime] = useState<'edge' | 'nodejs'>('edge')

  return (
    <div className="space-y-4">
      {/* 1. 상단 런타임 전환 버튼 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedRuntime('edge')}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedRuntime === 'edge'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            Edge 런타임 (V8 Isolate)
          </button>
          <button
            type="button"
            onClick={() => setSelectedRuntime('nodejs')}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedRuntime === 'nodejs'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            Node.js 런타임 (풀스택)
          </button>
        </div>

        <code className="font-mono text-xs text-zinc-500">
          export const runtime = '{selectedRuntime}'
        </code>
      </div>

      {/* 2. 런타임 스펙 대조 카드 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono text-xs">
        <div
          className={`rounded-lg border p-4 transition ${
            selectedRuntime === 'edge'
              ? 'border-blue-300 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30'
              : 'border-zinc-200 bg-zinc-50/40 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/20'
          }`}
        >
          <div className="flex items-center justify-between border-b border-blue-200/60 pb-2 dark:border-blue-900/60">
            <div className="font-bold text-blue-950 dark:text-blue-200">
              runtime = 'edge':
            </div>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              0ms Cold Start
            </span>
          </div>
          <div className="space-y-1.5 pt-2 text-[11px] text-zinc-700 dark:text-zinc-300">
            <div>• 실행 엔진: 경량 V8 Isolate</div>
            <div>• 배포 범위: 전 세계 300+ 글로벌 CDN 엣지</div>
            <div>• 지원 API: Web Standard (fetch, Request, Response, Streams)</div>
            <div>• 제한 사항: Node.js 네이티브 C++ 바인딩 (node:fs 등) 불가</div>
          </div>
        </div>

        <div
          className={`rounded-lg border p-4 transition ${
            selectedRuntime === 'nodejs'
              ? 'border-purple-300 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/30'
              : 'border-zinc-200 bg-zinc-50/40 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/20'
          }`}
        >
          <div className="flex items-center justify-between border-b border-purple-200/60 pb-2 dark:border-purple-900/60">
            <div className="font-bold text-purple-950 dark:text-purple-200">
              runtime = 'nodejs':
            </div>
            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Full Ecosystem
            </span>
          </div>
          <div className="space-y-1.5 pt-2 text-[11px] text-zinc-700 dark:text-zinc-300">
            <div>• 실행 엔진: 전체 Node.js 런타임 컨테이너</div>
            <div>• 배포 범위: 리전별 중앙 서버리스 / 서버 인스턴스</div>
            <div>• 지원 API: 모든 Node.js 네이티브 모듈 (fs, crypto, pg, sharp)</div>
            <div>• 적합 워크로드: 대용량 이미지 처리, 복잡한 ORM DB 트랜잭션</div>
          </div>
        </div>
      </div>
    </div>
  )
}
