'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  lastActionType?: 'tag-a' | 'tag-b' | 'path' | null
  isPending?: boolean
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { lastActionType, isPending } = props

  const defaultExpected =
    '• revalidateTag는 지정 태그 블록만 정밀 무효화하고, revalidatePath는 경로 하위 모든 캐시 블록을 일괄 무효화\n• 태그 무효화: 특정 엔티티 캐시만 MISS/갱신되고 다른 캐시는 HIT 유지\n• 경로 무효화: 상단 배너, A 상품, B 상품 전체 캐시 일괄 무효화'

  let defaultActual = '• 인터랙션 대기 중 (상단 무효화 버튼 1, 2, 3 중 하나를 클릭하세요)'
  if (lastActionType === 'tag-a') {
    defaultActual = `• 무효화 대상: revalidateTag('tag-vs-path:product-a')\n• 갱신 범위: A 상품 캐시 정밀 갱신 / 공지 배너 및 B 상품 캐시 HIT 유지\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
  } else if (lastActionType === 'tag-b') {
    defaultActual = `• 무효화 대상: revalidateTag('tag-vs-path:product-b')\n• 갱신 범위: B 상품 캐시 정밀 갱신 / 공지 배너 및 A 상품 캐시 HIT 유지\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
  } else if (lastActionType === 'path') {
    defaultActual = `• 무효화 대상: revalidatePath('/zone/cache/revalidating/tag-vs-path')\n• 갱신 범위: 공지 배너, A 상품, B 상품 전체 캐시 일괄 갱신\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : lastActionType !== null && !isPending
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="revalidateTag와 revalidatePath의 무효화 범위 비교 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="revalidateTag와 revalidatePath의 무효화 범위 비교">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>revalidateTag</code>는 엔티티 태그(Tag)를 기반으로 URL 위치와 무관하게 연관된 데이터 캐시만 정밀하게 무효화하는 반면, <code>revalidatePath</code>는 특정 라우트 경로 또는 레이아웃 트리에 바인딩된 모든 캐시 블록을 일괄 무효화하는 두 가지 핵심 캐시 제어 전략입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 공지 배너, A 상품(에어 줌 프로 러닝화), B 상품(오버핏 기모 맨투맨)의 3개 독립 캐시 블록을 구성하고, <code>revalidateTag('tag-vs-path:product-a')</code> 호출 시 A 상품 캐시만 선택 갱신되는 정밀 무효화와 <code>revalidatePath()</code> 호출 시 3개 블록 전체가 일괄 갱신되는 경로 무효화의 격리 범위를 실시간 대조합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>도메인 상황별 최적 전략 선택</strong>: 개별 상품 수정은 <code>revalidateTag</code>로, 기획전 전체 개편은 <code>revalidatePath</code>로 명확히 분기 적용 가능합니다.</li>
              <li><strong>캐시 무효화 부작용 방지</strong>: 특정 엔티티 변경 시 연관 없는 페이지 캐시가 불필요하게 무효화되는 현상을 원천 방지합니다.</li>
              <li><strong>URL 구조 독립성</strong>: 여러 페이지에 분산 렌더링된 동일 상품 데이터를 단 한 번의 태그 무효화로 일관되게 최신화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 단일 상품 가격/재고 변경(revalidateTag('product-101') 적용)</li>
              <li>카테고리 기획전 레이아웃 및 배너 개편(revalidatePath('/promotions', 'page') 적용)</li>
              <li>전체 사이트 GNB 네비게이션 개편(revalidatePath('/', 'layout') 적용)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>태그 네임스페이스 설계</strong>: 충돌을 방지하기 위해 <code>domain:entity:id</code> (예: <code>shop:product:123</code>) 형태의 계층형 태그 네이밍 규칙을 수립해야 합니다.</li>
              <li><strong>Next.js 16 stale-while-revalidate 동작</strong>: <code>revalidateTag</code> 호출 시 즉시 기존 캐시 반환 후 백그라운드 revalidation이 수행되므로 클라이언트 화면 전환 시 적절한 트랜지션 처리를 권장합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
