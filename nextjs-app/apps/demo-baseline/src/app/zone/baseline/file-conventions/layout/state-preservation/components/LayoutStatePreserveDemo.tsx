'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { useStatePreservation } from './StatePreservationContext'

const BASE = '/zone/baseline/file-conventions/layout/state-preservation'
const CATEGORIES = [
  { href: BASE, label: '도서' },
  { href: `${BASE}/electronics`, label: '전자기기' },
  { href: `${BASE}/fashion`, label: '패션' },
]

export function LayoutStatePreserveDemo() {
  const pathname = usePathname()
  const {
    mountId,
    query,
    setQuery,
    baseline,
    recordBaseline,
    reset,
    reportedPathname,
    reportedCategory,
  } = useStatePreservation()

  const canRecordBaseline = Boolean(mountId) && reportedPathname === pathname && reportedCategory !== null
  const baselineRecordedHere = baseline?.pathname === pathname

  return (
    <div className="min-w-0 space-y-3 rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          공유 layout.tsx 프레임 (mount ID: <code className="font-mono">{mountId ? mountId.slice(0, 8) : '관측 준비 중'}</code>)
        </span>
        <DemoResetButton onReset={reset} />
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`cursor-pointer rounded px-3 py-1 text-xs font-bold ${
              pathname === c.href
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
            }`}
          >
            {c.label} 카테고리로 이동
          </Link>
        ))}
      </div>

      <div className="min-w-0 space-y-1.5">
        <label
          htmlFor="state-preservation-query"
          className="block text-xs font-bold text-zinc-900 dark:text-zinc-100"
        >
          상품 검색어 (학습용 입력 — 실제 검색 서비스를 호출하지 않습니다)
        </label>
        <input
          id="state-preservation-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 무선 키보드"
          className="w-full min-w-0 rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => recordBaseline(pathname)}
            disabled={!canRecordBaseline}
            className="cursor-pointer rounded bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            현재 입력값·경로를 기준으로 기록
          </button>
          {baselineRecordedHere && (
            <span className="text-[11px] text-zinc-500">
              이미 이 경로에서 기준을 기록했습니다. 다른 카테고리로 이동해 보세요.
            </span>
          )}
        </div>
        <p className="text-[11px] text-zinc-500">
          기준을 기록한 뒤 다른 카테고리로 이동해도, 같은 layout.tsx mount 인스턴스가 유지되면 이 입력값은 사라지지
          않습니다. 입력값을 바꾸면 검증 패널이 불일치를 보고합니다.
        </p>
      </div>
    </div>
  )
}
