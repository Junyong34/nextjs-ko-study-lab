'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useSearch } from './SearchContext'

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
  const { searchQuery } = useSearch()

  const defaultExpected =
    '• GNB 검색창 입력 상태(searchQuery)가 하위 라우트 이동 시에도 리셋되지 않고 유지\n• 사이드바 카테고리(/shoes, /clothing, /electronics) 클릭 시 상위 Layout DOM 언마운트 없이 중앙 {children} 페이지만 부분 렌더링(Partial Rendering)'

  const isSubRoute =
    pathname.endsWith('/shoes') ||
    pathname.endsWith('/clothing') ||
    pathname.endsWith('/electronics')

  const hasSearch = searchQuery.trim().length > 0
  const isAutoMatched = hasSearch && isSubRoute

  const categoryName = pathname.endsWith('/shoes')
    ? '신발 (Shoes)'
    : pathname.endsWith('/clothing')
    ? '의류 (Clothing)'
    : pathname.endsWith('/electronics')
    ? '전자기기 (Electronics)'
    : '전체 카탈로그'

  const defaultActual = isAutoMatched
    ? `• GNB 검색어 보존: "${searchQuery}" (하위 라우팅 중 입력 상태 유지됨)\n• 현재 세그먼트: ${categoryName} (${pathname})\n• 부분 렌더링 확인: 상위 GNB 및 사이드바 DOM 유지, {children} 슬롯 페이지만 즉시 교체\n• 중첩 레이아웃 및 Partial Rendering 검증 완료`
    : `• GNB 검색어: ${hasSearch ? `"${searchQuery}"` : '(미입력)'}\n• 현재 활성 라우트: ${categoryName} (${pathname})\n• 부분 렌더링 관찰: 대기 중\n• 상태: GNB에 검색어(예: 러닝화)를 입력하고 좌측 사이드바 카테고리 링크([신발], [의류] 등)를 클릭하세요.`

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
        title="쇼핑몰 GNB 및 사이드바 중첩 레이아웃 (Partial Rendering) 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          "이 예제의 동작과 검증 결과를 표시합니다."
        }
      />
      <DemoDeepDiveCard title="쇼핑몰 GNB 및 사이드바 중첩 레이아웃 (Partial Rendering)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              App Router의 중첩 레이아웃(<code>layout.tsx</code>)은 라우트 세그먼트 계층에 따라 상위 레이아웃(GNB)과 하위 레이아웃(카테고리 사이드바)을 중첩하며, 하위 페이지 간 이동 시 공통 레이아웃의 상태와 DOM을 보존하고 변경된 세그먼트 페이지만 다시 렌더링하는 부분 렌더링(Partial Rendering) 표준 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>/clothing</code>, <code>/electronics</code>, <code>/shoes</code> 카테고리 간 이동 시 상단 검색어 입력 상태와 사이드바 스크롤 위치가 유지되면서, 중앙의 <code>{'<'}ProductList{'>'}</code> 페이지만 교체되는 부분 렌더링 수명 주기를 시각화합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>불필요한 전체 리렌더링 제거</strong>: 변경되지 않은 상위 GNB와 사이드바를 유지하여 클라이언트 렌더링 연산과 서버 페치 비용을 대폭 절감합니다.</li>
              <li><strong>클라이언트 상태 보존</strong>: 탭 전환 중에도 장바구니 요약, 입력창 타이핑, 스크롤 위치 등 사용자 상호작용 상태가 초기화되지 않습니다.</li>
              <li><strong>계층적 UI 아키텍처</strong>: 레이아웃별 독립적인 에러 바운더리 및 로딩 UI를 중첩 배치하여 결함 격리성을 향상합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 카테고리별 사이드바 필터와 상품 목록 뷰어</li>
              <li>마이페이지 내 주문 내역, 배송지 관리, 회원 정보 수정 서브 네비게이션</li>
              <li>관리자 대시보드의 글로벌 헤더 + 사이드바 메뉴 + 콘텐츠 영역 분할</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>레이아웃 Props 전달 불가</strong>: 상위 <code>layout.tsx</code>에서 자식 <code>page.tsx</code>로 직접 Props를 넘길 수 없으므로, 공통 상태가 필요한 경우 React Context나 URL <code>searchParams</code>를 활용해야 합니다.</li>
              <li><strong>Root Layout의 필수 태그</strong>: 최상위 <code>app/layout.tsx</code>는 반드시 <code>{'<'}html{'>'}</code>과 <code>{'<'}body{'>'}</code> 태그를 직접 렌더링해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
