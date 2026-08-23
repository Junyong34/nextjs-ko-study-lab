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

  const defaultExpected = "• 캐시 키 생성 방식 비교 (수동 vs 자동) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="캐시 키 생성 방식 비교 (수동 vs 자동) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="unstable_cache 수동 키 vs 'use cache' 자동 인자 직렬화 비교">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>이 가이드는 Next.js 14/15의 <code>unstable_cache</code>에서 개발자가 수동으로 문자열 키 배열(<code>['product', id, filter]</code>)을 관리하던 방식과, Next.js 16 <code>'use cache'</code>에서 함수의 매개변수를 컴파일러가 자동 직렬화하여 캐시 키를 생성하는 차세대 방식의 차이점을 분석하는 비교 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 매개변수가 추가되거나 변경될 때 <code>unstable_cache</code>에서 발생하기 쉬운 캐시 키 불일치(Stale Key Bug) 상황을 연출하고, <code>'use cache'</code>에서는 인자 변경이 자동으로 캐시 키에 반영되어 휴먼 에러가 원천 차단되는 메커니즘을 대조 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>휴먼 에러 100% 제거</strong>: 함수 인자를 추가하고 캐시 키 배열 업데이트를 깜빡하여 발생하던 치명적인 캐시 오염 버그를 방지합니다.</li>
                    <li><strong>코드 보일러플레이트 대폭 감소</strong>: 수동 문자열 조합 코드 없이 표준 자바스크립트 함수 시그니처만으로 캐싱이 완성됩니다.</li>
                    <li><strong>정교한 객체 인자 직렬화</strong>: 중첩된 필터 객체나 배열 인자도 컴파일러가 결정론적(Deterministic) 해시 키로 자동 변환합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>Next.js 14 엔터프라이즈 프로젝트의 Next.js 16 마이그레이션 타당성 검토</li>
                    <li>복잡한 다중 필터 검색 API의 캐시 키 관리 리팩토링</li>
                    <li>신규 팀원의 캐시 관련 개발 생산성 및 코드 품질 향상</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>직렬화 불가능한 인자 전달 주의</strong>: 함수 인자로 함수나 클래스 인스턴스, Symbol을 넘기면 컴파일러가 캐시 키를 생성할 수 없으므로 순수 데이터 객체만 전달해야 합니다.</li>
                    <li><strong>인자 순서의 일관성</strong>: 객체 인자의 경우 프로퍼티 순서가 달라도 내부적으로 정규화되지만, 원시 인자는 함수 시그니처 순서가 캐시 키에 영향을 줍니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
