'use client'

import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import { BASE_PATH } from '../verification'
import { usePlacementObserver } from './PlacementObserver'

const CATEGORIES = [
  { href: BASE_PATH, label: '전자기기' },
  { href: `${BASE_PATH}/fashion`, label: '패션' },
]

export function CategoryNav() {
  const { pathname, canRecord, before, after, recordBefore, reset } = usePlacementObserver()

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      <nav aria-label="카테고리" className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const active = pathname === category.href
          return (
            <Link
              key={category.href}
              href={category.href}
              aria-current={active ? 'page' : undefined}
              className={`rounded-md px-3 py-1 text-xs font-bold ${
                active
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200'
              }`}
            >
              {category.label}
            </Link>
          )
        })}
      </nav>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-zinc-500">
          {after ? '이동 직후 스냅샷 고정됨' : before ? '기록됨 — 다른 카테고리로 이동하세요' : '세 Drawer를 열고 메모 입력'}
        </span>
        <button
          type="button"
          onClick={recordBefore}
          disabled={!canRecord}
          className="cursor-pointer rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          이동 전 상태 기록
        </button>
        <DemoResetButton onReset={reset} label="기록 초기화" />
      </div>
    </div>
  )
}
