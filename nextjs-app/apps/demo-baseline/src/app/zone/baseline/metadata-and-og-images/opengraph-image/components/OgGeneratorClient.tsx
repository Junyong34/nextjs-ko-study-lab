'use client'

import React, { useState } from 'react'

export function OgGeneratorClient() {
  const [badgeText, setBadgeText] = useState('Next.js 16')
  const [headline, setHeadline] = useState('서버 컴포넌트와 Edge 런타임의 만남')
  const [subline, setSubline] = useState('HTML/CSS 기반 JSX로 1200x630 OG 이미지를 실시간 렌더링')
  const [theme, setTheme] = useState<'dark' | 'emerald' | 'gradient'>('dark')

  const themeStyles = {
    dark: 'bg-zinc-950 text-white border-zinc-800',
    emerald: 'bg-emerald-950 text-emerald-100 border-emerald-800',
    gradient: 'bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 text-white border-indigo-900',
  }[theme]

  return (
    <div className="space-y-4">
      {/* 1. OG 이미지 생성 커스터마이저 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div>
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            뱃지 텍스트
          </label>
          <input
            type="text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            메인 헤드라인
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            테마 배경
          </label>
          <div className="mt-1 flex gap-1.5">
            {(['dark', 'emerald', 'gradient'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium capitalize transition cursor-pointer ${
                  theme === t
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                    : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 1200 x 630 비율의 실시간 OG 캔버스 뷰어 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            ImageResponse 렌더링 캔버스 (1200 × 630 px 기준):
          </span>
          <span className="font-mono text-[10px] text-zinc-400">
            실제 엔드포인트: /opengraph-image
          </span>
        </div>

        <div
          className={`aspect-[1200/630] w-full rounded-xl border p-6 sm:p-10 shadow-lg flex flex-col justify-between transition-all ${themeStyles}`}
        >
          {/* 상단 뱃지 & 브랜드 */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-2xs">
              {badgeText}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Next.js 한국어 학습 랩
            </span>
          </div>

          {/* 중앙 타이틀 & 부제목 */}
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-tight">
              {headline}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2">
              {subline}
            </p>
          </div>

          {/* 하단 메타 정보 바 */}
          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-500 font-mono">
            <span>OpenGraph 1200 × 630 png</span>
            <span>nextjs-ko-lab.dev</span>
          </div>
        </div>
      </div>
    </div>
  )
}
