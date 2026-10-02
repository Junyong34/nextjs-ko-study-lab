'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { DEDUPING_INTERVAL } from '../hooks/useCartMutation'
import { judgeInitial, judgeMount, judgeMutation, type Verdict } from '../lib/judge'
import type { LabEvent, LatestAction } from '../types'
import { SwrDeepDive } from './SwrDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>같은 키를 읽는 컴포넌트가 둘이어도 첫 로드 GET은 1회다.</li>
    <li>수량을 바꾸면 PATCH 응답보다 먼저 화면이 낙관적 값으로 바뀐다(optimisticData).</li>
    <li>성공하면 응답 본문이 캐시에 들어가 화면이 서버 확정값이 된다(populateCache). 재고 상한에 걸리면 낙관적 값과 다르다.</li>
    <li>실패하면 화면이 변경 전 값으로 돌아가고(rollbackOnError) 서버 저장소도 그대로다.</li>
    <li>revalidate가 켜져 있으면 PATCH 응답 뒤 GET이 1회, 꺼져 있으면 0회다.</li>
    <li>마지막 GET 후 {DEDUPING_INTERVAL}ms 안에 같은 키 구독을 추가하면 새 GET이 없고, 그 뒤면 1회다.</li>
  </ul>
)

function verdictFor(latest: LatestAction | null, events: LabEvent[]): Verdict | null {
  if (!latest) return null
  return latest.type === 'mutate' ? judgeMutation(latest.run, events) : judgeMount(latest.run, events, DEDUPING_INTERVAL)
}

export function VerificationFooter({ latest, events }: { latest: LatestAction | null; events: LabEvent[] }) {
  const initial = judgeInitial(events)
  const verdict = verdictFor(latest, events)
  const checks = [...(initial ? [initial] : []), ...(verdict?.checks ?? [])]
  const isMatched = verdict ? (verdict.done ? checks.every((c) => c.ok) : undefined) : initial && !initial.ok ? false : undefined

  const title = latest?.type === 'mutate' ? `최근 실행: ${latest.run.itemName} ${latest.run.delta > 0 ? '+1' : '-1'}` : latest ? '최근 실행: 같은 키 구독 추가' : null
  const actual: React.ReactNode =
    checks.length > 0 ? (
      <ul className="space-y-1">
        {title && <li>{title}{verdict && !verdict.done ? ' — 응답 대기 중' : ''}</li>}
        {checks.map((c) => (
          <li key={c.label}>
            {c.ok ? '✅' : '❌'} {c.label}: {c.detail}
          </li>
        ))}
        {!latest && <li>• 대기 중: 수량 버튼이나 [같은 키 구독 컴포넌트 추가]를 눌러 보세요.</li>}
      </ul>
    ) : (
      '• 대기 중: 장바구니를 불러오는 중입니다.'
    )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="낙관적 갱신·롤백·중복 제거 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="브라우저가 기록한 fetch 시작·응답 시각, 화면에 실제로 그려진 값의 이력, 그리고 api/log로 다시 읽은 서버 저장소 값만으로 판정합니다. 응답이 모두 도착하기 전에는 대기 중으로 표시합니다."
      />
      <SwrDeepDive />
    </div>
  )
}
