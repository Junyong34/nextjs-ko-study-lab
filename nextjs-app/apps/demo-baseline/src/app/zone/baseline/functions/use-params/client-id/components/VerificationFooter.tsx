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

  const defaultExpected = "• useParams()를 통한 Client Component 동적 세그먼트 파라미터 추출 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="useParams()를 통한 Client Component 동적 세그먼트 파라미터 추출 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="useParams() Client Component 동적 세그먼트 파라미터 추출">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useParams()</code> (<code>next/navigation</code>)는 클라이언트 컴포넌트(<code>'use client'</code>)에서 라우터 컨텍스트로부터 현재 활성화된 동적 세그먼트 파라미터(예: <code>[id]</code>, <code>[...slug]</code>)를 객체 형태로 동기 추출하는 훅입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 동적 라우트 <code>/shop/[category]/[id]</code> 환경에서 클라이언트 위젯 컴포넌트가 <code>const params = useParams()</code>를 호출하여 <code>category</code>와 <code>id</code> 값을 직접 읽고, 상위 Page로부터의 Props 전달(Drilling) 없이 즉시 렌더링에 활용합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Props Drilling 완전 제거</strong>: 깊은 계층의 하위 클라이언트 컴포넌트에서도 상위 Server Component의 Props 전달 없이 파라미터를 직접 조회합니다.</li>
              <li><strong>타입 제네릭 지원</strong>: <code>useParams{'<'}{'{'} id: string {'}'}{'>'}()</code>와 같이 TypeScript 제네릭을 지정하여 안전한 타입 추론을 지원합니다.</li>
              <li><strong>동적/Catch-all 파라미터 자동 파싱</strong>: <code>[...slug]</code> 형태의 다중 세그먼트도 문자열 배열(<code>string[]</code>)로 자동 매핑합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세(<code>/products/[id]</code>) 화면 깊은 곳에 위치한 [장바구니 담기] 클라이언트 플로팅 버튼</li>
              <li>주문 내역(<code>/orders/[orderId]</code>) 하위의 실시간 결제 상태 확인 웹소켓 위젯</li>
              <li>블로그/문서(<code>/docs/[...slug]</code>) 목차 네비게이션 트리 하이라이트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>React 19 use(params)와의 차이</strong>: <code>useParams()</code>는 Context에서 읽는 클라이언트 전용 훅이며, React 19의 <code>use(params)</code>는 Page/Layout Props로 전달된 Promise 객체를 언래핑하는 방식입니다.</li>
              <li><strong>널/미스매치 방어</strong>: 라우트 세그먼트 외부에서 호출되거나 옵셔널 세그먼트인 경우 <code>undefined</code>가 반환될 수 있으므로 기본값 처리가 필요합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
