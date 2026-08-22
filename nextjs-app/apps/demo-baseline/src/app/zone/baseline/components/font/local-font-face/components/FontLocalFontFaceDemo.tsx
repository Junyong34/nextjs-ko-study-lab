'use client'

import React, { useState } from 'react'

export function FontLocalFontFaceDemo() {
  const [selectedLocalFont, setSelectedLocalFont] = useState<'pretendard' | 'toss-face'>('pretendard')
  const [weight, setWeight] = useState<'400' | '600' | '700'>('600')

  const localFonts = {
    pretendard: {
      name: 'Pretendard Variable (local .woff2)',
      variable: '--font-pretendard',
      src: './fonts/PretendardVariable.woff2',
      weights: ['400', '600', '700'],
      format: 'woff2-variations',
    },
    'toss-face': {
      name: 'TossFace Local (local .woff2)',
      variable: '--font-toss-face',
      src: './fonts/TossFaceFontMac.woff2',
      weights: ['400', '700'],
      format: 'woff2',
    },
  }[selectedLocalFont]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            next/font/local 로컬 폰트 @font-face 자동 바인딩 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            로컬 .woff2 폰트 파일을 자체 호스팅하고 Next.js가 자동으로 CSS 변수 및 @font-face를 컴파일합니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {(['pretendard', 'toss-face'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedLocalFont(f)}
                className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                  selectedLocalFont === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            {(['400', '600', '700'] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeight(w)}
                className={`rounded px-2 py-1 font-mono text-[11px] font-semibold cursor-pointer ${
                  weight === w
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                w{w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 로컬 폰트 프리뷰 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>로컬 폰트 파일: <strong className="text-zinc-800 dark:text-zinc-200">{localFonts.src}</strong></span>
          <span className="font-mono font-bold">weight: {weight}</span>
        </div>

        <div
          style={{ fontWeight: Number(weight) }}
          className="rounded-md bg-white p-4 text-zinc-900 shadow-2xs dark:bg-zinc-950 dark:text-zinc-100 space-y-1"
        >
          <div className="text-base font-bold">
            실전 Next.js 16 프로덕션 완벽 가이드 📚
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            로컬 폰트 프리로드 및 자체 호스팅으로 외부 네트워크 요청(Google Fonts CDN) 없이 100% 보안 및 오프라인 독립성을 보장합니다.
          </p>
        </div>
      </div>

      {/* 3. 컴파일러 생성 @font-face 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          컴파일된 next/font/local 구성 객체:
        </div>
        <div className="space-y-1 text-[11px]">
          <div>• variable: <span className="text-emerald-400 font-bold">{localFonts.variable}</span></div>
          <div>• src: <span className="text-blue-300">path.join('./public', '{localFonts.src}')</span></div>
          <div>• format: <span className="text-amber-300">{localFonts.format}</span></div>
          <div>• preload: <span className="text-purple-300">true (자동 link rel="preload")</span></div>
        </div>
      </div>
    </div>
  )
}
