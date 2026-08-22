'use client'

import React, { useState } from 'react'

export function FontGoogleVariableDemo() {
  const [selectedFont, setSelectedFont] = useState<'inter' | 'roboto-mono' | 'noto-sans'>('inter')
  const [fontSize, setFontSize] = useState<number>(14)
  const [fontWeight, setFontWeight] = useState<number>(600)

  const fontVariables = {
    inter: {
      name: 'Inter (next/font/google)',
      variable: '--font-inter',
      cssFamily: 'Inter, system-ui, sans-serif',
      subsets: 'latin, latin-ext',
      display: 'swap',
    },
    'roboto-mono': {
      name: 'Roboto Mono (next/font/google)',
      variable: '--font-roboto-mono',
      cssFamily: '"Roboto Mono", monospace',
      subsets: 'latin',
      display: 'swap',
    },
    'noto-sans': {
      name: 'Noto Sans KR (next/font/google)',
      variable: '--font-noto-sans-kr',
      cssFamily: '"Noto Sans KR", sans-serif',
      subsets: 'latin, korean',
      display: 'swap',
    },
  }[selectedFont]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            next/font/google 가변 폰트 CSS 변수 연동 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            구글 폰트를 빌드 타임에 자체 호스팅하고 CSS 변수(--font-*)로 주입하여 제로 CLS를 달성합니다.
          </p>
        </div>

        <div className="flex gap-2">
          {(['inter', 'roboto-mono', 'noto-sans'] as const).map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => setSelectedFont(font)}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                selectedFont === font
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 타이포그래피 실시간 프리뷰 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
            적용된 폰트: <strong>{fontVariables.name}</strong>
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span>크기: {fontSize}px</span>
            <input
              type="range"
              min="12"
              max="22"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20"
            />
            <span>두께: {fontWeight}</span>
            <input
              type="range"
              min="300"
              max="800"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div
          style={{
            fontFamily: fontVariables.cssFamily,
            fontSize: `${fontSize}px`,
            fontWeight: fontWeight,
          }}
          className="rounded-md bg-white p-4 text-zinc-900 shadow-2xs dark:bg-zinc-950 dark:text-zinc-100 space-y-1.5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-bold">프로 무선 기계식 키보드 (텐키리스)</span>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              189,000 KRW
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            The quick brown fox jumps over the lazy dog. 1234567890. 한글 가독성과 라틴 타이포그래피가 조화롭게 렌더링됩니다.
          </p>
        </div>
      </div>

      {/* 3. CSS 변수 & next/font 빌드 타임 속성 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          Next.js next/font/google 주입 속성:
        </div>
        <div className="space-y-1 text-[11px]">
          <div>• CSS Variable: <span className="text-emerald-400 font-bold">{fontVariables.variable}</span></div>
          <div>• fontFamily: <span className="text-blue-300">{fontVariables.cssFamily}</span></div>
          <div>• subsets: <span className="text-amber-300">{fontVariables.subsets}</span></div>
          <div>• font-display: <span className="text-purple-300">{fontVariables.display}</span> (CLS 방지 자동 크기 조정)</div>
        </div>
      </div>
    </div>
  )
}
