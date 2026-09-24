'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import type { LaneSummary, MeasurementRow } from '../lib/summarize'
import { LAYOUT_COST_MS, type LaneKey } from '../types'
import { ConceptCard } from './ConceptCard'

interface Props {
  isDev: boolean
  summary: Record<LaneKey, LaneSummary>
  rows: MeasurementRow[]
}

const ms = (v: number | null | undefined) => (v === null || v === undefined ? '-' : `${Math.round(v)}ms`)
const lastOf = (rows: MeasurementRow[], lanes: LaneKey[], pred: (r: MeasurementRow) => boolean = () => true) =>
  [...rows].reverse().find((r) => lanes.includes(r.lane) && pred(r))

export function VerificationFooter({ isDev, summary, rows }: Props) {
  const { a, b, c, d } = summary
  const bRow = lastOf(rows, ['b'])
  const hoverRow = lastOf(rows, ['c', 'd'], (r) => r.before > 0)

  let isMatched: boolean | undefined
  if (isDev) {
    isMatched = a.prefetchRequests > 0 || b.prefetchRequests > 0 ? false : bRow ? true : undefined
  } else if (b.prefetchRequests > 0) {
    isMatched = false
  } else if (a.prefetchRequests > 0 && bRow && hoverRow) {
    isMatched = bRow.loadingMs !== null && hoverRow.loadingMs !== null && bRow.loadingMs > hoverRow.loadingMs
  }

  const expected = isDev
    ? [
        '- development: 모든 레인의 클릭 전 RSC 요청 0건 (뷰포트·hover·router.prefetch 모두 production 전용)',
        `- B 링크 클릭 시 클릭 후에야 요청 → 스켈레톤까지 layout 비용(${LAYOUT_COST_MS}ms) 이상`,
        '- 레인 간 차이는 production(next build && next start)에서 확인',
      ].join('\n')
    : [
        '- A(기본): 뷰포트 진입만으로 링크마다 요청 + 서버 layout 렌더, page는 클릭한 링크만 렌더',
        '- B(prefetch={false}): hover해도 클릭 전 요청·서버 렌더 0건',
        '- C·D: hover한 링크만 클릭 전 요청 발생',
        `- 클릭→스켈레톤: B는 ${LAYOUT_COST_MS}ms 이상, hover 후 클릭한 C·D는 그보다 짧음`,
      ].join('\n')

  const actual = (
    <div className="whitespace-pre-line">
      {[
        `- 클릭 전 요청: A ${a.prefetchRequests} / B ${b.prefetchRequests} / C ${c.prefetchRequests} / D ${d.prefetchRequests}건`,
        `- 서버 layout 렌더: A ${a.layoutRenders} / B ${b.layoutRenders} / C ${c.layoutRenders} / D ${d.layoutRenders}회`,
        `- 서버 page 렌더: A ${a.pageRenders} / B ${b.pageRenders} / C ${c.pageRenders} / D ${d.pageRenders}회`,
        `- 최근 B 이동 클릭→스켈레톤: ${ms(bRow?.loadingMs)} (본문 ${ms(bRow?.contentMs)})`,
        `- 최근 hover 후 C·D 이동 클릭→스켈레톤: ${ms(hoverRow?.loadingMs)} (${hoverRow?.id ?? '기록 없음'})`,
        `- 현재 모드: ${isDev ? 'development' : 'production'}`,
      ].join('\n')}
    </div>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="prefetch 비활성화의 절감 효과와 클릭 비용"
        expected={<div className="whitespace-pre-line">{expected}</div>}
        actual={actual}
        isMatched={isMatched}
        description="요청 수는 Resource Timing, 서버 렌더 수는 목적지 layout/page의 실제 실행 횟수, ms는 링크 onClick부터 loading.tsx/page.tsx 마운트까지의 performance.now() 차이입니다. B 이동과 hover 후 C·D 이동이 모두 기록되면 판정합니다."
      />
      <ConceptCard />
    </div>
  )
}
