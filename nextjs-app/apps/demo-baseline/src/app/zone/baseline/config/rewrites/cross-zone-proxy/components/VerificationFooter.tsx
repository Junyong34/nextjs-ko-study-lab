'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { judge } from '../lib/judge'
import { scenarioById } from '../expectations'
import type { Measurement } from '../types'
import { CrossZoneDeepDive } from './CrossZoneDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>프록시 요청(/via-cache/*, /api/og)은 3xx 없이(redirected=false) 응답 URL이 요청 URL과 같다.</li>
    <li>/via-cache/caching/basic 응답 HTML은 /demo-static/cache/ 자산만 참조하고 X-Powered-By 헤더가 있다(cache zone은 poweredByHeader 기본값, baseline은 false).</li>
    <li>/api/og는 image/png이고, 같은 title로 받은 baseline 자체 /og와 바이트가 다르다.</li>
    <li>cache zone에 없는 경로는 cache zone의 404가 그대로 전달되고, 규칙 밖 경로(/unmatched/*)는 baseline이 404를 낸다.</li>
  </ul>
)

export function VerificationFooter({ latest }: { latest: Measurement | undefined }) {
  let isMatched: boolean | undefined
  let actual: React.ReactNode = '• 대기 중: 제목을 정하고 예측한 뒤 [요청 보내기] 버튼으로 요청을 실행하세요.'

  if (latest) {
    const checks = judge(latest)
    const upstreamDown = scenarioById(latest.scenario).proxied && latest.status >= 500
    isMatched = checks.every((c) => c.ok)
    actual = (
      <ul className="space-y-1">
        <li>요청: {scenarioById(latest.scenario).label} — {latest.requestedPath}</li>
        {upstreamDown && <li>⚠️ 업스트림(cache zone)에 연결하지 못해 Next.js가 실제 {latest.status} 응답을 돌려줬습니다. cache zone 서버가 켜져 있는지 확인하세요.</li>}
        {checks.map((c) => (
          <li key={c.label}>{c.ok ? '✅' : '❌'} {c.label}: {c.detail}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="rewrites() Zone 간 프록시 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="가장 최근 요청의 실측값(상태·redirected·응답 URL·헤더·본문의 zone 마커)만으로 판정합니다. 예측을 골랐다면 예측이 틀릴 때도 불일치로 표시됩니다."
      />
      <CrossZoneDeepDive />
    </div>
  )
}
