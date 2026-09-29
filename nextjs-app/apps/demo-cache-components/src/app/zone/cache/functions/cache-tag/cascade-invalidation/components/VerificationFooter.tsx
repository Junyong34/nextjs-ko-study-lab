'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CategorySummary, ProductListResult } from '../cachedData'

interface VerificationFooterProps {
  category: CategorySummary
  productList: ProductListResult
}

export function VerificationFooter({ category, productList }: VerificationFooterProps) {
  const isLoaded = Boolean(category.cacheId && productList.cacheId)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="cacheTag 연쇄 무효화 (Cascade Invalidation) 검증 결과"
        expected="카테고리 태그를 무효화하면 category·products cacheId가 함께 바뀌고, 상품 태그만 무효화하면 products cacheId만 바뀐다."
        actual={`- category cacheId: #${category.cacheId} (${category.generatedAt})\n- products cacheId: #${productList.cacheId} (${productList.generatedAt})`}
        isMatched={isLoaded}
        description="위 실습화면에서 두 버튼을 각각 눌러 cacheId가 어떻게 바뀌는지 비교하세요."
      />
      <DemoDeepDiveCard title="cacheTag() 상위 태그 공유를 통한 연쇄 무효화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              서로 다른 두 <code>&apos;use cache&apos;</code> 함수가 <code>cacheTag()</code>로 같은 태그를 공유하면, 그 태그 하나를 <code>revalidateTag(tag, &apos;max&apos;)</code>로 무효화할 때 그 태그를 공유하는 모든 캐시 항목이 함께 stale로 표시된다. 이것이 연쇄 무효화(Cascade Invalidation)다 — 한 캐시가 다른 캐시를 호출해서 전파되는 것이 아니라, 두 캐시 항목이 같은 태그를 나눠 가지기 때문에 함께 무효화되는 것이다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 데모 예제 기반 동작 원리</h5>
            <p>
              <code>getCategorySummaryCache()</code>는 <code>cacheTag(&apos;cascade-invalidation:category&apos;)</code>만 등록한다. <code>getProductListCache()</code>는 내부에서 <code>getCategorySummaryCache()</code>를 호출해 상품 목록과 함께 반환하면서, 자신의 <code>cacheTag()</code>에 <code>&apos;cascade-invalidation:category&apos;</code>와 <code>&apos;cascade-invalidation:products&apos;</code> 두 태그를 모두 등록한다. 그 결과 category 태그는 두 캐시 항목 모두에 걸려 있고, products 태그는 상품 목록 캐시에만 걸려 있다. 카테고리 태그를 무효화하면 두 항목이 모두 stale이 되지만, 상품 태그만 무효화하면 상품 목록 캐시만 stale이 되고 카테고리 요약 캐시는 영향받지 않는다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><strong>상위 이벤트 하나로 관련 캐시 일괄 무효화</strong>: 카테고리 정보가 바뀌면, 그 카테고리를 참조하는 모든 하위 캐시(상품 목록, 필터, 배너 등)에 같은 상위 태그를 심어 두고 한 번의 <code>revalidateTag</code>로 전부 갱신할 수 있다.</li>
              <li><strong>세밀한 무효화 범위 제어</strong>: 하위 전용 태그(products)로만 무효화하면 상위 데이터(category)는 그대로 두고 하위 데이터만 갱신할 수 있다.</li>
            </ul>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>카테고리 이름·설명 변경 시 그 카테고리를 참조하는 모든 상품 목록 캐시를 함께 갱신</li>
              <li>매장/판매자 정보 변경 시 그 매장에 속한 모든 상품 캐시를 함께 갱신</li>
            </ul>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><strong>자동 전파가 아니다</strong>: <code>'use cache'</code> 함수 안에서 다른 <code>'use cache'</code> 함수를 호출한다고 해서 태그가 자동으로 상속되지 않는다. 하위 캐시가 상위 태그를 함께 무효화 대상으로 삼으려면 <code>cacheTag()</code>에 그 태그를 명시적으로 추가해야 한다.</li>
              <li><strong>revalidateTag(&apos;max&apos;)의 지연 반영</strong>: stale 표시만 즉시 되고, 실제 재실행은 다음 방문(새로고침) 시 일어난다.</li>
              <li><strong>데모 접두사 필수</strong>: <code>cascade-invalidation:</code> 접두사로 다른 데모의 캐시를 실수로 지우지 않게 한다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
