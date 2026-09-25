'use client'

import React from 'react'
import Link from 'next/link'
import { requestCount, runsOf } from '../hooks/useProbeStore'
import { CAMPAIGN_DETAIL_PATH, CAMPAIGN_PATH, CORE_DELAY_MS, DEMO_BASE, PROBE_META } from '../types'
import type { ProbeName, ProbeStore } from '../types'

const SCOPE_ROWS: { name: ProbeName; delay: number }[] = [
  { name: 'layout-analytics', delay: 0 },
  { name: 'campaign-pixel', delay: 0 },
  { name: 'core-sdk', delay: CORE_DELAY_MS },
]

const LINKS = [
  { href: DEMO_BASE, label: '루트 페이지' },
  { href: CAMPAIGN_PATH, label: 'campaign' },
  { href: CAMPAIGN_DETAIL_PATH, label: 'campaign/detail' },
]

/**
 * 레이아웃 vs 페이지 배치에 따른 로드 범위를 실측한다.
 * 실행 횟수는 스크립트 자신이 남긴 기록, 요청 수는 브라우저 Resource Timing 값이다.
 * 하위 라우트 이동은 실제 <Link> 소프트 내비게이션이다.
 */
export function RouteScopeTable({ store, currentPath }: { store: ProbeStore | null; currentPath: string }) {
  return (
    <section className="space-y-2">
      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">2. 배치 위치에 따른 로드 범위 (layout vs page)</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1 pr-2 font-medium">스크립트</th>
              <th className="py-1 pr-2 font-medium">선언 위치</th>
              <th className="py-1 pr-2 font-medium">실행 횟수</th>
              <th className="py-1 pr-2 font-medium">네트워크 요청</th>
              <th className="py-1 font-medium">첫 실행 경로</th>
            </tr>
          </thead>
          <tbody className="text-zinc-800 dark:text-zinc-200">
            {SCOPE_ROWS.map(({ name, delay }) => {
              const runs = runsOf(store, name)
              return (
                <tr key={name} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-1 pr-2">{name}</td>
                  <td className="py-1 pr-2 text-zinc-500">{PROBE_META[name].placement}</td>
                  <td className="py-1 pr-2">{store ? `${runs.length}회` : '-'}</td>
                  <td className="py-1 pr-2">{store ? `${requestCount(name, delay)}건` : '-'}</td>
                  <td className="py-1 break-all text-zinc-500">{runs[0]?.path.replace(DEMO_BASE, '.') ?? '실행 안 됨'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-zinc-500">실제 라우트 이동:</span>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={currentPath === l.href ? 'page' : undefined}
            className="rounded border border-zinc-300 px-2 py-1 text-zinc-700 hover:bg-zinc-50 aria-[current=page]:bg-zinc-900 aria-[current=page]:text-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:aria-[current=page]:bg-zinc-100 dark:aria-[current=page]:text-zinc-900"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="font-mono text-[11px] text-zinc-500">
        이동 이력: {store && store.visits.length > 0 ? store.visits.map((v) => v.path.replace(DEMO_BASE, '.') || '.').join(' → ') : '-'}
      </p>
    </section>
  )
}
