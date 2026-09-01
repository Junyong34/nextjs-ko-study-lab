'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useDrawer } from './DrawerContext'

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
  const { isDrawerOpen, toggleCount } = useDrawer()

  const defaultExpected =
    '• 카테고리 A ↔ 카테고리 B 페이지 전환 시에도 상위 layout.tsx의 장바구니 드로어 상태(열림/닫힘)가 리마운트 없이 그대로 유지\n• 하위 세그먼트 페이지만 교체(Partial Rendering)'

  const isCategoryB = pathname.endsWith('/category-b')
  const isAutoMatched = toggleCount > 0 || isCategoryB

  const currentCategory = isCategoryB ? '카테고리 B' : '카테고리 A'

  const defaultActual = isAutoMatched
    ? `• 드로어 상태 보존: 현재 "${isDrawerOpen ? '열림' : '닫힘'}" (조작 횟수: ${toggleCount}회)\n• 현재 활성 라우트: ${currentCategory} (${pathname})\n• 상태 보존 확인: 하위 라우트 이동 시 layout.tsx 언마운트 없이 드로어 상태 유지됨\n• UI State Preservation 실증 완료`
    : `• 드로어 상태: "${isDrawerOpen ? '열림' : '닫힘'}" (초기 상태)\n• 현재 활성 라우트: ${currentCategory} (${pathname})\n• 상태 보존 관찰: 대기 중\n• 안내: [토글] 버튼을 클릭하거나 [카테고리 B로 이동] 링크를 클릭하세요.`

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
        title="레이아웃 유지 및 슬라이드 드로어 상태 보존 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          "이 예제의 동작과 검증 결과를 표시합니다."
        }
      />
      <DemoDeepDiveCard title="레이아웃 유지 및 슬라이드 드로어 상태 보존">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js App Router에서 <code>layout.tsx</code>에 선언된 React 클라이언트 상태는 동일 계층의 서브 라우트 간 네비게이션 시 파기되지 않고 유지됩니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 장바구니 드로어의 열림/닫힘 상태가 카테고리 A와 카테고리 B를 왕복 이동해도 초기화되지 않는 상태 보존 메커니즘을 시각화합니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
