'use client'

import React, { useState } from 'react'

export function FontPreviewClient() {
  const [selectedWeight, setSelectedWeight] = useState<'400' | '700' | '900'>('700')
  const [sampleText, setSampleText] = useState('Next.js 한국어 학습 랩: 고성능 웹 폰트 최적화')

  return (
    <div className="space-y-4">
      {/* 1. 폰트 제어 옵션 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">굵기 (weight):</span>
          {(['400', '700', '900'] as const).map((weight) => (
            <button
              key={weight}
              type="button"
              onClick={() => setSelectedWeight(weight)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                selectedWeight === weight
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {weight}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">미리보기 문구:</span>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-56 rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* 2. 폰트 로딩 3대 방식 대조 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        {/* 1) 외부 Google Fonts <link> */}
        <div className="rounded border border-rose-200 bg-rose-50/20 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-950 dark:text-rose-200">
              1. 외부 CDN {'<'}link{'>'}
            </span>
            <span className="rounded bg-rose-100 px-1.5 py-0.2 font-mono text-[9px] text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              외부 요청 발생
            </span>
          </div>
          <p
            className="rounded bg-white p-2.5 dark:bg-zinc-900 border border-rose-200/60 dark:border-rose-900/40"
            style={{ fontWeight: Number(selectedWeight) }}
          >
            {sampleText}
          </p>
          <div className="text-[11px] text-zinc-500">
            • fonts.googleapis.com 별도 DNS 조회<br />
            • FOIT / FOUT 렌더링 블로킹 발생
          </div>
        </div>

        {/* 2) next/font/google 셀프호스팅 */}
        <div className="rounded border border-emerald-200 bg-emerald-50/20 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 dark:text-emerald-200">
              2. next/font/google
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-mono text-[9px] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              자동 Self-hosting
            </span>
          </div>
          <p
            className="rounded bg-white p-2.5 dark:bg-zinc-900 border border-emerald-200/60 dark:border-emerald-900/40"
            style={{ fontWeight: Number(selectedWeight) }}
          >
            {sampleText}
          </p>
          <div className="text-[11px] text-zinc-500">
            • 빌드 시 동일 도메인 정적 에셋 변환<br />
            • <strong>Zero Layout Shift (CLS 0)</strong>
          </div>
        </div>

        {/* 3) next/font/local 커스텀 WOFF2 */}
        <div className="rounded border border-blue-200 bg-blue-50/20 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-950 dark:text-blue-200">
              3. next/font/local
            </span>
            <span className="rounded bg-blue-100 px-1.5 py-0.2 font-mono text-[9px] text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              사내 커스텀 폰트
            </span>
          </div>
          <p
            className="rounded bg-white p-2.5 dark:bg-zinc-900 border border-blue-200/60 dark:border-blue-900/40 font-mono"
            style={{ fontWeight: Number(selectedWeight) }}
          >
            {sampleText}
          </p>
          <div className="text-[11px] text-zinc-500">
            • WOFF2 로컬 파일 번들링<br />
            • 서브셋 자동 최적화 및 사이즈 제어
          </div>
        </div>
      </div>
    </div>
  )
}
