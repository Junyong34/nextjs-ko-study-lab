'use client'

import React, { useState } from 'react'
import { VerificationFooter } from './VerificationFooter'

// 1. 외부 CDN <link> — 실제 fonts.googleapis.com에 요청을 보내는 나눔명조(Nanum Myeongjo).
// display 옵션을 일부러 지정하지 않아, 흔한 "복붙 임베드 코드"의 기본 블로킹 동작을 재현한다.
const EXTERNAL_FONT_LINK_HREF =
  'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800'
const EXTERNAL_FONT_FAMILY = "'Nanum Myeongjo', serif"

interface FontPreviewClientProps {
  nextFontGoogleClassName: string
  nextFontLocalClassName: string
}

export function FontPreviewClient({
  nextFontGoogleClassName,
  nextFontLocalClassName,
}: FontPreviewClientProps) {
  const [selectedWeight, setSelectedWeight] = useState<'400' | '700' | '900'>('700')
  const [sampleText, setSampleText] = useState('Next.js 한국어 학습 랩: 고성능 웹 폰트 최적화')
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleWeightChange = (weight: '400' | '700' | '900') => {
    setSelectedWeight(weight)
    setHasInteracted(true)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSampleText(e.target.value)
    setHasInteracted(true)
  }

  return (
    <div className="space-y-6">
      {/* React 19가 이 <link>를 자동으로 <head>에 호이스팅한다 — 실제 외부 요청이 발생한다 */}
      <link rel="stylesheet" href={EXTERNAL_FONT_LINK_HREF} />
      <div className="space-y-4">
        {/* 1. 폰트 제어 옵션 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">굵기 (weight):</span>
            {(['400', '700', '900'] as const).map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => handleWeightChange(weight)}
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
              onChange={handleTextChange}
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
                1. 외부 CDN &lt;link&gt;
              </span>
              <span className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-[9px] text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                외부 요청 발생
              </span>
            </div>
            <p
              className="rounded bg-white p-2.5 dark:bg-zinc-900 border border-rose-200/60 dark:border-rose-900/40"
              style={{ fontFamily: EXTERNAL_FONT_FAMILY, fontWeight: Number(selectedWeight) }}
            >
              {sampleText}
            </p>
            <div className="text-[11px] text-zinc-500">
              • 나눔명조(Nanum Myeongjo) — fonts.googleapis.com에 실제 &lt;link&gt; 요청<br />
              • display 미지정 → 폰트 도착 전까지 렌더링 블로킹(FOIT) 가능
            </div>
          </div>

          {/* 2) next/font/google 셀프호스팅 */}
          <div className="rounded border border-emerald-200 bg-emerald-50/20 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                2. next/font/google
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[9px] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                자동 Self-hosting
              </span>
            </div>
            <p
              className={`rounded bg-white p-2.5 dark:bg-zinc-900 border border-emerald-200/60 dark:border-emerald-900/40 ${nextFontGoogleClassName}`}
              style={{ fontWeight: Number(selectedWeight) }}
            >
              {sampleText}
            </p>
            <div className="text-[11px] text-zinc-500">
              • Noto Sans KR — 빌드 시 자동 다운로드해 이 zone과 같은 도메인에서 서빙<br />
              • 폴백 폰트 치수 자동 보정(adjustFontFallback)으로 레이아웃 흔들림 최소화
            </div>
          </div>

          {/* 3) next/font/local 커스텀 WOFF2 */}
          <div className="rounded border border-blue-200 bg-blue-50/20 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 dark:text-blue-200">
                3. next/font/local
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[9px] text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                사내 커스텀 폰트
              </span>
            </div>
            <p
              className={`rounded bg-white p-2.5 dark:bg-zinc-900 border border-blue-200/60 dark:border-blue-900/40 ${nextFontLocalClassName}`}
              style={{ fontWeight: Number(selectedWeight) }}
            >
              {sampleText}
            </p>
            <div className="text-[11px] text-zinc-500">
              • Gaegu(OFL 라이선스) — 저장소에 직접 번들링한 로컬 TTF 파일<br />
              • 400/700 두 굵기만 실제 파일 존재 (900은 브라우저가 가장 가까운 굵기로 보정)
            </div>
          </div>
        </div>
      </div>

      {/* 3단 & 4단 검증 패널 및 개념 정리 */}
      <VerificationFooter
        selectedWeight={selectedWeight}
        sampleText={sampleText}
        hasInteracted={hasInteracted}
      />
    </div>
  )
}
