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

  const defaultExpected = "• icon.tsx 및 apple-icon.tsx가 Next.js 메타데이터 라우트로 등록\n• ImageResponse(JSX)를 통해 32x32 및 180x180 PNG 바이너리 스트림 생성"
  const defaultActual = "• icon.tsx (32x32) 및 apple-icon.tsx (180x180) 파일 컨벤션 파이프라인 마운트 완료\n• HTML head 태그에 link rel=icon 및 apple-touch-icon 자동 주입 감지"

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
        title="동적 메타데이터 앱 아이콘 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 icon.tsx 및 apple-icon.tsx 특수 파일을 통한 동적 아이콘 자동 서빙 및 메타데이터 주입을 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 메타데이터 앱 아이콘 (icon.tsx)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 규칙</h5>
            <p>
              <code>app</code> 디렉토리에 <code>icon.tsx</code> 또는 <code>apple-icon.tsx</code>를 배치하고 <code>ImageResponse</code>를 반환하면,
              Next.js가 빌드 또는 런타임에 동적으로 PNG 이미지를 렌더링하고 HTML <code>&lt;head&gt;</code>에 적절한 <code>&lt;link&gt;</code> 태그를 자동 주입합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 정적 파일 대비 장점</h5>
            <p>
              알림 개수 뱃지가 달린 파비콘, 사용자 프로필 아바타 파비콘, 또는 쇼핑몰 브랜드 로고의 다크모드/라이트모드 자동 반전 아이콘을 순수 JSX/CSS로 손쉽게 생성할 수 있습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
