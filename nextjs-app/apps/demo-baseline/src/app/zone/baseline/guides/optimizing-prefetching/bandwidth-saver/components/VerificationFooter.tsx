'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { MODES } from '../catalog'
import type { ModeActivity, ModeNetworkStats, PrefetchMode, RenderSnapshot } from '../types'
import { formatBytes } from './CostTable'
import { StrategyDeepDive } from './StrategyDeepDive'

interface VerificationFooterProps {
  isDev: boolean
  network: Record<PrefetchMode, ModeNetworkStats>
  activity: Record<PrefetchMode, ModeActivity>
  renders: RenderSnapshot | null
}

const avgBody = (n: ModeNetworkStats) => (n.requests > 0 ? n.bodyBytes / n.requests : 0)

/** 모드별 판정. 아직 측정 조건(스크롤·hover)이 채워지지 않았으면 null. */
function judge(isDev: boolean, key: PrefetchMode, props: VerificationFooterProps): boolean | null {
  const { network, activity, renders } = props
  const n = network[key]
  const a = activity[key]
  if (a.seen === 0 || (key === 'hover' && a.hovered === 0)) return null
  if (isDev) return n.requests === 0
  switch (key) {
    case 'full':
      return n.skus > 0 && (renders?.full.page ?? 0) >= 1 && avgBody(n) > avgBody(network.auto)
    case 'auto':
      return n.skus > 0
    case 'hover':
      return n.skus <= a.hovered
    case 'off':
      return n.requests === 0
  }
}

const EXPECTED_PROD: Record<PrefetchMode, string> = {
  full: '보인 링크마다 요청(경로 트리 요청이 더해져 링크 수보다 많을 수 있음) · 서버 page 실행 ≥ 1 · 요청당 본문이 기본값보다 큼',
  auto: '보인 링크 수만큼 요청 · 서버는 layout까지만(loading.tsx 경계) 실행',
  hover: '요청된 상품 수 ≤ 마우스를 올린 링크 수 (스크롤만으로는 0건)',
  off: '스크롤·hover와 무관하게 요청 0건',
}

export function VerificationFooter(props: VerificationFooterProps) {
  const { isDev, network, activity, renders } = props
  const results = MODES.map((m) => ({ mode: m, ok: judge(isDev, m.key, props) }))
  const pending = results.filter((r) => r.ok === null)
  const isMatched = pending.length > 0 ? undefined : results.every((r) => r.ok)

  const expected = (
    <ul className="space-y-1">
      <li>현재 실행 모드: {isDev ? 'development' : 'production'}</li>
      {MODES.map((m) => (
        <li key={m.key}>
          <strong>{m.label}</strong>: {isDev ? '요청 0건 — 뷰포트 prefetch는 production 전용' : EXPECTED_PROD[m.key]}
        </li>
      ))}
    </ul>
  )

  const actual = (
    <ul className="space-y-1">
      {results.map(({ mode, ok }) => {
        const n = network[mode.key]
        const r = renders?.[mode.key]
        const state = ok === null ? '측정 대기' : ok ? '일치' : '불일치'
        return (
          <li key={mode.key}>
            <strong>{mode.label}</strong> [{state}]: 본 링크 {activity[mode.key].seen} · hover {activity[mode.key].hovered} → 요청{' '}
            {n.requests}건({n.skus}개 상품) · {formatBytes(n.transferBytes)} · 서버 layout/page {r ? `${r.layout}/${r.page}` : '…'}
          </li>
        )
      })}
      {pending.length > 0 && (
        <li className="text-zinc-500">
          남은 측정: {pending.map((p) => p.mode.label).join(', ')} — 해당 전략으로 바꿔 스크롤{pending.some((p) => p.mode.key === 'hover') ? '(hover 기반은 상품에 마우스 올리기까지)' : ''}하세요.
        </li>
      )}
    </ul>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="전략별 prefetch 네트워크·서버 비용"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="네 전략을 모두 측정하면 판정합니다. 요청 수·바이트는 브라우저 Resource Timing, 서버 실행 횟수는 목적지 layout/page의 실제 카운터입니다. 서버 카운터는 목적지를 직접 클릭해 이동한 횟수도 포함하므로 정확히 비교하려면 먼저 측정 초기화를 누르세요."
      />
      <StrategyDeepDive />
    </div>
  )
}
