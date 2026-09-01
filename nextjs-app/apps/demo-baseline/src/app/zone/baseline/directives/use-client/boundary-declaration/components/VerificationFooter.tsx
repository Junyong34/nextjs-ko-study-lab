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

  const defaultExpected = "• 'use client' 클라이언트 경계 선언 및 이벤트 바인딩의 동작과 기대 결과를 확인합니다."
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
        title="'use client' 클라이언트 경계 선언 및 이벤트 바인딩 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="'use client' 클라이언트 경계 선언 및 이벤트 바인딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>'use client'</code> 지시어는 파일 최상단에 선언되어 Server Component 트리와 Client Component 트리의 진입 경계(Boundary)를 정의하는 표준 지시어입니다. 이 파일과 하위 모듈은 브라우저 번들에 포함되어 React 상태(<code>useState</code>), 훅(<code>useEffect</code>), 브라우저 이벤트 리스너(<code>onClick</code>)를 실행할 수 있습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 컴포넌트가 전달한 초기 데이터를 <code>'use client'</code> 컴포넌트가 수신하여 로컬 카운터 상태(<code>useState</code>)와 버튼 클릭 인터랙션을 바인딩하고, 클라이언트 DOM을 즉각 업데이트하는 경계 동작을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 자바스크립트 번들 최소화</strong>: 인터랙션이 필요한 UI 말단만 Client Component로 분리하여 브라우저에 전송되는 JS 페이로드를 대폭 감축합니다.</li>
              <li><strong>풍부한 인터랙티브 UX</strong>: React 상태, 애니메이션, 브라우저 이벤트(<code>onClick</code>, <code>onChange</code>)를 원활하게 결합합니다.</li>
              <li><strong>서버 컴포넌트와의 유기적 합성</strong>: Client Component 내부에 Server Component를 <code>children</code> Props로 주입받아 성능과 인터랙션을 동시에 달성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 페이지의 [장바구니 담기], [수량 선택기], [옵션 드롭다운]</li>
              <li>드로어(Drawer), 모달(Modal), 툴팁, 아코디언 등 인터랙티브 UI 컴포넌트</li>
              <li>폼 입력 유효성 실시간 검증 및 탭 전환 위젯</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>모든 컴포넌트의 클라이언트화 안티패턴</strong>: 최상단 Layout이나 Page에 무심코 <code>'use client'</code>를 선언하면 하위 전체가 클라이언트 번들로 포함되어 RSC의 이점을 상실하므로 가능한 트리 잎(Leaf) 노드에 위치시켜야 합니다.</li>
              <li><strong>SSR 실행 주의</strong>: Client Component도 초기 HTML 렌더링을 위해 서버에서 사전 실행(SSR)되므로 렌더링 본문에서 <code>window</code>나 <code>document</code>에 직접 접근하면 하이드레이션 오류가 발생합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
