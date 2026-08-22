'use client'

import React, { useState } from 'react'

export function ThemeInspectorClient() {
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'amber'>('indigo')
  const [paddingSize, setPaddingSize] = useState<'compact' | 'normal' | 'spacious'>('normal')
  const [hasBadge, setHasBadge] = useState(true)

  const colorStyles = {
    indigo: {
      border: 'border-indigo-300 dark:border-indigo-800',
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      badge: 'bg-indigo-600 text-white',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      title: 'text-indigo-950 dark:text-indigo-200',
    },
    emerald: {
      border: 'border-emerald-300 dark:border-emerald-800',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      badge: 'bg-emerald-600 text-white',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      title: 'text-emerald-950 dark:text-emerald-200',
    },
    amber: {
      border: 'border-amber-300 dark:border-amber-800',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      badge: 'bg-amber-600 text-white',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      title: 'text-amber-950 dark:text-amber-200',
    },
  }[accentColor]

  const paddingClass = {
    compact: 'p-3',
    normal: 'p-4',
    spacious: 'p-6',
  }[paddingSize]

  const activeClasses = `rounded-lg border ${colorStyles.border} ${colorStyles.bg} ${paddingClass} shadow-2xs transition-all`

  return (
    <div className="space-y-4">
      {/* 1. 제어 옵션 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">악센트 색상:</span>
          {(['indigo', 'emerald', 'amber'] as const).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setAccentColor(color)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium capitalize transition cursor-pointer ${
                accentColor === color
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {color}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">내부 여백:</span>
          {(['compact', 'normal', 'spacious'] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setPaddingSize(size)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium capitalize transition cursor-pointer ${
                paddingSize === size
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={hasBadge}
            onChange={(e) => setHasBadge(e.target.checked)}
            className="rounded border-zinc-300"
          />
          <span>프로모션 뱃지</span>
        </label>
      </div>

      {/* 2. 실시간 렌더링 카드 */}
      <div className={activeClasses}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold ${colorStyles.title}`}>
                Tailwind CSS v4 프리미엄 러닝화
              </h3>
              {hasBadge && (
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${colorStyles.badge}`}
                >
                  NEW 2026
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              유틸리티 클래스 기반 디자인 토큰이 즉시 조합되어 반응형 레이아웃과 다크모드를 완벽하게 지원합니다.
            </p>
          </div>
          <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
            189,000원
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 dark:border-zinc-800">
          <span className="font-mono text-[11px] text-zinc-400">
            사이즈: 250 ~ 290mm (무료 배송)
          </span>
          <button
            type="button"
            className={`rounded px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition ${colorStyles.button} cursor-pointer`}
          >
            장바구니 담기
          </button>
        </div>
      </div>

      {/* 3. 적용된 Tailwind 클래스 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          조합된 Tailwind v4 유틸리티 클래스:
        </span>
        <div className="mt-1 font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
          {activeClasses}
        </div>
      </div>
    </div>
  )
}
