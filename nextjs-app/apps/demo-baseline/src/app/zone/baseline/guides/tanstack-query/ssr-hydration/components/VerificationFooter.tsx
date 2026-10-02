'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { useHydrationProbe } from '../hooks/useHydrationProbe'
import type { useStaleProbes } from '../hooks/useStaleProbes'
import { judgeHtml, judgeHydration, judgeStaleProbe, type Check } from '../lib/judge'
import type { ServerRenderInfo } from '../types'
import { HydrationDeepDive } from './HydrationDeepDive'

interface Props {
  info: ServerRenderInfo
  probe: ReturnType<typeof useHydrationProbe>
  stale: ReturnType<typeof useStaleProbes>
}

const EXPECTED_PREFETCHED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>하이드레이션 직후 DOM에 상품 행 4개가 이미 있다(하드 로드면 서버 HTML이 그린 것).</li>
    <li>queryClient의 쿼리는 status=success, data.source=server-prefetch이고 dataUpdatedAt은 서버가 읽은 과거 시각이다.</li>
    <li>마운트 후 브라우저의 api/deals 요청은 0건, 서버 읽기는 prefetch 1회뿐이다.</li>
    <li>서버 컴포넌트의 new QueryClient()는 매 요청 빈 캐시(쿼리 0개)로 시작한다.</li>
    <li>같은 키를 staleTime 0으로 추가 구독하면 1건 재요청, 60초면(데이터가 60초 미만이면) 0건이다.</li>
  </ul>
)

const EXPECTED_CLIENT = (
  <ul className="list-disc space-y-1 pl-4">
    <li>하이드레이션 직후에는 상품 행이 0개이고 status=pending(로딩 표시)이다.</li>
    <li>그 뒤 브라우저가 api/deals를 1번 요청하고, 서버는 Route Handler로만 1회 읽는다.</li>
    <li>응답 HTML에는 상품 행도 queryKey도 없다.</li>
  </ul>
)

export function VerificationFooter({ info, probe, stale }: Props) {
  const firstProbeAt = stale.runs[0]?.startT ?? Number.POSITIVE_INFINITY
  const requestsAfterMount = probe.resourceStarts.filter((t) => t >= probe.mountedAt && t < firstProbeAt).length
  const ready = probe.measure && probe.isHardLoad !== null && probe.reads
  const checks: Check[] = ready
    ? judgeHydration({ info, measure: probe.measure!, isHardLoad: probe.isHardLoad!, requestsAfterMount, reads: probe.reads! })
    : []
  if (probe.htmlCheck) checks.push(judgeHtml(info.variant, probe.htmlCheck))
  if (stale.latest && stale.latestSettled) checks.push(judgeStaleProbe(stale.latest, probe.requestsSince(stale.latest.startT)))
  const waiting = !ready || (stale.latest !== null && !stale.latestSettled)
  const isMatched = waiting ? undefined : checks.every((c) => c.ok)

  const actual: React.ReactNode = ready ? (
    <ul className="space-y-1">
      <li>
        {probe.isHardLoad ? '하드 로드(서버 HTML)' : '클라이언트 이동(RSC Payload)'} · 서버 렌더 id {info.renderId.slice(0, 8)}
        {waiting ? ' — 측정 중' : ''}
      </li>
      {checks.map((c) => (
        <li key={c.label}>
          {c.ok ? '✅' : '❌'} {c.label}: {c.detail}
        </li>
      ))}
    </ul>
  ) : (
    '• 측정 중: 하이드레이션 직후 상태와 잠시 동안의 요청을 모으고 있습니다.'
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={info.variant === 'prefetched' ? 'prefetch + HydrationBoundary 검증 결과' : '대조군(클라이언트 전용) 검증 결과'}
        expected={info.variant === 'prefetched' ? EXPECTED_PREFETCHED : EXPECTED_CLIENT}
        actual={actual}
        isMatched={isMatched}
        description="하이드레이션 직후 DOM과 queryClient 상태, PerformanceObserver로 받은 실제 api/deals 요청, 서버가 남긴 읽기 기록(api/reads), 서버 컴포넌트가 넘긴 QueryClient 생성 정보만으로 판정합니다."
      />
      <HydrationDeepDive />
    </div>
  )
}
