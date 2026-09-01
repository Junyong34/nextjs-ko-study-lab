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

  const defaultExpected = "• usePathname() 기반 GNB 활성 메뉴 하이라이트의 동작과 기대 결과를 확인합니다."
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
        title="usePathname() 기반 GNB 활성 메뉴 하이라이트 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="usePathname() 기반 GNB 활성 메뉴 하이라이트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>usePathname()</code> (<code>next/navigation</code>)은 현재 URL의 도메인과 쿼리 스트링을 제외한 경로명(Pathname, 예: <code>/shop/electronics</code>)을 반환하는 클라이언트 훅입니다. URL 변경 시 컴포넌트를 리렌더링하여 활성 탭 UI를 즉각 갱신합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 GNB 네비게이션 메뉴(<code>['/shop', '/orders', '/settings']</code>)를 클릭하여 라우트 이동 시, <code>usePathname()</code>이 반환하는 경로와 각 메뉴의 <code>href</code>를 대조하여 현재 활성화된 메뉴에 하이라이트 뱃지와 인디케이터 스타일을 적용합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>선언적 활성 상태 스타일링</strong>: 복잡한 라우터 이벤트 구독 없이 반환된 경로 문자열 비교만으로 GNB/LNB 활성 탭을 제어합니다.</li>
              <li><strong>부분 경로 매칭 지원</strong>: <code>pathname.startsWith('/shop')</code>와 같은 패턴 검사로 중첩 하위 카테고리 진입 시에도 상위 메뉴 활성화를 유지합니다.</li>
              <li><strong>경량 훅 아키텍처</strong>: 쿼리 파라미터 변경에는 반응하지 않고 순수 경로 변경 시에만 리렌더링되어 불필요한 연산을 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 헤더 GNB 카테고리 탭(패션, 전자기기, 뷰티) 활성화 인디케이터</li>
              <li>마이페이지 좌측 LNB 메뉴(주문내역, 배송지관리, 회원정보) 현재 위치 표시</li>
              <li>관리자 대시보드 사이드바의 계층형 아코디언 메뉴 활성 상태 유지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>쿼리 파라미터 미포함</strong>: <code>usePathname()</code>은 <code>?category=1</code> 같은 쿼리를 반환하지 않으므로 쿼리 정보가 필요할 때는 <code>useSearchParams()</code>를 함께 사용해야 합니다.</li>
              <li><strong>서버 컴포넌트 대체</strong>: 서버 컴포넌트에서는 <code>usePathname</code>을 호출할 수 없으므로 <code>headers()</code>에서 <code>x-pathname</code>을 읽거나 클라이언트 컴포넌트로 분리해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
