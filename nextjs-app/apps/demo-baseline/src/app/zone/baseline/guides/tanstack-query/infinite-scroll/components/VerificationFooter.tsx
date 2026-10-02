'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { useCacheSnapshot } from '../hooks/useCacheSnapshot'
import { BURST_CALLS } from '../hooks/useProductFeed'
import { ACTION_LABEL, judge } from '../lib/judge'
import { countResourceEntries, useObserved } from '../lib/observe'
import { PAGE_SIZE, STALE_TIME } from '../lib/query'
import { InfiniteDeepDive } from './InfiniteDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>첫 진입: initialPageParam(null)으로 1페이지({PAGE_SIZE}개)만 요청한다.</li>
    <li>센티널이 보일 때마다 getNextPageParam이 돌려준 커서로 페이지당 정확히 1회 요청하고, 서버도 같은 커서를 1번만 받는다.</li>
    <li>가드 없이 fetchNextPage()를 {BURST_CALLS}번 연속 부르면 기본값 cancelRefetch: true 때문에 진행 중 요청이 매번 취소되고 새로 시작된다(queryFn {BURST_CALLS}회, 취소 {BURST_CALLS - 1}회). cancelRefetch: false면 진행 중 요청을 재사용해 1회다. 어느 쪽이든 페이지는 1개만 붙는다.</li>
    <li>마지막 페이지에서는 getNextPageParam이 null을 돌려 hasNextPage=false가 된다.</li>
    <li>다른 화면에 갔다가 {STALE_TIME / 1000}초 안에 돌아오면 첫 렌더부터 캐시 목록이 보이고 요청은 0회다. 그 뒤라면 불러온 페이지 수만큼 다시 요청한다.</li>
  </ul>
)

export function VerificationFooter() {
  const obs = useObserved()
  const snap = useCacheSnapshot()
  const latest = obs.actions[obs.actions.length - 1]
  const verdict = latest ? judge(latest, obs, snap, countResourceEntries(obs, latest.startT), BURST_CALLS) : null
  const isMatched = verdict?.done ? verdict.checks.every((c) => c.ok) : undefined
  const okCalls = obs.fetches.filter((f) => f.status === 'ok').length

  const actual: React.ReactNode =
    latest && verdict ? (
      <ul className="space-y-1">
        <li>
          최근 동작: {ACTION_LABEL[latest.type]}
          {!verdict.done ? ' — 응답 대기 중' : ''}
        </li>
        {verdict.checks.map((c) => (
          <li key={c.label}>
            {c.ok ? '✅' : '❌'} {c.label}: {c.detail}
          </li>
        ))}
        <li className="text-zinc-500">
          누적(초기화 이후): queryFn {obs.fetches.length}회(성공 {okCalls}) · Resource Timing 요청 {obs.resourceStarts.length}건 · 캐시 페이지 {snap?.pages ?? 0}개
        </li>
      </ul>
    ) : (
      '• 대기 중: 목록을 불러오면 첫 진입부터 판정합니다.'
    )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useInfiniteQuery 페이지 요청·중복 방지·캐시 재사용 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="가장 최근 동작 이후의 queryFn 실행 기록, 서버가 응답에 담아 준 커서별 수신 횟수, 브라우저 Resource Timing 항목, QueryCache 상태만으로 판정합니다."
      />
      <InfiniteDeepDive />
    </div>
  )
}
