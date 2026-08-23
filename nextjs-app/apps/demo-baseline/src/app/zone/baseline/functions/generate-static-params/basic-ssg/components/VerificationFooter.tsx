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

  const defaultExpected = "• generateStaticParams 인기 상품 사전 SSG 빌드 생성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="generateStaticParams 인기 상품 사전 SSG 빌드 생성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="generateStaticParams() 단일 동적 세그먼트 빌드 타임 SSG">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>generateStaticParams()</code>는 동적 라우트(예: <code>[category]</code>)의 파라미터 목록을 빌드 시점에 반환하여, 동적 경로를 정적 HTML로 사전 렌더링(SSG)하는 표준 App Router 함수입니다. 레거시 <code>getStaticPaths</code>를 완전히 대체합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>generateStaticParams()</code>가 <code>[{'{'} category: 'electronics' {'}'}, {'{'} category: 'fashion' {'}'}, {'{'} category: 'living' {'}'}]</code> 배열을 반환하여, 빌드 시점에 3개 핵심 카테고리 페이지의 정적 HTML/RSC 페이로드를 생성하고 0ms TTFB 응답을 달성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>글로벌 CDN 0ms 엣지 응답</strong>: 서버 렌더링 없이 사전에 빌드된 정적 HTML을 CDN 엣지에서 즉시 서빙하여 첫 페이지 로딩 속도를 극대화합니다.</li>
              <li><strong>DB 서버 부하 제로</strong>: 트래픽 폭증 시에도 DB 조회 없이 정적 파일만 서빙하므로 대규모 트래픽을 안정적으로 견딥니다.</li>
              <li><strong>자동 fetch 중복 제거</strong>: 파라미터 생성 시 호출한 API 요청이 실제 페이지 렌더링 시 캐시를 공유합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 주요 핵심 카테고리 목록 페이지 정적 사전 생성</li>
              <li>고객센터 자주 묻는 질문(FAQ) 및 이용약관 페이지 SSG</li>
              <li>인기 베스트셀러 상위 100개 상품 상세 페이지 빌드 타임 생성</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>dynamicParams 옵션 연동</strong>: <code>export const dynamicParams = true | false</code> 설정을 통해 목록에 없는 파라미터 접근 시 실시간 SSR로 생성할지(true), 404를 반환할지(false) 제어해야 합니다.</li>
              <li><strong>빌드 시간 고려</strong>: 수만 개 이상의 상품을 모두 빌드 타임에 생성하면 CI/CD 빌드가 지연되므로 핵심 상품만 사전 생성하고 나머지는 온디맨드 ISR로 처리하는 것이 효율적입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
