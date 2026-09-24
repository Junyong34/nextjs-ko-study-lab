'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { RUN_MODE, analyze } from '../probe'
import { useProbe } from './ProbeContext'
import { ConceptCard } from './ConceptCard'

const EXPECTED_BY_MODE = {
  production:
    '• isr-10s/ (revalidate = 10)\n' +
    '  - 렌더 후 10초 안의 요청: x-nextjs-cache HIT, 같은 렌더 ID\n' +
    '  - 10초가 지난 뒤 첫 요청: STALE, 여전히 옛 렌더 ID (응답은 기다리지 않음)\n' +
    '  - 그 다음 요청: 백그라운드 재생성이 끝나 새 렌더 ID (HIT)\n' +
    '    (재생성이 끝나기 전에 들어온 요청은 STALE·옛 ID가 이어질 수 있음)\n' +
    '  - cache-control: s-maxage=10, stale-while-revalidate=31535990 (1년 - 10초)\n' +
    '• static/ (revalidate 미지정): 몇 번을 요청해도 빌드 때의 렌더 ID 1개, s-maxage=31536000',
  development:
    '• next dev는 revalidate 값과 상관없이 page를 요청마다 렌더링하고 캐시하지 않음\n' +
    '• isr-10s/, static/ 모두 요청 수만큼 서로 다른 렌더 ID, x-nextjs-cache 헤더 없음\n' +
    '• HIT → STALE → 교체 흐름은 next build && next start에서만 실측됨',
}

export function VerificationFooter() {
  const { samples, finished } = useProbe()
  const result = analyze(samples, finished)

  const actual =
    samples.length === 0
      ? '• 아직 요청 기록이 없습니다. 위 [자동 관측] 버튼을 누르세요.'
      : result.lines.join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={`revalidate = 10 세그먼트의 시간 기반 재생성 흐름 (현재 ${RUN_MODE})`}
        expected={<>{EXPECTED_BY_MODE[RUN_MODE]}</>}
        actual={<>{actual}</>}
        isMatched={result.isMatched}
        description="판정은 실제로 받은 HTML의 렌더 ID 변화와 x-nextjs-cache 헤더로만 합니다. production에서는 STALE 응답(연속 가능)이 직전과 같은 ID이고 STALE이 끝난 다음 응답이 새 ID이면, 그리고 static/의 ID가 하나로 고정되면 검증 완료입니다."
      />
      <ConceptCard />
    </div>
  )
}
