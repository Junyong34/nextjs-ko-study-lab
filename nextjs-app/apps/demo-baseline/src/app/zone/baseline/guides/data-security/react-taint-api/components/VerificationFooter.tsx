'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { TaintDemoState } from '../types'
import { ConceptSummary } from './ConceptSummary'

export function VerificationFooter({ state }: { state: TaintDemoState }) {
  const { safe, object, value, derived } = state
  const done = safe && object && value && derived
  // 네 결과 모두 실제 Server Action 호출에서 측정된 값으로만 판정한다.
  const isMatched = done
    ? !safe.blocked && !safe.secretLeaked &&
      object.blocked && !object.secretLeaked &&
      value.blocked && !value.secretLeaked &&
      !derived.blocked && derived.secretLeaked
    : undefined

  const line = (name: string, r: typeof safe) =>
    `• ${name}: ${!r ? '대기 중' : r.blocked ? '차단됨' : r.secretLeaked ? '원문 유출' : '통과(원문 없음)'}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Taint 차단 검증 결과"
        // 문자열로 넘기면 패널이 두 문자열을 자동 비교해 대기 상태에서도 불일치로 표시하므로 ReactNode로 감싼다.
        expected={
          <span className="whitespace-pre-line">
            {'• ① 마스킹 값: 통과, 원문 없음\n• ② 오염 객체: 차단됨\n• ③ 오염 값: 차단됨\n• ④ 파생 문자열: 차단되지 않고 원문 유출(taint의 한계)'}
          </span>
        }
        actual={<span className="whitespace-pre-line">{[
          line('① 마스킹 값', safe),
          line('② 오염 객체', object),
          line('③ 오염 값', value),
          line('④ 파생 문자열', derived),
          ...(isMatched === false && (object?.secretLeaked || value?.secretLeaked)
            ? ['• 오염된 값이 유출됨: experimental.taint 설정이 꺼져 있는지 확인하세요.']
            : []),
        ].join('\n')}</span>}
        isMatched={isMatched}
        description="네 버튼을 모두 눌러야 판정합니다. 각 결과는 Server Action의 실제 응답/예외를 클라이언트가 검사한 값입니다."
      />
      <ConceptSummary />
    </div>
  )
}
