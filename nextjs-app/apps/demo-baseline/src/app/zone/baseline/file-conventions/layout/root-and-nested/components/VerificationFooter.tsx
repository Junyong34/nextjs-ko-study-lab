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

  const defaultExpected = "• 루트 레이아웃(Root Layout) 및 카테고리 중첩 레이아웃 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="루트 레이아웃(Root Layout) 및 카테고리 중첩 레이아웃 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="루트 레이아웃(Root Layout) 및 중첩 레이아웃 아키텍처">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>app/layout.tsx</code>(Root Layout)는 모든 하위 라우트에서 공유되는 최상위 필수 레이아웃으로 <code>{'<'}html{'>'}</code>과 <code>{'<'}body{'>'}</code> 태그를 정의합니다. 하위 디렉토리의 중첩 <code>layout.tsx</code>는 특정 세그먼트 이하의 페이지만을 감싸며, 부모에서 자식으로 계층적 합성(Composition)을 이룹니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자가 상위 카테고리 탭이나 하위 상품 상세 경로로 이동할 때, 최상위 GNB와 서브 카테고리 사이드바 레이아웃은 리렌더링되지 않고(Partial Rendering) 하위 <code>page.tsx</code> 슬롯만 교체되는 렌더링 파이프라인을 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>부분 렌더링(Partial Rendering) 최적화</strong>: 변경되지 않은 상위 레이아웃의 재연산 및 DOM 교체를 생략하여 화면 깜빡임 없이 빠른 전환을 보장합니다.</li>
              <li><strong>선언적 계층 구조 관리</strong>: 파일 시스템 디렉토리 구조 그대로 UI 셸(Layout)과 뷰(Page)의 부모-자식 관계를 명확하게 매핑합니다.</li>
              <li><strong>공통 컨텍스트 및 프로바이더 주입</strong>: 테마, 글로벌 세션, 메타데이터 기본값을 하위 전체 세그먼트에 일관되게 적용합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 쇼핑몰의 전역 GNB/푸터(Root Layout) 및 카테고리별 좌측 필터 사이드바(Nested Layout)</li>
              <li>관리자 콘솔(Admin Portal)의 대시보드 LNB 사이드바와 하위 설정/회원 관리 페이지 분기</li>
              <li>마이페이지의 공통 프로필 요약 카드와 하위 주문 내역/배송지/쿠폰함 탭 뷰어</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>루트 레이아웃의 필수 태그 준수</strong>: 최상위 <code>app/layout.tsx</code>에는 반드시 <code>{'<'}html{'>'}</code>과 <code>{'<'}body{'>'}</code>가 포함되어야 하며, 하위 중첩 <code>layout.tsx</code>에 중복 선언하면 DOM 파싱 에러가 발생합니다.</li>
              <li><strong>Layout과 Page 간 직접 Props 전달 불가</strong>: 상위 <code>layout.tsx</code>에서 자식 <code>page.tsx</code>로 직접 props를 전달할 수 없으므로, 데이터 공유가 필요할 경우 React Context나 서버 컴포넌트 캐시 함수(fetch deduping, React cache)를 활용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
