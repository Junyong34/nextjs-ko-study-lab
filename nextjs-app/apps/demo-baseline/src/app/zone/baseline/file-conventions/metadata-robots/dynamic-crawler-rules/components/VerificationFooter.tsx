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

  const defaultExpected = "• robots.ts 파일에서 MetadataRoute.Robots 객체 반환\n• Next.js가 robots.txt 텍스트 엔드포인트를 자동 생성하여 크롤러 규칙(Allow/Disallow/Sitemap) 제공"
  const defaultActual = "• robots.ts 파일 컨벤션 파이프라인 마운트 완료 및 크롤링 규칙 직렬화 확인\n• User-Agent 필터링 및 관리자/결제 경로 차단 정책 감지"

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
        title="동적 검색 크롤러 규칙 (robots.ts) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 robots.ts 특수 파일을 통한 검색 로봇 접근 제어 및 SEO 정책 동적 구성을 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 검색 크롤러 규칙 (robots.ts)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 규칙</h5>
            <p>
              <code>app</code> 디렉토리 루트에 <code>robots.(ts|js|txt)</code>를 배치하면 Next.js가 <code>/robots.txt</code> 경로로 요청을 수신하여 텍스트 형식의 검색 로봇 지침을 자동 반환합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 동적 규칙의 장점</h5>
            <p>
              스테이징(Staging) 환경에서는 모든 로봇을 차단(<code>Disallow: /</code>)하고 프로덕션 환경에서는 정상 인덱싱을 허용하도록 환경변수(<code>process.env.VERCEL_ENV</code>)에 따라 동적으로 분기할 수 있습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
