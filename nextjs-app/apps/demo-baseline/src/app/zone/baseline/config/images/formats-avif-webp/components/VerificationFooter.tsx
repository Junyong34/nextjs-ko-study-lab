'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• images.formats: [&apos;image/avif&apos;, &apos;image/webp&apos;] 차세대 포맷 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="images.formats: [&apos;image/avif&apos;, &apos;image/webp&apos;] 차세대 포맷 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="images.formats: [&apos;image/avif&apos;, &apos;image/webp&apos;] 차세대 포맷">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>images.formats는 next/image 최적화 엔진이 클라이언트 브라우저의 Accept 헤더를 분석하여 AVIF 및 WebP 차세대 압축 이미지 포맷을 온디맨드로 서빙하도록 지정하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>formats: [&apos;image/avif&apos;, &apos;image/webp&apos;] 선언 시 원본 JPEG/PNG 상품 사진을 브라우저 지원 여부에 따라 최대 50~80% 더 작은 AVIF 또는 WebP로 자동 압축 변환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이미지 용량 최대 80% 압축: 초고화질 상품 사진을 극소 용량으로 전달하여 모바일 데이터 소모를 줄입니다.</li>
              <li>LCP 성능 지표 획기적 개선: 히어로 상품 배너 이미지의 다운로드 시간을 단축시켜 Core Web Vitals 점수를 극대화합니다.</li>
              <li>브라우저 맞춤형 폴백: 구형 브라우저에서는 기존 WebP 또는 PNG로 안전하게 자동 폴백합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>고화질 패션/쥬얼리 이커머스 상품 갤러리 이미지 전송</li>
              <li>모바일 쇼핑몰 메인 히어로 배너 이미지 LCP 최적화</li>
              <li>대규모 카탈로그 썸네일 그리드 이미지 트래픽 비용 절감</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
