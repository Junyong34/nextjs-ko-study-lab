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

  const defaultExpected = "• Next.js 확장 fetch tags 태그 바인딩의 동작과 기대 결과를 확인합니다."
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
        title="Next.js 확장 fetch tags 태그 바인딩 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="Next.js 확장 fetch tags 태그 바인딩 & 온디맨드 revalidation">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>fetch(url, {'{'} next: {'{'} tags: ['products', 'category-shoes'] {'}'} {'}'})</code>는 캐시된 요청에 하나 이상의 시맨틱 태그(Cache Tags)를 부여하는 확장 옵션입니다. 이후 Server Action이나 Route Handler에서 <code>revalidateTag('products')</code>를 호출하여 특정 태그가 지정된 모든 캐시 항목을 즉시 정밀 무효화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 상품 목록을 조회할 때 <code>tags: ['products']</code>를 부여해 캐싱하고, 관리자가 신규 상품을 등록하는 Server Action에서 <code>revalidateTag('products')</code>를 호출하여 관련 캐시를 즉각 퍼지(Purge)하고 동기화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>초정밀 온디맨드 캐시 무효화</strong>: 전체 페이지나 사이트를 다시 빌드하지 않고 변경된 엔티티(예: 특정 상품군)의 캐시만 정밀 타겟팅하여 삭제합니다.</li>
              <li><strong>다중 태그 다대다(N:M) 관계 구성</strong>: 단일 fetch에 여러 태그를 부여하여 카테고리별, 브랜드별, 전체 목록별로 유연한 연쇄 무효화를 구현합니다.</li>
              <li><strong>최고의 데이터 신선도와 캐시 히트율 양립</strong>: 시간 만료를 기다리지 않고 데이터 변경 이벤트 발생 즉시 최신화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 재고 수정, 가격 인하 이벤트 시 실시간 캐시 갱신</li>
              <li>게시판 글 작성/수정/삭제 시 게시글 목록 캐시 즉시 퍼지</li>
              <li>프로모션 배너 교체 시 온디맨드 배너 캐시 갱신</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>태그 네이밍 컨벤션</strong>: 태그가 너무 광범위하면 불필요한 캐시 무효화가 발생하므로 <code>collection:products</code>, <code>item:prod-101</code>과 같이 계층적 네이밍 규칙을 수립해야 합니다.</li>
              <li><strong>revalidateTag 실행 컨텍스트</strong>: <code>revalidateTag</code>는 Server Action 또는 Route Handler 등 서버 변경 컨텍스트에서 호출해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
