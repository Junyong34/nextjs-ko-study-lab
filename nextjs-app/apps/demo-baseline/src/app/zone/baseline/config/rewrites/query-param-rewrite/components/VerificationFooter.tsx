'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { judge } from '../lib/judge'
import { scenarioById } from '../expectations'
import type { Measurement } from '../types'
import { RewriteDeepDive } from './RewriteDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>규칙이 적용되는 요청은 응답 상태 200이고 3xx가 아니다(opaqueredirect 없음). 응답 URL은 요청 URL과 같다.</li>
    <li>렌더된 목적지는 요청 경로와 다르다: /old?id=N → products/[id], /legacy/shoes/N → lookup.</li>
    <li>목적지 searchParams에 source=rewrite가 있다. 직접 접근한 /products/N에는 없다.</li>
    <li>has(query)가 맞지 않는 요청(/old?id=abc, /old)과 page가 없는 경로는 규칙이 적용되지 않아 404다.</li>
  </ul>
)

export function VerificationFooter({ latest }: { latest: Measurement | undefined }) {
  let isMatched: boolean | undefined
  let actual: React.ReactNode = '• 대기 중: 값을 정하고 예측한 뒤 [요청 보내기] 버튼으로 요청을 실행하세요.'

  if (latest) {
    const checks = judge(latest)
    isMatched = checks.every((c) => c.ok)
    actual = (
      <ul className="space-y-1">
        <li>요청: {scenarioById(latest.scenario).label} — {latest.requestedPath}</li>
        {checks.map((c) => (
          <li key={c.label}>{c.ok ? '✅' : '❌'} {c.label}: {c.detail}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="rewrites() 쿼리 파라미터 매핑 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="가장 최근 요청의 실측값(응답 상태·응답 URL·목적지가 받은 params/searchParams)만으로 판정합니다. 예측을 골랐다면 예측이 틀릴 때도 불일치로 표시됩니다."
      />
      <RewriteDeepDive />
    </div>
  )
}
