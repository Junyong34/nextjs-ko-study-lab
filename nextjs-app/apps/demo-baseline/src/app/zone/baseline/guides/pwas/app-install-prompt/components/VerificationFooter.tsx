'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { EXPECTED, judgeLab } from '../lib/judge'
import type { ActionResult, ManifestReport, SwSnapshot } from '../types'
import { ConceptDeepDive } from './ConceptDeepDive'

interface Props {
  manifest: ManifestReport | null
  snapshot: SwSnapshot
  register: ActionResult | null
  wide: ActionResult | null
  promptReady: boolean
  installed: boolean
}

export function VerificationFooter(props: Props) {
  const { isMatched, actual, description } = judgeLab(props)
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="manifest · 서비스 워커 · scope 검증 결과"
        // 문자열 둘을 넘기면 isMatched가 undefined(대기)일 때 패널이 자동 비교해 '불일치'로 표시한다. 노드로 감싸 막는다.
        expected={<>{EXPECTED}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description={description}
      />
      <ConceptDeepDive />
    </div>
  )
}
