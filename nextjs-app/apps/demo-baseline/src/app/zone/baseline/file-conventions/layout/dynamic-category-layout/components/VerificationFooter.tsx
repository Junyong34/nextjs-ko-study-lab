'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { useObservation } from './ObservationContext'
import { ConceptCard } from './ConceptCard'
import {
  checkCategoryChange,
  checkNoSearchParams,
  checkParamsScope,
  checkSameCategory,
  summarize,
} from '../verification'
import type { CheckStatus } from '../types'

const STATUS_LABEL: Record<CheckStatus, string> = { pass: '일치', fail: '불일치', pending: '대기' }

export function VerificationFooter() {
  const { latestLayout, sameCategory, categoryChange, itemEvidence, queryEvidence } = useObservation()

  const checks = [
    checkParamsScope(itemEvidence),
    checkNoSearchParams(queryEvidence),
    checkSameCategory(sameCategory),
    checkCategoryChange(categoryChange),
  ]
  const isMatched = summarize(checks)

  const expected = (
    <div className="space-y-1">
      <p>• 상품 상세에서도 layout의 params는 {'{"category":…}'}뿐이고 item 키는 page params에만 있음</p>
      <p>• 쿼리가 붙어도 layout props 키에 searchParams가 없음 (page만 받음)</p>
      <p>• 같은 category 안 이동: render ID·mount ID·메모·카운터 그대로</p>
      <p>• category 변경: render ID·mount ID가 새로 바뀌고 메모·카운터는 초기값</p>
    </div>
  )

  const actual = (
    <div className="space-y-1.5">
      <p>
        • 현재 layout: {latestLayout ? `${latestLayout.paramsJson}, render ${latestLayout.renderId.slice(0, 8)}` : '카테고리 경로 대기 중'}
      </p>
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
        title="동적 세그먼트 layout의 params 범위와 재렌더 경계"
        className="min-w-0 break-all"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="네 항목을 실제 Link 이동으로 모두 관측하면 검증 완료, 하나라도 어긋나면 불일치입니다. 메모·카운터를 바꾸지 않고 이동하면 판정하지 않습니다."
      />
      <ConceptCard />
    </div>
  )
}
