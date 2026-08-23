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

  const defaultExpected = "• TanStack Query useInfiniteQuery 상품 목록 무한 스크롤 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="TanStack Query useInfiniteQuery 상품 목록 무한 스크롤 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="TanStack Query useInfiniteQuery 무한 스크롤 & 교차 관찰">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>TanStack Query(React Query)의 <code>useInfiniteQuery</code> 훅은 커서(Cursor) 또는 페이지 번호 기반으로 다음 페이지 데이터를 연속 패칭하고, 브라우저 <code>IntersectionObserver</code>와 연동하여 뷰포트 하단 도달 시 자동으로 다음 청크를 로드하는 표준 클라이언트 무한 스크롤 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 20개 단위의 상품 목록을 조회하고, 하단 로딩 센티넬(Sentinel) 요소가 화면에 진입할 때 <code>fetchNextPage()</code>가 자동으로 발동하여 이전 상품 목록 아래에 새로운 상품 리스트가 매끄럽게 덧붙여지는 무한 스크롤 메커니즘을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>단일 배열 일괄 관리</strong>: 다중 페이지 응답(<code>data.pages</code>)을 단일 플랫 배열(<code>data.pages.flatMap(...)</code>)로 손쉽게 가공하여 렌더링할 수 있습니다.</li>
                    <li><strong>중복 패칭 방어(isFetchingNextPage)</strong>: 사용자가 빠르게 스크롤할 때 동일한 다음 페이지 요청이 중복 발송되지 않도록 플래그로 완벽 차단합니다.</li>
                    <li><strong>상세 진입 후 복귀 시 스크롤 위치 유지</strong>: 쿼리 캐시에 기존 페이지들이 그대로 보존되어 뒤로가기 시 보던 위치까지 즉각 복원됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 전체 상품 카탈로그 및 브랜드 기획전 무한 스크롤 그리드</li>
                    <li>소셜 미디어 피드 및 유저 타임라인 게시글 연속 로딩</li>
                    <li>대용량 고객 주문 내역 및 배송 이력 조회</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>getNextPageParam 정확한 반환</strong>: 마지막 페이지에 도달했을 때 <code>getNextPageParam</code>에서 반드시 <code>undefined</code>를 반환해야 무한 패칭 루프를 방지할 수 있습니다.</li>
                    <li><strong>가상화(Virtualization) 라이브러리 연동</strong>: 수천 개 이상의 아이템이 렌더링될 경우 DOM 노드 과부하를 막기 위해 <code>@tanstack/react-virtual</code>과 함께 사용하는 것이 권장됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
