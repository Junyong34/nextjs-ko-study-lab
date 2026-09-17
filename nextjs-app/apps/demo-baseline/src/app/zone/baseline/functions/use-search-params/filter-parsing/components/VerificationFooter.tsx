'use client'
import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel, MOCK_PRODUCTS } from '@study/demo-kit'
import { filterAndSortProducts } from '../filters'
import { useParsedFilters } from '../hooks/useParsedFilters'

export function VerificationFooter() {
  const { filters, hasInvalidRaw, rawQueryString } = useParsedFilters()
  const results = filterAndSortProducts(MOCK_PRODUCTS, filters)

  const categoryViolations =
    filters.category === 'all' ? 0 : results.filter((product) => product.category !== filters.category).length
  const priceViolations = results.filter((product) => product.price > filters.maxPrice).length
  const isMatched = categoryViolations === 0 && priceViolations === 0

  const expected = [
    `파싱된 조건: category=${filters.category} · sort=${filters.sort} · maxPrice≤${filters.maxPrice.toLocaleString()}원`,
    '→ 실습 화면에 표시된 모든 상품이 이 조건을 실제로 만족해야 함 (위반 0건)',
  ].join('\n')

  const actual = [
    `useSearchParams().toString() → "${rawQueryString || '(쿼리 없음)'}"`,
    `표시 상품 ${results.length}개 중 카테고리 불일치 ${categoryViolations}건, 가격 초과 ${priceViolations}건`,
    hasInvalidRaw ? '원본 쿼리에 유효하지 않은 값이 있어 자동으로 기본값으로 대체됨' : '원본 쿼리 값 전부 유효함',
  ].join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useSearchParams() 파싱 결과와 실제 필터링 결과 일치 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="이 패널은 실습 화면과 별도로 useSearchParams()를 다시 호출해 현재 URL을 읽고, 그 조건을 실제 상품 데이터에 적용한 결과가 실습 화면과 일치하는지 검증합니다."
      />
      <DemoDeepDiveCard title="useSearchParams() URL 쿼리 파싱 및 필터링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              <code>useSearchParams()</code>(<code>next/navigation</code>)는 현재 URL의 쿼리 스트링을 읽는{' '}
              <strong>클라이언트 컴포넌트 전용 훅</strong>입니다. 반환값은 읽기 전용 <code>ReadonlyURLSearchParams</code>이며,
              <code>get()</code>은 항상 <code>string | null</code>을 반환합니다 — 값이 없으면 <code>null</code>, 있으면 문자열입니다.
              숫자가 필요하면(<code>maxPrice</code>처럼) 직접 <code>Number()</code>로 변환하고 <code>NaN</code> 여부를 검증해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              [카테고리]/[정렬 기준]/[최대 가격]을 조작하면 <code>new URLSearchParams(searchParams.toString())</code>로
              현재 쿼리를 복제해 값을 갱신한 뒤 <code>router.push(pathname + '?' + params)</code>로 브라우저 URL을 실제로 바꿉니다.
              이후 <code>useSearchParams()</code>가 새 값을 반환하면서 상품 목록이 다시 계산됩니다. 유효하지 않은 값(예: 존재하지 않는
              카테고리, 숫자로 변환 불가능한 가격)이 들어오면 정의된 기본값으로 안전하게 대체합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>URL이 상태의 단일 진실 공급원(SSOT)</strong>: 필터 상태를 컴포넌트 state가 아닌 URL에 저장하므로 새로고침, 뒤로가기, 링크 공유 후에도 그대로 복원됩니다.</li>
              <li><strong>여러 컴포넌트가 독립적으로 같은 상태를 관찰</strong>: 실습 화면과 검증 패널이 각자 <code>useSearchParams()</code>를 호출해도 항상 같은 URL을 읽으므로 결과가 일치합니다.</li>
              <li><strong>웹 표준 API 재사용</strong>: <code>URLSearchParams</code> 표준 인터페이스를 그대로 따르므로 러닝 커브가 낮습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 및 핵심 팁 (Caution &amp; Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Suspense 바운더리 필수</strong>: 정적 렌더링 경로에서 <code>useSearchParams()</code>를 쓰는 클라이언트 컴포넌트는 반드시 <code>{'<'}Suspense{'>'}</code>로 감싸야 합니다. 감싸지 않으면 프로덕션 빌드가 실패합니다.</li>
              <li><strong>읽기 전용 객체 복제 후 수정</strong>: <code>searchParams</code>는 수정할 수 없으므로 <code>new URLSearchParams(searchParams.toString())</code>로 복제한 뒤 <code>set()</code>/<code>delete()</code>를 호출해야 합니다.</li>
              <li><strong>쿼리 값은 항상 문자열</strong>: <code>get()</code>이 돌려주는 값은 검증 없이 신뢰하면 안 됩니다. 이 데모처럼 허용된 목록/범위인지 확인하고 아니면 기본값으로 대체하는 방어 코드가 필요합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
