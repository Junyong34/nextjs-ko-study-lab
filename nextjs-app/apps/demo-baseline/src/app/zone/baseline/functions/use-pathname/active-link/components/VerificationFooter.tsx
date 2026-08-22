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

  const defaultExpected = "• usePathname() 기반 GNB 활성 메뉴 하이라이트 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="usePathname() 기반 GNB 활성 메뉴 하이라이트 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="usePathname() 기반 GNB 활성 메뉴 하이라이트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>usePathname()은 현재 URL의 경로명(Pathname, 예: &apos;/shop/shoes&apos;)을 반환하는 클라이언트 훅으로, 라우트 변경 시마다 최신 경로를 구독하여 GNB 메뉴 하이라이트나 네비게이션 인디케이터를 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 쇼핑몰 상단 GNB에서 usePathname()을 통해 현재 경로가 &apos;/shop/shoes&apos;인지 &apos;/shop/electronics&apos;인지 실시간 판별하여, 활성 카테고리 탭에 파란색 강조 뱃지와 밑줄 인디케이터를 활성화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>선언적 활성 메뉴(Active Link) 구현: 복잡한 상태 관리 없이 현재 URL 경로와 링크 href를 단순 비교하여 액티브 스타일을 적용합니다.</li>
              <li>부분 일치 및 중첩 라우트 대응: pathname.startsWith(&apos;/shop/category&apos;)를 활용해 하위 상세 페이지 진입 시에도 상위 메뉴 활성화를 유지합니다.</li>
              <li>클라이언트 전환 자동 감지: &lt;Link&gt; 클릭으로 소프트 네비게이션이 일어날 때마다 컴포넌트가 즉시 리렌더링되어 UI를 갱신합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상단 GNB 및 카테고리 사이드바 활성 메뉴 하이라이트</li>
              <li>마이페이지 서브 네비게이션(주문내역/쿠폰함/회원정보) 탭 전환</li>
              <li>페이지 이동 시 특정 경로(예: 결제창 /checkout)에서만 헤더/푸터 숨김 처리</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
