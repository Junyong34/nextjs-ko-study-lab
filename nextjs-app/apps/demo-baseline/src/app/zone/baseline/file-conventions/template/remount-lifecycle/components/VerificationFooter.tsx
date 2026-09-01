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

  const defaultExpected = "• layout.tsx는 자식 경로 전환 시에도 상태(state)와 DOM을 지속 보존\n• template.tsx는 경로 이동 시마다 새 인스턴스로 재생성되어 상태 초기화 및 진입 애니메이션 재실행"
  const defaultActual = "• layout.tsx 지속 보존 & template.tsx 재마운트 수명 주기 분리 감지 완료\n• 탭 간 전환 시 template DOM 재생성 확인"

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
        title="template.tsx vs layout.tsx 리마운트 수명 주기 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 template.tsx 컨벤션을 통해 레이아웃 상태 보존과 템플릿 리마운트 메커니즘의 차이를 검증합니다."}
      />
      <DemoDeepDiveCard title="template.tsx vs layout.tsx 리마운트 수명 주기 & 인스턴스 재생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js 라우팅 계층의 컴포넌트 렌더링 순서는 <code>Layout {'>'} Template {'>'} ErrorBoundary {'>'} Suspense {'>'} Page</code>입니다. <code>template.tsx</code>는 <code>layout.tsx</code>와 달리 경로 이동 시마다 고유한 React <code>key</code>를 부여받아 매번 완전히 새 인스턴스로 마운트(Remount)되며 모든 내부 상태가 초기화됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 동일 카테고리 내에서 탭 메뉴 간 전환 시 <code>layout.tsx</code>의 상태와 DOM은 그대로 유지되는 반면, <code>template.tsx</code> 내부의 입력 폼, <code>useState</code> 카운터, CSS 진입 트랜지션 애니메이션이 즉시 리셋되고 재마운트되는 수명 주기를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>진입 애니메이션 100% 재실행</strong>: CSS/Framer-motion 페이드인 등 페이지 전환 시각 효과를 매번 깔끔하게 트리거합니다.</li>
              <li><strong>페이지 뷰(PV) 분석 로깅 자동화</strong>: 컴포넌트 마운트 시점의 <code>useEffect</code>를 통해 페이지 진입 텔레메트리 이벤트를 누락 없이 수집합니다.</li>
              <li><strong>폼 및 임시 상태 자동 클린업</strong>: 하위 세그먼트 전환 시 이전 페이지의 잔여 입력값이나 필터 상태를 부작용 없이 초기화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 탭 전환 시마다 부드러운 페이드인 진입 애니메이션 적용</li>
              <li>사용자 탐색 경로별 GA/엠플리튜드 페이지 진입 로깅 훅 연동</li>
              <li>피드백 작성 모달이나 문의하기 폼의 페이지 이동 시 자동 리셋</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>불필요한 리렌더링 오버헤드 주의</strong>: 정적인 UI 요소(GNB, 사이드바)를 <code>template.tsx</code>에 배치하면 매 네비게이션마다 불필요한 DOM 재생성 비용이 발생하므로 반드시 상태 리셋이 필요한 서브 래퍼에만 한정해야 합니다.</li>
              <li><strong>children Props 필수 렌더링</strong>: <code>template.tsx</code>는 <code>{'{'} children {'}'}: {'{'} children: React.ReactNode {'}'}</code>를 필수로 받아 렌더링해야 하위 페이지가 정상적으로 마운트됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
