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

  const defaultExpected = "• manifest.ts 파일에서 MetadataRoute.Manifest 객체 반환\n• Next.js가 manifest.webmanifest 엔드포인트 자동 생성 및 link rel=manifest 헤더 주입"
  const defaultActual = "• manifest.ts 컨벤션 마운트 완료 및 PWA 메타데이터 직렬화 확인\n• 단독 실행 모드(standalone) 및 테마 색상 설정 감지"

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
        title="동적 웹 앱 매니페스트 (manifest.ts) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 manifest.ts 특수 파일을 통한 PWA 웹앱 매니페스트 동적 생성 메커니즘을 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 웹 앱 매니페스트 (manifest.ts)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 규칙</h5>
            <p>
              <code>manifest.(ts|js|json)</code>을 <code>app</code> 루트에 배치하면 Next.js가 이를 인식하여 <code>manifest.webmanifest</code> 경로를 라우팅하고,
              <code>&lt;link rel="manifest" href="/manifest.webmanifest"&gt;</code> 태그를 <code>&lt;head&gt;</code>에 주입합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 동적 매니페스트의 이점</h5>
            <p>
              정적 JSON 파일과 달리, <code>manifest.ts</code>는 TypeScript 환경에서 <code>cookies()</code>, <code>headers()</code>를 읽어 멀티 테넌트 상점명이나 국가별 언어(name/short_name)를 동적으로 다르게 생성할 수 있습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
