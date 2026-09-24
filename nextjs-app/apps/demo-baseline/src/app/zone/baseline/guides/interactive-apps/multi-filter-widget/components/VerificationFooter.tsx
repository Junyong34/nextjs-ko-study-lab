'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { evaluate } from '../lib/inspect'
import type { NavEntry, ReloadObservation } from '../types'
import { ConceptCard } from './ConceptCard'

const EXPECTED =
  '• 매 서버 렌더에서 page가 받은 searchParams = 그 시점 브라우저 URL\n' +
  '• 필터 칩 클릭 → router.push로 URL 변경 → 서버가 새 renderId로 다시 렌더링\n' +
  '• 뒤로가기(popstate) → 이전 URL의 필터·목록이 복원\n' +
  '• 필터 이동·뒤로가기 중 장바구니 수량과 Client Component 인스턴스는 그대로\n' +
  '  (장바구니는 history에 없으므로 뒤로가기로 되돌아가지 않음)\n' +
  '• 새로고침 → URL의 필터는 서버가 다시 적용, 장바구니는 0개로 초기화'

export function VerificationFooter({ entries, reload }: { entries: NavEntry[]; reload: ReloadObservation | null }) {
  const checks = evaluate(entries, reload)
  const anyFailed = checks.some((c) => c.observed && !c.ok)
  const allPassed = checks.every((c) => c.observed && c.ok)
  const isMatched = anyFailed ? false : allPassed ? true : undefined

  const actual = checks
    .map((c) => `${c.observed ? (c.ok ? '[통과]' : '[실패]') : '[대기]'} ${c.label}\n    ${c.detail}`)
    .join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="상태 위치(URL · 서버 · 클라이언트)별 동작 검증"
        expected={<>{EXPECTED}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="관측 로그와 새로고침 전후 기록(pagehide 시점 → 새 문서 마운트 시점)을 대조합니다. 새로고침하면 관측 로그도 초기화되므로, 직전 문서의 판정 1~4는 pagehide 기록에 담아 이어 붙입니다(장바구니 복원에는 쓰지 않음). 다섯 항목이 모두 관측되면 판정되고, 하나라도 어긋나면 불일치로 표시됩니다."
      />
      <ConceptCard />
    </div>
  )
}
