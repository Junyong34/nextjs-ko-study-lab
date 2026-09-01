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

  const defaultExpected = "• React Compiler 자동 메모이제이션 최적화의 동작과 기대 결과를 확인합니다."
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
        title="React Compiler 자동 메모이제이션 최적화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="React Compiler 자동 메모이제이션 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>React Compiler(React Forget / <code>experimental.reactCompiler</code>)는 개발자가 수동으로 <code>useMemo</code>, <code>useCallback</code>, <code>React.memo</code>를 작성하지 않아도, 빌드 컴파일 단계에서 컴포넌트의 값과 JSX 하위 트리를 분석하여 세밀한 메모이제이션(Fine-grained Memoization) 코드를 자동 주입하는 차세대 리액트 최적화 엔진입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 수량 변경이나 필터 조작 시 부모 컴포넌트가 리렌더링되더라도, 변경되지 않은 하위 상품 스펙 카드와 계산 결과 컴포넌트가 수동 메모이제이션 코드 없이도 불필요한 리렌더링을 0회로 건너뛰는 최적화 동작을 시각화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>수동 메모이제이션 보일러플레이트 100% 제거</strong>: 번거롭고 실수하기 쉬운 의존성 배열(Dependency Array) 관리와 <code>useCallback</code> 도배 없이 깔끔한 순수 자바스크립트 함수로 컴포넌트를 작성합니다.</li>
              <li><strong>불필요한 리렌더링 원천 방어</strong>: 객체/배열 Props 생성으로 인한 하위 컴포넌트의 연쇄 리렌더링을 컴파일러가 바이트코드 레벨에서 차단합니다.</li>
              <li><strong>런타임 연산 최적화</strong>: 실제 상태값이 변경된 세그먼트만 선별적으로 재평가하여 대규모 대시보드의 FPS와 반응 속도를 극대화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>수천 개의 아이템이 렌더링되는 실시간 주식/암호화폐 호가창 및 차트 대시보드</li>
              <li>복잡한 주문서 결제 계산기 및 옵션 조합 선택기</li>
              <li>대규모 데이터 그리드(Data Grid) 및 스프레드시트 컴포넌트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Rules of React 엄격 준수 필수</strong>: React Compiler는 렌더링 중 순수성(Purity)과 훅 규칙을 엄격히 전제하므로, 렌더링 도중 전역 변수를 수정하거나 훅을 조건문 내에서 호출하면 최적화 대상에서 제외됩니다.</li>
              <li><strong>기존 useMemo 코드와의 점진적 공존</strong>: 기존 코드에 수동 작성된 <code>useMemo</code>가 남아 있어도 충돌 없이 동작하므로 단계적인 마이그레이션이 가능합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
