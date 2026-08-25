'use client'

import React, { useState } from 'react'

interface ApiCheck {
  name: string
  api: string
  edgeSupport: boolean
  nodeSupport: boolean
  note: string
}

const API_CHECKS: ApiCheck[] = [
  { name: '웹 암호화 표준', api: 'crypto.subtle (Web Crypto)', edgeSupport: true, nodeSupport: true, note: 'V8 Isolate 및 Node.js 18+ 모두 지원' },
  { name: '스트리밍 파이프라인', api: 'TransformStream / ReadableStream', edgeSupport: true, nodeSupport: true, note: 'Web Streams API 표준 지원' },
  { name: '바이너리 버퍼', api: 'Buffer / node:buffer', edgeSupport: false, nodeSupport: true, note: 'Edge에서는 Uint8Array / TextEncoder 대체 필요' },
  { name: '파일 시스템 I/O', api: 'node:fs / fs.promises', edgeSupport: false, nodeSupport: true, note: 'Edge 런타임 호출 시 Bailout 빌드 오류 발생' },
  { name: '시스템 프로세스', api: 'process.cwd() / process.env', edgeSupport: false, nodeSupport: true, note: 'Edge에서는 process 객체 제한적 제공' },
]

export function ServerRuntimeEdgeNodeDemo() {
  const [activeTab, setActiveTab] = useState<'edge' | 'nodejs'>('edge')

  return (
    <div className="space-y-4">
      {/* 1. 상단 런타임 테스트 버튼 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('edge')}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'edge'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            Edge API 테스트
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nodejs')}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'nodejs'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            Node.js API 테스트
          </button>
        </div>

        <span className="text-xs font-mono text-zinc-500">
          현재 검사: <strong>{activeTab === 'edge' ? 'Edge V8 Isolate' : 'Node.js Fullstack'}</strong>
        </span>
      </div>

      {/* 2. API 호환성 매트릭스 테이블 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 font-sans">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            런타임별 API 호환성 및 Bailout 검증 매트릭스
          </span>
        </div>

        <div className="space-y-1.5">
          {API_CHECKS.map((item, idx) => {
            const isSupported = activeTab === 'edge' ? item.edgeSupport : item.nodeSupport
            return (
              <div
                key={idx}
                className={`flex items-center justify-between rounded p-2.5 border transition ${
                  isSupported
                    ? 'border-emerald-100 bg-emerald-50/40 text-emerald-950 dark:border-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-300'
                    : 'border-rose-100 bg-rose-50/40 text-rose-950 dark:border-rose-950 dark:bg-rose-950/20 dark:text-rose-300'
                }`}
              >
                <div>
                  <div className="font-bold">{item.name} (<code>{item.api}</code>)</div>
                  <div className="text-[11px] text-zinc-500 font-sans mt-0.5">{item.note}</div>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    isSupported
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                  }`}
                >
                  {isSupported ? 'PASS (호환)' : 'BAILOUT (미지원)'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
