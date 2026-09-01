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

  const defaultExpected = "• 'use cache' 컴포넌트 JSX 렌더링 결과 캐싱의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="'use cache' 컴포넌트 JSX 렌더링 결과 캐싱 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                                    <DemoDeepDiveCard title="컴포넌트 JSX 레벨 'use cache' 지시어 선언">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p>컴포넌트 함수 상단에 <code>'use cache'</code>를 선언하면, 해당 컴포넌트가 렌더링한 React JSX Virtual DOM 결과물(Flight Payload) 전체가 서버 캐시에 저장되어, 이후 요청 시 컴포넌트 내부의 복잡한 연산 없이 캐시된 JSX를 0ms 즉시 반환하는 컴포넌트 캐싱 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 수만 건의 판매 통계를 집계하여 복잡한 SVG 뱃지와 마크업을 생성하는 <code>{'<'}TopSellerBanner{'>'}</code> 컴포넌트에 <code>'use cache'</code>를 적용하고, 첫 렌더링 이후 연산 비용 없이 즉각 반환되는 성능 차이를 검증합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>렌더링 연산 비용 획기적 절감</strong>: 복잡한 JSX 트리 생성 및 컴포넌트 내부 계산 로직을 매 요청마다 반복하지 않고 캐시에서 즉각 서빙합니다.</li>
                          <li><strong>부분 사전 렌더링(PPR)과의 완벽한 결합</strong>: 정적 셸뿐만 아니라 무거운 중간 위젯 컴포넌트 단위로 캐시 조각을 구성하여 유연하게 결합합니다.</li>
                          <li><strong>코드 가독성 향상</strong>: 데이터 패칭 캐싱과 UI 렌더링 캐싱을 별도로 분리하지 않고 컴포넌트 레벨에서 직관적으로 캡슐화합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>쇼핑몰 메인 상단 실시간 인기 키워드 순위 및 복합 추천 배너</li>
                          <li>수많은 카테고리 계층 구조를 렌더링하는 대형 메가 드롭다운 메뉴</li>
                          <li>푸터(Footer)의 글로벌 파트너사 목록 및 다국어 지원 언어 선택 위젯</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>Props 직렬화 필수</strong>: <code>'use cache'</code>가 적용된 컴포넌트로 전달되는 모든 Props는 캐시 키 생성 및 저장을 위해 JSON 직렬화 가능해야 합니다.</li>
                          <li><strong>컴포넌트 내부 훅 사용 불가</strong>: 서버 컴포넌트 캐싱이므로 <code>useState</code>, <code>useEffect</code> 등 클라이언트 훅은 컴포넌트 내부에서 사용할 수 없습니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
