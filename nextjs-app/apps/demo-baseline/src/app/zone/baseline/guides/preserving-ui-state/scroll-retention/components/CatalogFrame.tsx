'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CATALOG_PATH, NAV_METHODS } from '../types'
import type { NavMethodConfig } from '../types'
import { labelOf, nextCategory, parseCategory } from '../data'
import { useFilterNavMeasure, useLiveScroll } from './useFilterNavMeasure'

const BTN_BASE = 'rounded border px-2 py-1 text-left text-[11px] font-medium transition'
const BTN_DEFAULT =
  'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200'
const BTN_FALSE =
  'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'

/** 측정 준비: 두 목록 패널과 문서를 Page 상단이 뷰포트 밖으로 나갈 만큼 내린다. 이동 자체와는 무관하다. */
function prepareScroll() {
  document.querySelectorAll<HTMLElement>('[data-pane]').forEach((el) => (el.scrollTop = 240))
  window.scrollTo(0, 700)
}

/**
 * catalog/layout.tsx가 렌더하는 공유 셸. sticky 헤더에 필터 변경 컨트롤 5종과 실측 HUD가 있다.
 * 이 컴포넌트는 layout에 있으므로 ?cat= 변경에도 언마운트되지 않는다.
 */
export function CatalogFrame({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = parseCategory(searchParams.get('cat') ?? undefined)
  const next = nextCategory(current)
  const href = `${CATALOG_PATH}?cat=${next}`
  const { seq, lastRecord, begin } = useFilterNavMeasure()
  const { live, timeOrigin } = useLiveScroll(seq)

  const renderControl = (cfg: NavMethodConfig) => {
    const className = `${BTN_BASE} ${cfg.scrollFalse ? BTN_FALSE : BTN_DEFAULT}`
    const body = (
      <>
        <span className="block">{cfg.label}</span>
        <span className="block font-mono text-[9px] opacity-70">→ ?cat={next}</span>
      </>
    )
    switch (cfg.method) {
      case 'link-default':
        return (
          <Link key={cfg.method} href={href} onClick={() => begin(cfg.method, href)} className={className}>
            {body}
          </Link>
        )
      case 'link-false':
        return (
          <Link key={cfg.method} href={href} scroll={false} onClick={() => begin(cfg.method, href)} className={className}>
            {body}
          </Link>
        )
      case 'push-default':
      case 'push-false':
      case 'replace-false': {
        const onClick = () => {
          begin(cfg.method, href)
          if (cfg.method === 'push-default') router.push(href)
          else if (cfg.method === 'push-false') router.push(href, { scroll: false })
          else router.replace(href, { scroll: false })
        }
        return (
          <button key={cfg.method} type="button" onClick={onClick} className={className}>
            {body}
          </button>
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* sticky 헤더: layout에 있고 sticky라서 Next.js 스크롤 판정 대상이 아니다 */}
      <header className="sticky top-0 z-10 space-y-1.5 border-b border-zinc-200 bg-white/95 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {labelOf(current)} ?cat={current}
          </span>
          <span>
            scrollY <strong className="text-blue-700 dark:text-blue-300">{live.y}</strong>
          </span>
          <span>패널A {live.kept}</span>
          <span>패널B {live.keyed}</span>
          <span>카운터 {seq}</span>
          <span>timeOrigin {timeOrigin ?? '-'}</span>
          <button
            type="button"
            onClick={prepareScroll}
            className="ml-auto rounded border border-zinc-300 px-1.5 py-0.5 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            측정 준비: 패널 240 · 문서 700
          </button>
        </div>
        <nav aria-label="필터 변경 방법" className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {NAV_METHODS.map(renderControl)}
        </nav>
        {/* 헤더 높이가 변하면 아래 콘텐츠가 밀리므로 이 줄은 항상 한 줄을 차지한다 */}
        <div className="truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
          {lastRecord
            ? `직전 #${lastRecord.seq}: scrollY ${lastRecord.beforeY}→${lastRecord.afterY} · 패널A ${lastRecord.keptBefore}→${lastRecord.keptAfter} · 패널B ${lastRecord.keyedBefore}→${lastRecord.keyedAfter} · 서버 ${lastRecord.receivedSearch}`
            : '아직 이동 없음 — [측정 준비]를 누르거나 직접 스크롤한 뒤 필터 버튼을 눌러 보세요'}
        </div>
      </header>
      <div className="px-3 pb-3">{children}</div>
    </div>
  )
}
