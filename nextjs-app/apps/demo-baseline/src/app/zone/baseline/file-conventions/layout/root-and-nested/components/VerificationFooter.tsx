'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { checkNestingScope, checkRootElements, checkRootMetadata, summarize } from '../verification'
import type { CheckStatus } from '../types'
import { useObservation } from './ObservationContext'
import { ConceptCard } from './ConceptCard'

const STATUS_LABEL: Record<CheckStatus, string> = { pass: '일치', fail: '불일치', pending: '대기' }

export function VerificationFooter() {
  const { observations } = useObservation()
  const observed = Object.values(observations)

  const checks = [checkRootElements(observed), checkRootMetadata(observed), checkNestingScope(observations)]
  const isMatched = summarize(checks)

  const expected = (
    <div className="space-y-1">
      <p>• 모든 경로의 조상 체인이 {'<html lang="ko"> > <body>'}로 시작하고, 문서에 html·body가 하나씩만 있음</p>
      <p>• 모든 경로의 document.title이 루트 metadata의 “%s | Baseline 데모 - Next.js 학습” 형식</p>
      <p>• /clothing/tops: 데모 layout &gt; clothing/layout &gt; clothing/tops/layout &gt; page</p>
      <p>• /clothing/bottoms, /clothing: 데모 layout &gt; clothing/layout &gt; page</p>
      <p>• /, /electronics: 데모 layout &gt; page (의류 layout 없음)</p>
    </div>
  )

  const actual = (
    <div className="space-y-1.5">
      {checks.map((c) => (
        <p key={c.label}>
          • [{STATUS_LABEL[c.status]}] {c.label}: {c.detail}
        </p>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="루트 layout의 필수 요소와 중첩 layout의 감싸는 범위"
        className="min-w-0 break-all"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="다섯 경로를 모두 관측하고(첫 진입 1개 + Link 이동 4개 이상) 세 항목이 일치하면 검증 완료입니다. 하나라도 어긋나면 불일치입니다."
      />
      <ConceptCard />
    </div>
  )
}
