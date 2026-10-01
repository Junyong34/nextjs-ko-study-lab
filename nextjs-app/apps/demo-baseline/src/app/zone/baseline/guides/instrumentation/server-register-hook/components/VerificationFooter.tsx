'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { judgeBurst, judgeFail, judgeRuntimes, type Check } from '../lib/judge'
import type { ActionId, BurstResult, FailProbe, Prediction, ProbeRuntime } from '../types'
import { RegisterDeepDive } from './RegisterDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>같은 런타임에 연속 요청하는 동안 bootedAtMs·pid·registerCallCount는 한 번도 바뀌지 않는다. register()는 요청마다가 아니라 서버 인스턴스당 1회 실행된다.</li>
    <li>대조 카운터(Route Handler 모듈 안의 handlerRequestCount)는 요청마다 정확히 1씩 증가한다.</li>
    <li>Node.js와 Edge는 서로 다른 register() 호출을 가진다: 부팅 시각이 다르고 Edge에는 Node.js pid가 없다(-1).</li>
    <li>Route Handler가 예외를 던지면 500이 나고 onRequestError가 routeType=route로 1회 호출되며, register()는 다시 호출되지 않는다.</li>
  </ul>
)

const LABEL: Record<ActionId, string> = {
  'burst-nodejs': 'Node.js 핸들러 연속 요청',
  'burst-edge': 'Edge 핸들러 연속 요청',
  fail: '오류 발생(onRequestError)',
}

interface Props {
  latest: ActionId | null
  bursts: Partial<Record<ProbeRuntime, BurstResult>>
  fail: FailProbe | null
  prediction: Prediction | null
}

function checksFor({ latest, bursts, fail, prediction }: Props): Check[] {
  if (latest === 'fail') return fail ? judgeFail(fail) : []
  const b = latest === 'burst-edge' ? bursts.edge : bursts.nodejs
  if (!b) return []
  const both = bursts.nodejs && bursts.edge ? judgeRuntimes(bursts.nodejs, bursts.edge) : []
  return [...judgeBurst(b, prediction), ...both]
}

export function VerificationFooter(props: Props) {
  const checks = checksFor(props)
  const isMatched = props.latest && checks.length > 0 ? checks.every((c) => c.ok) : undefined
  const actual: React.ReactNode = props.latest ? (
    <ul className="space-y-1">
      <li>최근 실행: {LABEL[props.latest]}</li>
      {checks.map((c) => (
        <li key={c.label}>{c.ok ? '✅' : '❌'} {c.label}: {c.detail}</li>
      ))}
    </ul>
  ) : (
    '• 대기 중: 예측을 고른 뒤 [요청 보내기]의 버튼으로 실제 Route Handler에 요청하세요.'
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="register() 1회 실행·onRequestError 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="가장 최근에 실행한 동작의 Route Handler 응답(register()가 globalThis에 남긴 스냅샷, 모듈 카운터, 응답 상태, onRequestError 기록)만으로 판정합니다. 예측을 골랐다면 예측이 틀릴 때도 불일치로 표시됩니다."
      />
      <RegisterDeepDive />
    </div>
  )
}
