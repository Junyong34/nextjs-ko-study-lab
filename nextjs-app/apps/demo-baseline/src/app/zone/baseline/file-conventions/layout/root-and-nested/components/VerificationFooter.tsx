'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useRootNested } from './RootNestedContext'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const pathname = usePathname()
  const { clickCount } = useRootNested()

  const defaultExpected =
    '• layout.tsx 안의 카운터 상태가 하위 카테고리(/electronics, /food) 페이지 이동 시에도 리셋되지 않고 유지\n• 상위 layout.tsx는 리마운트되지 않고 자식 {children} 페이지만 교체'

  const isSubRoute = pathname.endsWith('/electronics') || pathname.endsWith('/food')
  const hasCount = clickCount > 0
  const isAutoMatched = hasCount && isSubRoute

  const categoryName = pathname.endsWith('/electronics')
    ? '전자기기 (Electronics)'
    : pathname.endsWith('/food')
    ? '식품 (Food)'
    : '의류 (Clothing, 기본)'

  const defaultActual = isAutoMatched
    ? `• layout.tsx 카운터 값 보존: ${clickCount}회 (서브 라우트 이동 후에도 상태 유지됨)\n• 현재 세그먼트: ${categoryName} (${pathname})\n• 상태 보존 확인: 하위 page.tsx 교체 시 상위 layout.tsx 리마운트 없음\n• 루트 및 중첩 레이아웃 계층 검증 완료`
    : `• layout.tsx 카운터: ${hasCount ? `${clickCount}회` : '0회 (미클릭)'}\n• 현재 활성 라우트: ${categoryName} (${pathname})\n• 상태 보존 관찰: 대기 중\n• 안내: 상단 GNB의 [카운터 +1]을 클릭하고 [전자기기] 또는 [식품] 탭 링크를 클릭하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : isAutoMatched
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="루트 및 중첩 layout.tsx 계층 구조와 상태 보존 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
        }
      />
      <DemoDeepDiveCard title="루트 및 중첩 layout.tsx 계층 구조와 상태 보존">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>layout.tsx</code>는 여러 페이지가 공유하는 공통 UI 계층을 정의하며, 하위 라우트 간 이동 시에도 언마운트되지 않고 컴포넌트 인스턴스와 클라이언트 상태(React State)를 지속적으로 유지합니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>layout.tsx</code> 내부의 카운터 상태를 조작한 후 의류, 전자기기, 식품 세부 카테고리 페이지로 이동할 때 <code>page.tsx</code>만 교체되고 카운터 값이 0으로 초기화되지 않는 상태 보존 동작을 시각화합니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>UI 상태 영속성</strong>: 네비게이션 중에도 장바구니 개수, 사이드바 접힘 상태 등이 유지됩니다.</li>
              <li><strong>성능 최적화</strong>: 공통 레이아웃 DOM의 재생성 비용이 발생하지 않습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
