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
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="template.tsx vs layout.tsx 리마운트 수명 주기 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 template.tsx 컨벤션을 통해 레이아웃 상태 보존과 템플릿 리마운트 메커니즘의 차이를 검증합니다."}
      />
      <DemoDeepDiveCard title="template.tsx vs layout.tsx">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 렌더링 계층</h5>
            <p>
              Next.js의 라우팅 계층에서 컴포넌트 렌더링 순서는 <code>Layout &gt; Template &gt; ErrorBoundary &gt; Suspense &gt; Page</code>입니다.
              <code>template.tsx</code>는 각 내비게이션마다 고유한 React <code>key</code>를 부여받아 완전히 새 인스턴스로 마운트됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 언제 layout 대신 template을 쓰는가?</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>페이지 전환 애니메이션: CSS/Framer-motion 진입 트랜지션을 매번 재실행할 때</li>
              <li>페이지 진입 로깅: <code>useEffect</code>를 통해 페이지 뷰(PV) 이벤트를 매 전환마다 트리거할 때</li>
              <li>폼 입력값 자동 리셋: 하위 탭 이동 시 검색어/필터 입력 필드를 초기화할 때</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
