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

  const defaultExpected = "• opengraph-image.tsx 및 twitter-image.tsx 파일에서 ImageResponse 반환\n• Next.js가 1200x630 및 1200x600 규격의 이미지 엔드포인트를 생성하고 meta property=og:image 주입"
  const defaultActual = "• opengraph-image.tsx (1200x630) 및 twitter-image.tsx (1200x600) 파이프라인 생성 완료\n• SNS 공유용 동적 이미지 바이너리 렌더링 확인"

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
        title="동적 OpenGraph / Twitter 이미지 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 opengraph-image.tsx 특수 파일을 통한 SNS 공유 카드 썸네일 동적 생성 메커니즘을 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 OpenGraph 이미지 (opengraph-image.tsx)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 규칙</h5>
            <p>
              <code>opengraph-image.(tsx|ts|png)</code> 파일을 특정 라우트 세그먼트에 배치하면 Next.js가 해당 경로에 대한 고유한 OpenGraph 이미지를 자동으로 서빙하고 메타 태그를 생성합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 동적 상품 썸네일 생성</h5>
            <p>
              상품 상세 페이지(<code>/products/[id]/opengraph-image.tsx</code>)에서 <code>params</code>를 받아 상품명, 가격, 할인율 뱃지가 포함된 맞춤형 카카오톡/페이스북/트위터 공유 이미지를 서버리스 환경에서 실시간으로 렌더링할 수 있습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
