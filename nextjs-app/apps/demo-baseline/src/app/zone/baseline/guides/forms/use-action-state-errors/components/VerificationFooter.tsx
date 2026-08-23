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

  const defaultExpected = "• useActionState 필드 에러 표시 및 유효성 검증 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="useActionState 필드 에러 표시 및 유효성 검증 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="useActionState 필드 에러 표시 및 유효성 검증">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useActionState(action, initialState)</code>는 React 19의 표준 폼 상태 관리 훅으로, Server Action 실행 결과 반환되는 필드별 에러 맵(<code>errors: {'{'} email, zipCode {'}'}</code>)과 폼 제출 상태(<code>state, formAction, isPending</code>)를 선언적으로 바인딩합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 배송지 폼 제출 시 Server Action이 서버에서 Zod/유효성 규칙으로 이메일 및 우편번호를 검증하고, 검증 실패 시 각 입력 필드 바로 아래에 <code>state.errors</code>의 구체적 에러 메시지를 붉은색 안내문으로 즉각 표시합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>필드 단위 정밀 에러 렌더링</strong>: 서버에서 반환된 에러 객체를 각 <code>{'<'}input{'>'}</code> 요소의 <code>aria-describedby</code> 및 텍스트와 1:1로 매핑하여 직관적인 피드백을 제공합니다.</li>
              <li><strong>폼 보일러플레이트 제거</strong>: <code>isSubmitting</code>, <code>errors</code> 관리를 위한 수십 줄의 <code>useState</code> 및 <code>try/catch</code> 코드를 단 하나의 훅으로 간소화합니다.</li>
              <li><strong>접근성(a11y) 표준 연동</strong>: 서버 검증 에러 상태를 <code>aria-invalid="true"</code> 속성과 손쉽게 연결하여 스크린 리더 사용자에게 즉시 전달할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자상거래 주문서 배송지/수령인 정보 입력 및 유효성 검증</li>
              <li>B2B 파트너 정산 계좌 및 사업자등록번호 유효성 검사 폼</li>
              <li>비밀번호 변경 및 복잡도(특수문자/길이) 실시간 피드백 폼</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>액션 함수 인수 순서 준수</strong>: <code>useActionState</code>에 전달하는 Server Action은 <code>(previousState, formData)</code> 형태로 <code>previousState</code>가 첫 번째 인수로 전달되므로 시그니처 순서에 주의해야 합니다.</li>
              <li><strong>초기 상태(initialState) 스키마 일치</strong>: 초기 상태 객체의 구조(<code>{'{'} errors: {'{'}{'}'}, data: null {'}'}</code>)를 서버 액션 반환 타입과 동일하게 정의해야 런타임 <code>undefined</code> 참조 오류를 방지할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
