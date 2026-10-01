'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { ProbeSnapshot } from '../hooks/useInjectionProbe'
import { judge } from '../lib/judge'
import { InjectionDeepDive } from './InjectionDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>선언한 키는 서버와 브라우저 모두에서 점 접근(process.env.KEY)이 선언값과 같다 — NEXT_PUBLIC_ 접두사가 없어도 번들에 인라인된다.</li>
    <li>동적 접근(process.env[key])은 서버·브라우저 모두 undefined다 — 치환 대상 식별자가 아니고, env 필드 값은 실제 process.env에 들어가지 않는다.</li>
    <li>선언하지 않은 키는 점 접근도 undefined다.</li>
    <li>브라우저가 내려받은 클라이언트 JS 청크에 선언값 문자열이 들어 있고, 치환되지 않은 process.env.KEY 식별자는 남아 있지 않다.</li>
  </ul>
)

export function VerificationFooter({ snapshot, expected }: { snapshot: ProbeSnapshot | null; expected: string }) {
  const checks = snapshot ? judge(snapshot, expected) : null
  const isMatched = checks ? checks.every((c) => c.ok) : undefined
  const actual = checks ? (
    <ul className="space-y-1">
      {checks.map((c) => (
        <li key={c.label}>
          {c.ok ? '일치' : '불일치'} · {c.label}: {c.detail}
        </li>
      ))}
    </ul>
  ) : (
    '• 대기 중: [서버·브라우저 값 읽기 + 청크 검색]을 실행하세요.'
  )
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="env 필드 빌드 타임 인라인 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="서버·브라우저·청크 파일에서 실제로 측정한 값으로만 판정합니다. next.config의 값을 바꾸고 dev 서버를 재시작하지 않으면 선언값과 달라 불일치가 표시됩니다."
      />
      <InjectionDeepDive />
    </div>
  )
}
