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

  const defaultExpected = '• 다이나믹 라우트 세그먼트의 revalidatePath 무효화 범위와 기대 결과를 확인합니다.'
  const defaultActual = '• 사용자 조작 후 실제 결과를 표시합니다.'

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
        title="다이나믹 라우트 세그먼트의 revalidatePath 무효화 범위 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || '이 예제의 동작과 검증 결과를 표시합니다.'}
      />
      <DemoDeepDiveCard title="다이나믹 세그먼트 패턴 vs 리터럴 인스턴스 경로의 revalidatePath() 무효화 범위">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>revalidatePath(path, type)</code>의 <code>path</code>는 실제 파라미터가 바인딩된 리터럴 경로(<code>/product/1</code>)일 수도, 다이나믹 세그먼트가 남아 있는 패턴(<code>/product/[slug]</code>)일 수도 있습니다. 패턴을 전달할 때는 <code>type</code>이 필수입니다. 리터럴 경로는 그 경로 하나만, 패턴 + <code>'page'</code>는 그 패턴과 일치하는 모든 인스턴스를 무효화합니다 — 단, 하위 세그먼트(<code>/product/[slug]/[author]</code> 등)까지는 무효화하지 않습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 예제의 <code>getProductCache(id)</code>는 <code>'use cache'</code> 함수라 같은 <code>id</code> 인자로 호출되면 허브 페이지에서 직접 호출하든 <code>products/1/page.tsx</code>에서 호출하든 동일한 캐시 항목을 공유하고, 그 항목은 실제 <code>products/[id]</code> 라우트 경로를 기준으로 무효화 범위가 매겨집니다. &apos;상품 #1만 무효화&apos; 버튼은 <code>revalidatePath('/…/products/1')</code>(리터럴, type 생략)을 호출해 상품 #1 캐시 항목만 무효화합니다 — 상품 #2는 영향받지 않습니다. &apos;패턴 전체 무효화&apos; 버튼은 <code>revalidatePath('/…/products/[id]', 'page')</code>를 호출해 이 패턴과 일치하는 모든 인스턴스(#1, #2 모두)를 무효화합니다. 허브 화면의 cacheId는 실제로 이 두 상품 페이지가 쓰는 것과 동일한 캐시 항목을 읽은 값이라 무효화 결과가 그대로 반영됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정밀한 단건 갱신</strong>: 리터럴 경로로 수정된 상품 하나만 무효화해 나머지 상품의 캐시를 그대로 보존합니다.</li>
              <li><strong>일괄 스키마 변경 대응</strong>: 상품 상세 템플릿 자체가 바뀌었을 때 패턴 무효화 한 번으로 모든 인스턴스를 함께 갱신합니다.</li>
              <li><strong>별도 태그 설계 불필요</strong>: 파일 시스템 라우트 구조만으로 무효화 범위를 표현할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>특정 상품 하나의 가격·재고만 변경 → 리터럴 경로로 그 상품만 무효화</li>
              <li>상품 상세 페이지 레이아웃·공통 위젯 전면 개편 → 패턴 + <code>'page'</code>로 전체 인스턴스 일괄 무효화</li>
              <li>특정 사용자 프로필(<code>/users/[username]</code>) 단건 수정 vs 프로필 템플릿 전체 개편</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>패턴 사용 시 type 필수</strong>: <code>[id]</code>가 남아 있는 패턴 경로를 넘기면서 <code>type</code>을 생략하면 오류가 납니다. 리터럴 경로는 반대로 <code>type</code>을 생략합니다.</li>
              <li><strong>하위 세그먼트는 자동 전파 안 됨</strong>: <code>/product/[slug]</code> 패턴 무효화는 그 아래 <code>/product/[slug]/[author]</code> 같은 중첩 세그먼트까지 무효화하지 않습니다. 하위까지 포함하려면 <code>'layout'</code>을 사용해야 합니다.</li>
              <li><strong>다른 인스턴스는 그대로 유지</strong>: 리터럴 인스턴스 무효화 직후 다른 id로 이동해도 그 페이지는 여전히 이전 cacheId를 보여줍니다 — 실습화면의 링크로 직접 확인해 보세요.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
