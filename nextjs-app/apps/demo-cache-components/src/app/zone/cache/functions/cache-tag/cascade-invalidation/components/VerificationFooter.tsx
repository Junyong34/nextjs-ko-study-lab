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

  const defaultExpected = "• cacheTag 연쇄 무효화 (Cascade Invalidation) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="cacheTag 연쇄 무효화 (Cascade Invalidation) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="cacheTag() 계층적 태그 바인딩 및 연쇄 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>cacheTag(...tags)</code>는 <code>'use cache'</code> 함수에 여러 개의 계층적 태그(e.g. <code>'product-101'</code>, <code>'category-shoes'</code>, <code>'brand-nike'</code>)를 동시에 바인딩하여, 상위 카테고리나 브랜드 태그 하나만 <code>revalidateTag()</code>해도 하위 모든 연관 상품 캐시가 연쇄 무효화되는 다계층 캐싱 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 나이키 러닝화 상품에 [단건 ID], [카테고리: 신발], [브랜드: 나이키] 3개의 태그를 바인딩하고, [브랜드 태그 무효화] 실행 시 해당 브랜드의 모든 상품 캐시가 한 번에 일괄 갱신되는 계층적 캐시 전파 과정을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>초정밀 다차원 무효화</strong>: 단일 상품 수정, 카테고리 기획전 개편, 브랜드 전관 할인 등 다양한 비즈니스 이벤트에 맞춰 유연하게 무효화 범위를 설정합니다.</li>
                    <li><strong>네트워크 왕복 최소화</strong>: 수백 개의 개별 캐시 엔트리를 일일이 조회하여 지우지 않고 단 1회의 태그 퍼지로 일괄 무효화합니다.</li>
                    <li><strong>도메인 주도 캐시 아키텍처</strong>: 데이터베이스 관계형 스키마(1:N, N:M)를 캐시 태그 구조에 그대로 반영하여 데이터 일관성을 유지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>브랜드 할인 프로모션 시작 시 해당 브랜드의 모든 상품 캐시 일괄 무효화</li>
                    <li>카테고리 구조 개편 시 상위 카테고리 태그 기반 연쇄 캐시 갱신</li>
                    <li>판매자 계정 정지 시 해당 판매자의 모든 등록 상품 캐시 즉각 차단</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>태그 네임스페이스 규칙 수립</strong>: 태그 충돌을 방지하기 위해 <code>domain:entity:id</code>(e.g. <code>shop:brand:nike</code>)와 같이 명확한 콜론 또는 하이픈 네임스페이스 컨벤션을 사용해야 합니다.</li>
                    <li><strong>태그 수 한도 고려</strong>: 하나의 캐시 엔트리에 수백 개의 과도한 태그를 바인딩하면 인덱싱 오버헤드가 발생하므로 3~5개 수준의 의미 있는 계층 태그를 권장합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
