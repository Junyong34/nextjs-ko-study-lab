'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import type { Check } from '../types'
import { ConceptSummary } from './ConceptSummary'

const BADGE = { wait: '대기', pass: '일치', fail: '불일치' } as const

export function VerificationFooter({ checks }: { checks: Check[] }) {
  const isMatched = checks.some((c) => c.state === 'fail')
    ? false
    : checks.every((c) => c.state === 'pass')
      ? true
      : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="default.tsx 폴백 검증 결과"
        description="화면의 DOM과 문서 응답(HTTP 상태, 서버가 그린 HTML)에서 읽은 값으로 판정한다. 세 항목이 모두 일치해야 성공이다."
        expected={
          <ul className="list-disc space-y-1 pl-4">
            {checks.map((c) => (
              <li key={c.id}>{c.expected}</li>
            ))}
          </ul>
        }
        actual={
          <ul className="list-disc space-y-1 pl-4">
            {checks.map((c) => (
              <li key={c.id}>
                <strong>[{BADGE[c.state]}]</strong> {c.label}: {c.actual}
              </li>
            ))}
          </ul>
        }
        isMatched={isMatched}
      />
      <ConceptSummary />
    </div>
  )
}
