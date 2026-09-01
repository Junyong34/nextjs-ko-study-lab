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

  const defaultExpected = "• React Fast Refresh & 핫 모듈 리로딩 (HMR) 상태 보존의 동작과 기대 결과를 확인합니다."
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
        title="React Fast Refresh & 핫 모듈 리로딩 (HMR) 상태 보존 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="React Fast Refresh & 핫 모듈 리로딩 (HMR) 상태 보존">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              React Fast Refresh는 Next.js 개발 서버 환경에서 파일 수정 시 브라우저 전체 새로고침 없이 변경된 React 컴포넌트만 실시간으로 교체(HMR)하면서, <code>useState</code> 및 <code>useReducer</code>의 클라이언트 상태와 스크롤 위치를 그대로 보존하는 핵심 개발자 경험(DX) 아키텍처 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모의 <code>StatePreservingCounter</code>에서는 사용자가 카운터 수량(예: 15개)을 늘리고 메모 텍스트를 입력한 상태에서, 컴포넌트 내부 렌더링 로직이나 스타일 코드를 수정해도 초기 마운트 타임스탬프와 입력 데이터가 초기화되지 않고 유지되는 Fast Refresh 바운더리 동작을 실시간으로 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>초고속 피드백 루프</strong>: 복잡한 입력 폼이나 모달 깊은 곳을 디버깅할 때 매번 데이터를 재입력할 필요 없이 즉각적인 UI 반영을 확인합니다.</li>
              <li><strong>런타임 에러 복구 탄력성</strong>: 문법/런타임 에러 발생 시 오버레이가 표시되더라도, 코드 수정 즉시 에러가 해제되며 이전 입력 상태로 안전하게 복귀합니다.</li>
              <li><strong>상태 유실 방지</strong>: 장바구니 품목 선택이나 다단계 스텝 폼 개발 생산성을 비약적으로 향상시킵니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>다단계 주문/결제 위젯 및 복잡한 필터 폼 컴포넌트 UI/UX 인터랙션 개발</li>
              <li>차트, 애니메이션, 드로어 등 상태 중심 인터랙티브 클라이언트 위젯 스타일링</li>
              <li>디자인 시스템(Design System) 컴포넌트 라이브러리 개발 및 실시간 토큰 튜닝</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>React 컴포넌트 단독 Export 원칙</strong>: 파일 내에 React 컴포넌트 외에 일반 상수나 헬퍼 함수를 함께 <code>export</code>하면 Fast Refresh 바운더리가 깨져 전체 페이지가 리로드(Full Reload)될 수 있습니다. 비컴포넌트 함수는 별도 유틸 파일로 분리해야 합니다.</li>
              <li><strong>클래스 컴포넌트 및 익명 함수 제약</strong>: 익명 화살표 함수(<code>export default () ={'>'} ...</code>)나 클래스 컴포넌트는 상태 보존이 어려우므로 명명된 함수(<code>export default function MyComponent()</code>)를 선언해야 합니다.</li>
              <li><strong>개발 모드 전용</strong>: Fast Refresh는 <code>next dev</code> 환경 전용 엔진이며, 프로덕션 빌드(<code>next build</code>)에서는 정적 최적화된 JS 번들로 빌드됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
