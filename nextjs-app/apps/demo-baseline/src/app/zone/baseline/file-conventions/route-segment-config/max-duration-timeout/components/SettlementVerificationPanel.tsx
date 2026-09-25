'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { SettlementRunOutcome } from '../types'

export interface SettlementVerificationPanelProps {
  outcome: SettlementRunOutcome | null
  pendingSource: 'server-action' | 'route-handler' | null
}

const EXPECTED_NODE = (
  <span className="whitespace-pre-line">
    {'• maxDuration은 초 단위로 서버 로직의 최대 실행 시간을 "배포 플랫폼"에 전달하는 설정값이다.\n'}
    {'• Server Action은 자체 선언이 없고, 호출한 page.tsx의 maxDuration(페이지 레벨)을 따른다.\n'}
    {'• 로컬 next dev/start 서버는 이 값을 강제 종료 기준으로 쓰지 않는다 — 초과해도 요청은 끝까지 실행되어 HTTP 200으로 완료된다.'}
  </span>
)

/**
 * ExpectedActualPanel은 expected/actual이 둘 다 string이고 isMatched를 명시하지 않으면
 * (또는 undefined를 그대로 넘기면) 문자열 trim 비교로 자체 판정해 버려, "아직 실행 전" 같은
 * 중립 상태에서도 엉뚱하게 불일치로 보일 수 있다. 이를 피하기 위해 expected/actual을 항상
 * JSX(span)로 감싸고, isMatched는 우리가 계산한 실제 tri-state(boolean | undefined)를 명시적으로 넘긴다.
 */
export function SettlementVerificationPanel({ outcome, pendingSource }: SettlementVerificationPanelProps) {
  const isMatched: boolean | undefined = outcome ? (outcome.error ? false : Boolean(outcome.result)) : undefined

  let actualNode: React.ReactNode
  if (pendingSource) {
    actualNode = <span>• 요청 진행 중입니다. 완료되면 서버가 반환한 실측값으로 갱신됩니다.</span>
  } else if (!outcome) {
    actualNode = <span>• 아직 실행하지 않았습니다. 위 실습 화면에서 버튼을 눌러 정산 배치를 실행해 주세요.</span>
  } else if (outcome.error) {
    actualNode = <span>{`• [${outcome.source}] 요청 자체가 실패했습니다: ${outcome.error}`}</span>
  } else if (outcome.result) {
    const r = outcome.result
    const limitMs = r.declaredMaxDurationSeconds * 1000
    actualNode = (
      <span className="whitespace-pre-line">
        {`• [${r.source === 'server-action' ? 'Server Action' : 'Route Handler'}] HTTP ${outcome.httpStatus ?? '—'}\n`}
        {`• 선언된 maxDuration: ${r.declaredMaxDurationSeconds}초 (${limitMs}ms) — 응답 본문의 declaredMaxDurationSeconds 필드값\n`}
        {`• 서버 측 실측 처리 시간: ${r.elapsedMs}ms (Date.now() 차이, 주문 ${r.orderCount}건 × 건당 ${r.perOrderMs}ms)\n`}
        {`• 클라이언트 왕복 시간: ${outcome.clientRoundTripMs ?? '—'}ms (네트워크 왕복 포함)\n`}
        {`• ${r.exceededDeclaredLimit ? '선언값을 초과했지만 로컬은 강제 종료 없이 정상 완료됨' : '선언값 이내로 완료됨'}`}
      </span>
    )
  } else {
    actualNode = <span>• 결과를 확인할 수 없습니다.</span>
  }

  return (
    <ExpectedActualPanel
      title="maxDuration 선언값 대비 로컬 실행 결과"
      expected={EXPECTED_NODE}
      actual={actualNode}
      isMatched={isMatched}
      description="로컬에서 관찰 가능: 소스에 선언된 maxDuration 값, 실제 처리 소요 시간(ms), 초과 여부, HTTP 상태. 로컬에서 검증 불가: 배포 플랫폼(Vercel 등)이 maxDuration 초과 시 함수를 실제로 강제 종료하는 동작 — 이 데모는 그 강제 종료를 흉내 내지 않는다."
    />
  )
}
