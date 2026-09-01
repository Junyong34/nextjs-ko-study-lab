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

  const defaultExpected = "• revalidatePath page vs layout 레벨 일괄 무효화 대조의 동작과 기대 결과를 확인합니다."
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
        title="revalidatePath page vs layout 레벨 일괄 무효화 대조 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="revalidatePath의 'page' vs 'layout' 무효화 스코프 대조">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>revalidatePath(path, type)</code>의 두 번째 인자인 <code>'page'</code>는 오직 해당 단일 페이지만 무효화하는 반면, <code>'layout'</code>은 해당 경로를 포함하여 그 하위에 존재하는 모든 중첩 라우트 세그먼트와 레이아웃 캐시를 트리 전체에 걸쳐 일괄 무효화하는 스코프 차이를 가집니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 카테고리 공통 GNB 배너가 변경되었을 때 <code>type: 'layout'</code>을 실행하여 하위 모든 상품 페이지들이 일괄 갱신되는 동작과, 개별 상품 수정 시 <code>type: 'page'</code>를 실행하여 해당 페이지만 선별 갱신되는 범위를 대조 분석합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>명확한 무효화 범위 통제</strong>: 상위 레이아웃 변경과 하위 개별 페이지 변경의 영향 범위를 정밀하게 분리하여 캐시 효율을 최적화합니다.</li>
                    <li><strong>대규모 중첩 페이지 일괄 갱신</strong>: GNB 메뉴나 사이드바 카테고리 개편 시 단 한 번의 <code>'layout'</code> 무효화로 수천 개의 하위 페이지를 일괄 최신화합니다.</li>
                    <li><strong>서버 리소스 낭비 방지</strong>: 단일 상품 설명 수정 시 불필요하게 상위 레이아웃이나 형제 페이지들까지 다시 렌더링되는 비효율을 제거합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 글로벌 헤더(GNB) 로고 및 네비게이션 메뉴 변경(layout 무효화)</li>
                    <li>특정 카테고리의 사이드바 배너 변경(category layout 무효화)</li>
                    <li>단일 상품 상세 정보 및 리뷰 갱신(page 무효화)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>기본값은 'page'</strong>: 두 번째 인자를 생략하면 기본값으로 <code>'page'</code>가 적용되므로 하위 중첩 페이지까지 갱신하려면 반드시 <code>'layout'</code>을 명시해야 합니다.</li>
                    <li><strong>루트 레이아웃 무효화 주의</strong>: <code>revalidatePath('/', 'layout')</code>을 실행하면 전체 사이트의 모든 캐시가 무효화되므로 대규모 트래픽 환경에서는 극히 신중해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
