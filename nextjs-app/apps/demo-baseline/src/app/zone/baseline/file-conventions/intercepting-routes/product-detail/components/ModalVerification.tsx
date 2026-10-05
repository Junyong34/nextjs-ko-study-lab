'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'
import { DELAY_TOLERANCE, DETAIL_DELAY_MS } from '../constants'
import { useEntrySignals } from '../hooks/useEntrySignals'
import type { DetailLoaderState } from '../hooks/useDetailLoader'
import { Lines, combine } from './VerificationLines'

/**
 * 모달 안의 3단 [검증] 패널. 이 컴포넌트는 @modal/(.)products/[id]/page.tsx에서만 호출되므로
 * "모달로 렌더됐다"는 사실은 호출 위치가 정한다. 아래 세 항목은 모두 브라우저 관측값이다.
 */
export function ModalVerification({ hasSeed, loader }: { hasSeed: boolean; loader: DetailLoaderState }) {
  const sig = useEntrySignals(usePathname())
  const { detail, summaryAt, detailAt } = loader

  const gap = summaryAt !== null && detailAt !== null ? Math.round(detailAt - summaryAt) : null
  const minGap = Math.round(DETAIL_DELAY_MS * DELAY_TOLERANCE)

  const navOk = sig.measured ? sig.isHard === false : undefined
  const gapOk = gap === null ? undefined : hasSeed ? gap >= minGap : gap <= 50
  const titleOk = detail ? !sig.title.includes(detail.name) : undefined

  const expected = [
    '진입: 앱 안에서 이동(소프트 내비게이션) → 문서를 다시 요청하지 않고 가로챔',
    hasSeed
      ? `순서: 요약이 먼저 보이고, 상세는 약 ${DETAIL_DELAY_MS}ms 뒤 도착 (간격 ≥ ${minGap}ms)`
      : '순서: 요약이 없으므로 스켈레톤 뒤 요약과 상세가 함께 표시 (간격 ≈ 0ms)',
    '탭 제목: 목록 화면 제목 그대로 (상품명 없음 — 가로챈 쪽에는 generateMetadata가 없다)',
  ]
  const actual = [
    sig.measured
      ? `진입: navigation.type="${sig.navigationType}", 최초 요청 ${sig.documentEntryPath} → ${sig.isHard ? '하드' : '소프트'} 내비게이션`
      : '진입: 측정 중...',
    gap === null ? '순서: 상세 도착 대기 중...' : `순서: 요약 표시 → 상세 도착 간격 ${gap}ms`,
    `탭 제목: ${sig.title || '(읽는 중)'}${detail ? ` · 상품명 포함 여부 ${sig.title.includes(detail.name) ? '포함' : '없음'}` : ''}`,
  ]

  return (
    <ExpectedActualPanel
      title="진입 방식 실측 — 가로챈 화면(모달)"
      expected={<Lines items={expected} />}
      actual={<Lines items={actual} />}
      isMatched={combine([navOk, gapOk, titleOk])}
      description="Navigation Timing, performance.now(), document.title을 읽어 판정합니다. 상세 지연 2초는 학습용으로 넣은 값입니다."
    />
  )
}
