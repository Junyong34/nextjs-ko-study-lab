'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'
import { DELAY_TOLERANCE, DETAIL_DELAY_MS } from '../constants'
import { useEntrySignals } from '../hooks/useEntrySignals'
import { Lines, combine } from './VerificationLines'

/**
 * 정식 페이지(products/[id]/page.tsx)의 3단 [검증] 패널.
 * 스트리밍 여부는 HTML 응답이 도착하는 데 걸린 시간(responseEnd - responseStart)으로 본다 —
 * 첫 바이트(셸·스켈레톤)는 일찍 오고 마지막 바이트(본문)는 상세 조회가 끝난 뒤에 온다.
 */
export function DirectVerification({ productName }: { productName: string }) {
  const sig = useEntrySignals(usePathname())
  const minStream = Math.round(DETAIL_DELAY_MS * DELAY_TOLERANCE)

  const navOk = sig.measured ? sig.isHard === true : undefined
  const titleOk = sig.title ? sig.title.includes(productName) : undefined
  const streamOk = sig.streamMs === null ? undefined : sig.streamMs >= minStream

  const expected = [
    '진입: 주소 직접 입력·새로고침(하드 내비게이션) → 브라우저가 이 경로로 새 문서를 요청',
    `탭 제목: 상품명("${productName}") 포함 — generateMetadata가 서버에서 만든 값`,
    `스트리밍: HTML이 한 번에 오지 않고 ${minStream}ms 이상에 걸쳐 도착 (스켈레톤 먼저, 본문은 상세 조회 뒤)`,
  ]
  const actual = [
    sig.measured
      ? `진입: navigation.type="${sig.navigationType}", 최초 요청 ${sig.documentEntryPath} → ${sig.isHard ? '하드' : '소프트'} 내비게이션`
      : '진입: 측정 중...',
    `탭 제목: ${sig.title || '(읽는 중)'}`,
    sig.streamMs === null ? '스트리밍: 측정 중...' : `스트리밍: 응답 수신에 ${sig.streamMs}ms 소요 (responseStart → responseEnd)`,
  ]

  return (
    <ExpectedActualPanel
      title="진입 방식 실측 — 정식 페이지"
      expected={<Lines items={expected} />}
      actual={<Lines items={actual} />}
      isMatched={combine([navOk, titleOk, streamOk])}
      description="프록시·네트워크가 응답을 모아서 전달하면 스트리밍 간격이 짧게 나올 수 있습니다. 그 경우 이 항목은 실패로 표시됩니다."
    />
  )
}
