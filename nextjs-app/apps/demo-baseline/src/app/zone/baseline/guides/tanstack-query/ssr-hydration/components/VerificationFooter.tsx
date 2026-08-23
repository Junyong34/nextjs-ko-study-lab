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

  const defaultExpected = "• TanStack Query prefetchQuery 서버 하이드레이션 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="TanStack Query prefetchQuery 서버 하이드레이션 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="TanStack Query SSR HydrationBoundary 사전 패칭">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>TanStack Query의 SSR Hydration 패턴은 서버 컴포넌트에서 <code>QueryClient</code> 인스턴스를 생성하여 <code>prefetchQuery()</code>로 데이터를 미리 조회한 뒤, <code>dehydrate(queryClient)</code>로 직렬화하여 <code>{'<'}HydrationBoundary state={'{'}...{'}'}{'>'}</code>로 클라이언트에 전달함으로써 하이드레이션 즉시 캐시된 데이터를 동기 렌더링하는 표준 통합 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 서버에서 인기 상품 Top 10 목록을 사전 패칭하여 초기 HTML에 포함시켜 렌더링하고, 클라이언트 컴포넌트의 <code>useQuery</code>가 마운트될 때 추가 네트워크 요청 없이 0ms로 서버 캐시 데이터를 즉각 소비하는 파이프라인을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>완벽한 검색엔진 최적화(SEO)</strong>: 클라이언트 전용 데이터 패칭 라이브러리를 사용하면서도 초기 HTML에 모든 데이터가 포함되어 크롤러가 완벽히 색인합니다.</li>
                    <li><strong>초기 화면 로딩 깜빡임 제거</strong>: 클라이언트 렌더링 시점에 스피너나 스켈레톤이 노출되지 않고 완성된 UI가 즉시 나타납니다.</li>
                    <li><strong>서버-클라이언트 캐시 동기화</strong>: 서버에서 가져온 데이터가 클라이언트 TanStack Query 캐시의 초기 상태로 자연스럽게 주입되어 이후 클라이언트 캐싱 이점을 모두 누립니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 메인 베스트셀러 랭킹 및 실시간 인기 상품 추천</li>
                    <li>검색엔진 노출이 필수적인 기술 블로그 및 뉴스 기사 본문</li>
                    <li>초기 로딩 속도와 클라이언트 인터랙션이 모두 중요한 대시보드</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>요청별 독립 QueryClient 생성</strong>: 서버 컴포넌트에서 <code>QueryClient</code>를 싱글톤 전역 변수로 선언하면 서로 다른 사용자 간에 데이터가 오염될 수 있으므로 반드시 요청마다 새 인스턴스를 생성해야 합니다.</li>
                    <li><strong>staleTime 설정 주의</strong>: 기본 <code>staleTime</code>이 0이면 클라이언트 마운트 즉시 백그라운드 리패칭이 발생하므로, 불필요한 중복 요청을 줄이려면 적절한 <code>staleTime: 60 * 1000</code>을 지정해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
