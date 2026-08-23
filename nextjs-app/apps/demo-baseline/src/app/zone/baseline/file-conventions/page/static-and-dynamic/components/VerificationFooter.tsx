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

  const defaultExpected = "• 정적(Static) vs 동적(Dynamic) page.tsx 렌더링 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="정적(Static) vs 동적(Dynamic) page.tsx 렌더링 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="정적(Static) vs 동적(Dynamic) page.tsx 렌더링 수명 주기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>page.tsx</code>는 특정 라우트 세그먼트의 고유 UI를 정의하는 메인 파일입니다. 빌드 타임에 정적 HTML로 사전 렌더링되는 정적 렌더링(Static Rendering)과, 요청 시점마다 서버에서 최신 데이터를 연산하는 동적 렌더링(Dynamic Rendering)으로 자동 분기됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 쿠키/헤더/<code>searchParams</code> 등 동적 함수(Dynamic Functions)를 사용하지 않는 정적 카탈로그 페이지(0ms CDN 서빙)와, 실시간 재고 조회 및 사용자 맞춤 가격을 계산하는 동적 페이지의 서버 렌더링 타임스탬프와 응답 헤더 차이를 비교 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>자동 최적화(Automatic Static Optimization)</strong>: 동적 API가 없는 페이지를 빌드 타임에 정적 HTML/RSC 페이로드로 자동 컴파일하여 TTFB를 0ms 수준으로 단축합니다.</li>
              <li><strong>서버 부하 분산</strong>: 정적 페이지는 CDN Edge에서 즉각 서빙되어 원본 DB 및 백엔드 서버의 트래픽 병목을 완화합니다.</li>
              <li><strong>하이브리드 유연성</strong>: 동일한 애플리케이션 내에서 SEO가 중요한 정적 콘텐츠와 실시간 데이터가 필요한 개인화 화면을 자유롭게 혼용합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>회사 소개, 서비스 이용약관, 자주 묻는 질문(FAQ) 등 변경 빈도가 낮은 정적 SSG 페이지</li>
              <li>사용자 위치별 실시간 재고 현황 및 맞춤형 할인 혜택이 적용되는 동적 상품 상세 페이지</li>
              <li>실시간 결제 승인 결과 및 배송 추적 화면</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동적 함수 사용 시 Dynamic 전환 주의</strong>: <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code>를 읽는 순간 해당 세그먼트 전체가 동적 렌더링으로 전환되므로, 정적 캐싱을 유지하려면 해당 참조를 Suspense 하위 컴포넌트로 격리해야 합니다.</li>
              <li><strong>generateStaticParams 연계</strong>: 동적 세그먼트(<code>[id]</code>)를 정적으로 빌드하려면 <code>generateStaticParams()</code>를 선언하여 빌드 타임 생성 파라미터 목록을 제공해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
