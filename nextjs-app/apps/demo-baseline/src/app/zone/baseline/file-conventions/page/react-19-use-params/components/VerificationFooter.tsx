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

  const defaultExpected = "• React 19 use(params)와 use(searchParams) 값 읽기의 동작과 기대 결과를 확인합니다."
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
        title="React 19 use(params)와 use(searchParams) 값 읽기 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="React 19 use(params) & use(searchParams) Promise 언래핑">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js 15+ 및 React 19에서 <code>page.tsx</code>와 <code>layout.tsx</code>가 전달받는 <code>params</code> 및 <code>searchParams</code> Props는 비동기 <code>Promise</code> 객체입니다. 클라이언트 컴포넌트에서는 React 19의 <code>use()</code> API를 호출하여(<code>const {'{'} category, id {'}'} = use(params)</code>) 렌더링 단계에서 동기적으로 파라미터를 언래핑합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상위 Page에서 전달된 <code>Promise{'<'}{'{'} category: string; id: string {'}'}{'>'}</code>를 클라이언트 위젯 컴포넌트가 <code>use(params)</code>로 언래핑합니다. 카테고리 탭 전환 시 새로운 Promise가 주입되면 React가 이를 감지하여 동적 세그먼트 상태를 0ms 지연으로 최신화합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>부분 사전 렌더링(PPR) 최적화</strong>: 파라미터 해석 전에도 정적 레이아웃 셸을 브라우저에 즉시 스트리밍할 수 있습니다.</li>
              <li><strong>React 19 표준 통일</strong>: Context, Promise 등 모든 비동기 자원을 단일 <code>use()</code> 인터페이스로 일관되게 처리합니다.</li>
              <li><strong>컴포넌트 단위 유연성</strong>: 최상단 Page가 아닌 깊은 하위 클라이언트 컴포넌트에서도 Promise Props를 직접 전달받아 필요 시점에만 언래핑할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세(<code>/shop/[category]/[id]</code>) 화면의 클라이언트 옵션 선택기 및 장바구니 담기 위젯</li>
              <li>주문 번호(<code>[orderId]</code>) 기반의 실시간 배송 위치 트래킹 클라이언트 맵 뷰어</li>
              <li>판매자 파트너 센터의 대시보드(<code>[sellerId]</code>) 필터 및 차트 위젯</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>useParams() 훅과의 명확한 구분</strong>: <code>useParams()</code>는 Props 없이 라우터 컨텍스트에서 읽는 훅이며, <code>use(params)</code>는 상위에서 전달된 Promise Props를 언래핑하는 React 19 코어 API입니다.</li>
              <li><strong>Suspense 바운더리 고려</strong>: <code>use(promise)</code>는 Promise가 미해결 상태일 때 가장 가까운 Suspense 바운더리를 트리거하므로, 하위 컴포넌트 사용 시 적절한 폴백 처리가 필요합니다.</li>
              <li><strong>TypeScript Props 타입 정의</strong>: Next.js 15+에서는 <code>params: Promise{'<'}{'{'} id: string {'}'}{'>'}</code>로 타입을 선언해야 컴파일 경고를 방지할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
