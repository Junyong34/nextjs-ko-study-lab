'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'
import { useNavigationEntry } from '../hooks/useNavigationEntry'
import type { EntryMode } from '../types'

const MODE_LABEL: Record<EntryMode, string> = {
  modal: '모달 인터셉트 (@modal/(.)target/[id]/page.tsx)',
  direct: '전체 페이지 (target/[id]/page.tsx)',
}

/**
 * 3단 [검증] 패널. mode는 useState 토글이 아니라 "이 컴포넌트를 호출한 파일"이 그대로
 * 넘기는 구조적 사실이다 — 모달 슬롯에서 호출되면 항상 'modal', 독립 라우트에서
 * 호출되면 항상 'direct'다. Actual 값은 브라우저의 실제 Navigation Timing API를 읽어
 * 채운다.
 *
 * ExpectedActualPanel의 자동 매칭 로직은 expected/actual이 둘 다 문자열일 때만
 * trim 비교를 시도하는데, 측정 전(null) 상태에서 문자열을 그대로 넘기면 의도치 않게
 * "불일치"로 잘못 표시되는 버그가 있다. 이를 피하기 위해 expected/actual을 항상
 * React 엘리먼트(JSX)로 감싸 전달하고, isMatched는 측정이 끝났을 때만 명시적으로
 * boolean을 넘긴다(그 전에는 undefined를 그대로 전달해 "대기 중" 상태를 유지).
 */
export function NavigationVerification({ mode, itemId }: { mode: EntryMode; itemId: string }) {
  const pathname = usePathname()
  const signal = useNavigationEntry(pathname)

  const measured = signal.isHardNavigation !== null
  const expectedHard = mode === 'direct'
  const isMatched = measured ? signal.isHardNavigation === expectedHard : undefined

  const expectedNode = (
    <span>
      {mode === 'modal'
        ? '소프트 내비게이션(<Link>) 진입 → 문서 재요청 없이 모달로 가로채짐 (하드 내비게이션 아님)'
        : '하드 내비게이션(새 탭 직접 진입 / 새로고침) → 브라우저가 이 경로로 새 문서를 요청함'}
    </span>
  )

  const actualNode = (
    <span>
      {measured ? (
        <>
          {'navigation.type = "'}
          {signal.navigationType}
          {'"\n'}
          {'문서 최초 요청 경로 = '}
          {signal.documentEntryPath}
          {'\n현재 렌더 경로 = '}
          {signal.currentPath}
          {'\n판정 = '}
          {signal.isHardNavigation ? '하드 내비게이션' : '소프트 내비게이션(가로채기)'}
        </>
      ) : (
        '측정 중... (Navigation Timing API 로딩)'
      )}
    </span>
  )

  return (
    <ExpectedActualPanel
      title={`내비게이션 실측 — ${MODE_LABEL[mode]}`}
      expected={expectedNode}
      actual={actualNode}
      isMatched={isMatched}
      description={`URL: .../target/${itemId} · performance.getEntriesByType('navigation')[0] 값을 실시간으로 읽어 판정합니다.`}
    />
  )
}
