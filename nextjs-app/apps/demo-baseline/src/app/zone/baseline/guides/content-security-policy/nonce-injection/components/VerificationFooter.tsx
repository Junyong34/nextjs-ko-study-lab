'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { overall, type Check } from '../lib/judge'
import { CspDeepDive } from './CspDeepDive'

const EXPECTED = [
  'nonce가 일치하는 인라인 스크립트와 next/script는 실행된다',
  'nonce 없는 인라인 스크립트와 주입된 onerror 핸들러는 실행되지 않고 securitypolicyviolation이 발생한다',
  '응답 헤더의 CSP nonce와 같은 응답 HTML의 nonce 속성이 일치한다',
  '요청·새로고침마다 nonce가 달라진다',
].join('\n')

export function VerificationFooter({ checks }: { checks: Check[] }) {
  const matched = overall(checks)
  const mark = (ok: boolean | undefined) => (ok === undefined ? '[ ]' : ok ? '[O]' : '[X]')
  const actual = checks.map((c) => `${mark(c.ok)} ${c.label}\n    ${c.detail}`).join('\n')

  // ReactNode로 감싸 공용 패널의 문자열 자동 비교를 피하고 isMatched만 판정에 쓴다.
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Proxy nonce 기반 CSP 검증"
        expected={<span className="whitespace-pre-line">{EXPECTED}</span>}
        actual={<span className="whitespace-pre-line">{actual}</span>}
        isMatched={matched}
        description="브라우저가 실제로 실행·차단한 결과와 fetch로 받은 응답 헤더·HTML로만 판정합니다. [ ]는 아직 측정하지 않은 항목입니다."
      />
      <CspDeepDive />
    </div>
  )
}
