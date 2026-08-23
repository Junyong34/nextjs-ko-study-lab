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
      <DemoDeepDiveCard title="동적 웹 앱 매니페스트 (manifest.ts) & PWA 메타데이터">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>manifest.ts</code>는 App Router 루트 세그먼트에서 <code>MetadataRoute.Manifest</code> 객체를 반환하여 PWA(Progressive Web App) 설치 매니페스트(<code>manifest.webmanifest</code>)를 동적으로 생성하고 <code>{'<'}link rel="manifest"{'>'}</code> 헤더를 주입하는 특수 파일입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>cookies()</code>나 <code>headers()</code>를 기반으로 접속 테넌트나 사용자 언어(다국어 쇼핑몰)에 맞춰 PWA 앱 이름(name/short_name), 테마 색상(theme_color), 배경색(background_color), 시작 URL(start_url)을 동적으로 분기 생성하는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>멀티 테넌트 / 다국어 PWA 지원</strong>: 단일 배포 환경에서 고객사 서브도메인이나 브라우저 언어에 따라 다른 PWA 앱 매니페스트를 제공합니다.</li>
              <li><strong>TypeScript 타입 안전성</strong>: <code>MetadataRoute.Manifest</code> 인터페이스를 통해 W3C 웹 매니페스트 표준 스펙을 컴파일 타임에 검증합니다.</li>
              <li><strong>자동 캐시 헤더 및 라우트 연결</strong>: 별도의 라우터 없이 <code>/manifest.webmanifest</code> 엔드포인트를 표준 서빙합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 다국어 이커머스의 국가별 맞춤 PWA 홈 화면 추가 설정</li>
              <li>B2B 화이트라벨 쇼핑몰 플랫폼의 테넌트별 맞춤 로고 및 테마 색상 적용</li>
              <li>모바일 웹앱의 오프라인 캐싱 및 스탠드얼론(standalone) 디스플레이 설정</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>manifest.json과의 충돌 주의</strong>: <code>public/manifest.json</code> 정적 파일이 존재하면 <code>manifest.ts</code>와 충돌할 수 있으므로 정적 파일은 삭제하고 <code>manifest.ts</code>로 단일화해야 합니다.</li>
              <li><strong>정적 빌드 최적화</strong>: 동적 요청 헤더를 읽지 않는 경우 빌드 시 정적 JSON 파일로 사전 빌드되어 CDN 캐시를 적용받습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
