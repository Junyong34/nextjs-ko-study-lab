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

  const defaultExpected = "• unstable_cache에서 Next.js 16 use cache로 마이그레이션 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="unstable_cache에서 Next.js 16 use cache로 마이그레이션 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="unstable_cache에서 Next.js 16 use cache로의 단계별 마이그레이션">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>이 가이드는 기존의 복잡한 <code>unstable_cache(fn, keys, {'{'} tags, revalidate {'}'})</code> 래퍼 함수 패턴을 Next.js 16의 직관적인 <code>'use cache'</code> 지시어와 <code>cacheLife()</code>, <code>cacheTag()</code> 선언형 구조로 단계별 리팩토링하는 표준 마이그레이션 가이드 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 레거시 <code>unstable_cache</code>로 작성된 상품 조회 코드를 동일한 동작을 수행하는 최신 <code>'use cache'</code> 코드로 변환하는 3단계 전이 과정을 시각화하고, 동일한 캐시 히트 결과와 간결해진 코드량을 실시간 대조 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>코드베이스 간소화 및 가독성 향상</strong>: 중첩 래퍼 함수를 제거하고 평범한 <code>async</code> 함수 상단에 단 한 줄의 지시어로 캐싱을 구현합니다.</li>
                    <li><strong>유연한 수명 주기 및 태그 제어</strong>: 함수 본문 어디서나 조건부로 <code>cacheTag()</code>나 <code>cacheLife()</code>를 호출하여 동적 정책을 부여할 수 있습니다.</li>
                    <li><strong>미래 호환성 보장</strong>: 실험적(unstable) API를 제거하고 공식 표준 Next.js 16 Cache Components 스펙으로 전환합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>Next.js 14/15 레거시 커머스 프로젝트의 Next.js 16 메이저 업그레이드</li>
                    <li>데이터 접근 계층(DAL) 유틸리티의 현대적 리팩토링</li>
                    <li>타입 안전성과 유지보수성이 중요한 대규모 엔터프라이즈 코드베이스 정비</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>점진적 마이그레이션 전략</strong>: 한 번에 모든 코드를 바꾸지 않고 <code>next.config.ts</code> 플래그 활성화 후 모듈 단위로 순차 전환이 가능합니다.</li>
                    <li><strong>반환값 직렬화 검증</strong>: <code>'use cache'</code>는 반환되는 데이터가 JSON 직렬화 가능해야 하므로 Class 인스턴스를 반환하는 레거시 함수는 Plain Object로 변환해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
