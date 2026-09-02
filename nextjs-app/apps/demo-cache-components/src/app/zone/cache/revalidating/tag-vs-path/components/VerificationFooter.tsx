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
    '• updateTag는 지정 태그 블록만 정밀하게, 즉시 무효화하고, revalidatePath는 경로 하위 모든 캐시 블록을 일괄 무효화\n• 태그 무효화: 특정 엔티티 캐시만 즉시 MISS/갱신되고 다른 캐시는 HIT 유지\n• 경로 무효화: 상단 배너, A 상품, B 상품 전체 캐시 일괄 무효화'

  let defaultActual = '• 인터랙션 대기 중 (상단 무효화 버튼 1, 2, 3 중 하나를 클릭하세요)'
  if (lastActionType === 'tag-a') {
    defaultActual = `• 무효화 대상: updateTag('tag-vs-path:product-a')\n• 갱신 범위: A 상품 캐시 즉시 정밀 갱신 / 공지 배너 및 B 상품 캐시 HIT 유지\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
  } else if (lastActionType === 'tag-b') {
    defaultActual = `• 무효화 대상: updateTag('tag-vs-path:product-b')\n• 갱신 범위: B 상품 캐시 즉시 정밀 갱신 / 공지 배너 및 A 상품 캐시 HIT 유지\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
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
        title="updateTag와 revalidatePath의 무효화 범위 비교 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="updateTag와 revalidatePath의 무효화 범위 비교">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>updateTag</code>는 엔티티 태그(Tag)를 기반으로 URL 위치와 무관하게 연관된 데이터 캐시만 정밀하게, 그리고 즉시 무효화하는 반면, <code>revalidatePath</code>는 특정 라우트 경로 또는 레이아웃 트리에 바인딩된 모든 캐시 블록을 일괄 무효화하는 두 가지 핵심 캐시 제어 전략입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 공지 배너, A 상품(에어 줌 프로 러닝화), B 상품(오버핏 기모 맨투맨)의 3개 독립 캐시 블록을 구성하고, <code>updateTag('tag-vs-path:product-a')</code> 호출 시 A 상품 캐시만 선택 갱신되는 정밀 무효화와 <code>revalidatePath()</code> 호출 시 3개 블록 전체가 일괄 갱신되는 경로 무효화의 격리 범위를 실시간 대조합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>도메인 상황별 최적 전략 선택</strong>: 개별 상품 수정은 <code>updateTag</code>로, 기획전 전체 개편은 <code>revalidatePath</code>로 명확히 분기 적용 가능합니다.</li>
              <li><strong>캐시 무효화 부작용 방지</strong>: 특정 엔티티 변경 시 연관 없는 페이지 캐시가 불필요하게 무효화되는 현상을 원천 방지합니다.</li>
              <li><strong>Read-your-own-writes 보장</strong>: Server Action을 실행한 사용자가 자신의 변경 결과를 새로고침 없이 즉시 눈으로 확인할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 단일 상품 가격/재고 변경(updateTag('product-101') 적용)</li>
              <li>카테고리 기획전 레이아웃 및 배너 개편(revalidatePath('/promotions', 'page') 적용)</li>
              <li>전체 사이트 GNB 네비게이션 개편(revalidatePath('/', 'layout') 적용)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>태그 네임스페이스 설계</strong>: 충돌을 방지하기 위해 <code>domain:entity:id</code> (예: <code>shop:product:123</code>) 형태의 계층형 태그 네이밍 규칙을 수립해야 합니다.</li>
              <li><strong>updateTag는 Server Action 전용</strong>: Route Handler 등 Server Action이 아닌 곳에서는 호출할 수 없으며, 그런 경우엔 <code>revalidateTag</code>를 대신 씁니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">6. updateTag vs revalidateTag: 왜 updateTag를 골랐나</h5>
            <p>
              <code>revalidateTag(tag, 'max')</code>는 Next.js 16이 권장하는 stale-while-revalidate 방식입니다 — 호출 즉시 캐시를 "낡음"으로만 표시하고, <strong>그 태그를 쓰는 페이지가 다음에 방문될 때</strong> 백그라운드로 갱신됩니다. 그래서 이 데모처럼 버튼을 누른 그 자리에서 바로 결과를 확인해야 하는 인터랙티브 실습에 쓰면, 화면이 안 바뀌어서 마치 오류처럼 보입니다. Next.js 공식 문서도 &quot;Server Action에서 즉시 반영이 필요하면 <code>revalidateTag</code> 대신 <code>updateTag</code>를 쓰라&quot;고 명시하고 있어, 이 데모는 <code>updateTag</code>로 구현했습니다. 배포 환경에서 웹훅처럼 약간의 지연이 괜찮은 콘텐츠(블로그 글, 상품 카탈로그 목록)라면 <code>revalidateTag(tag, 'max')</code>가 오히려 더 적합할 수 있습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
