'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { Judgement } from '../types'
import { SsgCatalogDeepDive } from './SsgCatalogDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>generateStaticParams에 포함된 id(001~004)는 200으로 응답하고 HTML에 렌더 시각이 담긴다.</li>
    <li>목록 밖 id(005, 데이터는 있음)와 존재하지 않는 id(999)는 dynamicParams = false이므로 404다.</li>
    <li>production 빌드: 두 요청의 렌더 시각이 같다(빌드 때 고정)이고 cache-control에 no-store·no-cache가 없다. 고정 여부의 기준은 렌더 시각이며 헤더만으로는 판단하지 않는다.</li>
    <li>next dev: 요청마다 다시 렌더하므로 렌더 시각이 매번 바뀐다. x-nextjs-cache: HIT가 보여도 렌더 시각이 바뀌면 고정이 아니다. 이는 정상이며 고정 동작의 증거가 아니다.</li>
  </ul>
)

export function VerificationFooter({ judgement }: { judgement: Judgement }) {
  const { ready, mode, checks, unverified } = judgement
  const isMatched = ready ? checks.every((c) => c.ok) : undefined

  const actual: React.ReactNode = ready ? (
    <ul className="space-y-1">
      <li>실행 모드(응답의 NODE_ENV): {mode}</li>
      {checks.map((c) => (
        <li key={c.label}>
          [{c.ok ? '통과' : '실패'}] {c.label} — {c.detail}
        </li>
      ))}
      {unverified && <li>[미검증] {unverified}</li>}
    </ul>
  ) : (
    '• 대기 중: 사전 생성 id(예: 001)와 목록 밖 id(예: 005 또는 999)를 각각 [측정]하세요.'
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="generateStaticParams 사전 생성 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="실제 products/[id] 라우트를 fetch한 응답 상태·헤더·렌더 시각으로 판정합니다. 렌더 고정 여부는 응답이 알려 주는 NODE_ENV에 맞는 기대값과 비교합니다."
      />
      <SsgCatalogDeepDive />
    </div>
  )
}
