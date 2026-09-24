'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CHAPTERS, NAV_KINDS, VIEWPORT_BASE } from '../types'
import { useLiveScrollY, useNavMeasure } from './useNavMeasure'

/**
 * viewport/layout.tsx가 렌더하는 공유 셸. sticky 헤더에 실습용 <Link> 4개와 실측 HUD가 있다.
 * 이 컴포넌트는 레이아웃에 있으므로 viewport/1 → viewport/2 이동에도 언마운트되지 않는다.
 */
export function ViewportFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const chapter = pathname.split('/').pop() ?? '1'
  const idx = CHAPTERS.indexOf(chapter as (typeof CHAPTERS)[number])
  const nextChapter = CHAPTERS[(idx + 1) % CHAPTERS.length]
  const { seq, lastRecord, begin } = useNavMeasure()
  const { y, vh, timeOrigin } = useLiveScrollY()

  const hrefFor = (hashId?: string) =>
    hashId ? `${VIEWPORT_BASE}/${chapter}#${hashId}` : `${VIEWPORT_BASE}/${nextChapter}`

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* sticky 헤더: Next.js는 sticky/fixed 엘리먼트를 스크롤 대상에서 건너뛴다 (그리고 여기는 Page가 아닌 layout이다) */}
      <header className="sticky top-0 z-10 space-y-1.5 border-b border-zinc-200 bg-white/95 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{chapter}장 / {CHAPTERS.length}</span>
          <span>scrollY <strong className="text-blue-700 dark:text-blue-300">{y}px</strong></span>
          <span>viewport {vh}px</span>
          <span>레이아웃 카운터 {seq}</span>
          <span>timeOrigin {timeOrigin ?? '-'}</span>
          <button
            type="button"
            onClick={() => window.scrollTo(0, 900)}
            className="ml-auto rounded border border-zinc-300 px-1.5 py-0.5 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            아래로 900px
          </button>
        </div>
        <nav className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {NAV_KINDS.map((cfg) => {
            const href = hrefFor(cfg.hashId)
            return (
              <Link
                key={cfg.kind}
                href={href}
                scroll={cfg.scrollProp}
                onClick={() => begin(cfg.kind, href)}
                data-kind={cfg.kind}
                className={`rounded border px-2 py-1 text-[11px] font-medium transition ${
                  cfg.scrollProp === false
                    ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                    : 'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200'
                }`}
              >
                {cfg.label}
                {!cfg.hashId && <span className="ml-1 font-mono text-[10px] opacity-70">→ {nextChapter}장</span>}
              </Link>
            )
          })}
        </nav>
        {/* 헤더 높이가 변하면 아래 콘텐츠가 밀리므로 이 줄은 항상 한 줄을 차지한다 */}
        <div className="truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
          {lastRecord
            ? `직전 이동 #${lastRecord.seq}: scrollY ${lastRecord.beforeY} → ${lastRecord.afterY}px (${lastRecord.fromUrl} → ${lastRecord.toUrl})`
            : '아직 이동 없음 — 아래로 스크롤한 뒤 링크를 눌러 보세요'}
        </div>
      </header>
      <div className="px-3 pb-3">{children}</div>
    </div>
  )
}
