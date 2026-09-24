'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { latestFor, markContent } from '../lib/navTiming'
import { splitByClick, useRscEntries } from '../hooks/useRscEntries'
import { useServerCounts } from '../hooks/useServerCounts'
import { DEMO_BASE, type NavMeasurement } from '../types'

const ms = (v: number) => `${Math.round(v)}ms`

/** 목적지 본문이 마운트된 순간 이번 이동의 실측값을 확정하고 보여준다. */
export function ArrivalReport({ id }: { id: string }) {
  const [measurement, setMeasurement] = useState<NavMeasurement | null>(null)
  const entries = useRscEntries()
  const counts = useServerCounts(2000)[id]

  useEffect(() => {
    setMeasurement(markContent(id) ?? latestFor(id))
  }, [id])

  const split = splitByClick(entries, id, measurement?.clickAt ?? null)

  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">이번 이동 실측값 ({id})</div>
      {measurement ? (
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
          <dt className="text-zinc-500">클릭 → 스켈레톤(loading.tsx)</dt>
          <dd>{measurement.loadingAt === null ? '표시 안 됨' : ms(measurement.loadingAt - measurement.clickAt)}</dd>
          <dt className="text-zinc-500">클릭 → 본문(page.tsx)</dt>
          <dd>{ms(measurement.contentAt - measurement.clickAt)}</dd>
          <dt className="text-zinc-500">클릭 전 RSC 요청(prefetch)</dt>
          <dd>{split.before.length}건</dd>
          <dt className="text-zinc-500">클릭 후 RSC 요청(이동)</dt>
          <dd>{split.after.length}건</dd>
          <dt className="text-zinc-500">서버 렌더 누적 (layout / page)</dt>
          <dd>{counts ? `${counts.layout}회 / ${counts.page}회` : '-'}</dd>
        </dl>
      ) : (
        <p className="text-zinc-500">
          목록 화면의 링크를 클릭해 들어온 경우에만 측정됩니다 (주소창 직접 접근·새로고침은 측정 대상이 아님).
        </p>
      )}
      <Link href={DEMO_BASE} className="inline-block font-medium text-blue-600 underline dark:text-blue-400">
        ← 링크 목록으로 돌아가 결과 비교하기
      </Link>
    </div>
  )
}
