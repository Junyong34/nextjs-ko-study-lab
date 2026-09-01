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

  const defaultExpected = "• generateStaticParams [category]/[id] 다중 세그먼트 조합의 동작과 기대 결과를 확인합니다."
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
        title="generateStaticParams [category]/[id] 다중 세그먼트 조합 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="generateStaticParams() 다중 중첩 세그먼트 매트릭스 조합 SSG">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>중첩된 다중 동적 라우트(예: <code>[category]/[id]</code>)에서 <code>generateStaticParams()</code>를 사용하면 부모와 자식 세그먼트의 유효한 매트릭스 조합 객체 배열(<code>[{'{'} category: 'shoes', id: '1' {'}'}, ...]</code>)을 생성하여 복합 경로 전체를 빌드 타임에 사전 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 카테고리 3종과 각 카테고리별 대표 상품 2종을 매핑하여 총 6개의 중첩 경로 조합을 도출하고, 상위 레이아웃부터 하위 상세 페이지까지 계층별로 정적 산출물을 생성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>중첩 세그먼트 탑다운(Top-down) 빌드</strong>: 상위 레이아웃과 하위 페이지의 파라미터를 유기적으로 결합하여 정적 렌더링 트리를 완성합니다.</li>
              <li><strong>무효한 URL 조합 사전 차단</strong>: <code>dynamicParams = false</code>와 결합 시 유효하지 않은 카테고리-상품 매핑(예: <code>fashion/drill</code>)의 접근을 404로 원천 차단합니다.</li>
              <li><strong>대규모 카탈로그 최적화</strong>: 부모 세그먼트에서 반환된 파라미터를 자식 <code>generateStaticParams</code>가 인수로 받아 필요한 하위만 정밀 조회합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>카테고리별 브랜드 상세 페이지 (<code>/shop/[category]/[brand]</code>)</li>
              <li>연도/월별 기획전 및 매거진 아카이브 (<code>/magazine/[year]/[month]</code>)</li>
              <li>국가/언어별 다국어 상품 상세 (<code>/[lang]/[country]/products/[id]</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>조합 폭발(Combinatorial Explosion) 방지</strong>: 세그먼트가 3단계 이상 중첩될 경우 가능한 파라미터 조합 수가 수십만 개로 급증할 수 있으므로 상위 N개 인기 조합만 선별 생성해야 합니다.</li>
              <li><strong>하위 params 전달</strong>: 부모 세그먼트의 <code>generateStaticParams</code> 결과가 자식의 <code>params</code> 인수로 전달되므로 계층별 데이터 종속성을 활용할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
