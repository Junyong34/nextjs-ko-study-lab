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

  const defaultExpected = "• 'use cache' 지시어를 통한 비동기 함수 결과 캐싱의 동작과 기대 결과를 확인합니다."
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
        title="'use cache' 지시어를 통한 비동기 함수 결과 캐싱 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                                    <DemoDeepDiveCard title="비동기 함수 레벨 'use cache' 지시어 선언">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p>비동기 함수 본문 상단에 <code>'use cache'</code>를 선언하면, 함수의 인자(Arguments)를 기반으로 고유한 캐시 키를 자동 생성하여 DB 쿼리나 무거운 비즈니스 연산 결과를 서버 캐시에 저장하고 재사용하는 차세대 함수 캐싱 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 상품 카테고리별 복합 집계 쿼리를 수행하는 <code>getCategoryStats(categoryId)</code> 함수에 <code>'use cache'</code>를 적용하고, 동일 카테고리 ID 호출 시 100ms의 DB 조회가 0ms 캐시 응답으로 대체되는 흐름을 확인합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>자동 인자 직렬화 캐시 키 생성</strong>: 과거 <code>unstable_cache</code>처럼 수동으로 캐시 키 배열을 문자열로 조합하던 번거로움과 휴먼 에러를 완전히 제거합니다.</li>
                          <li><strong>다중 컴포넌트 간 결과 공유</strong>: 서로 다른 서버 컴포넌트에서 동일 함수를 동일 인자로 호출해도 캐시된 단일 결과를 공유하여 DB 부하를 차단합니다.</li>
                          <li><strong>모듈화된 비즈니스 로직 캡슐화</strong>: 데이터 접근 계층(DAL) 함수 내부에 캐싱 정책을 직접 캡슐화하여 UI 코드와 분리합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>쇼핑몰 카테고리별 실시간 상품 수량 및 최저가/최고가 가격대 집계</li>
                          <li>외부 결제사/배송사 요율표 및 국가별 환율 변환 계산 함수</li>
                          <li>추천 머신러닝 엔진의 상품 유사도 점수 계산 로직 캐싱</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>비동기(async) 함수 필수</strong>: <code>'use cache'</code>는 반드시 <code>async</code> 비동기 함수 내부에서만 선언할 수 있습니다.</li>
                          <li><strong>파일 레벨 'use cache' 선언</strong>: 파일 상단에 <code>'use cache'</code>를 선언하면 해당 파일에서 export되는 모든 함수에 캐싱이 일괄 적용됩니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
