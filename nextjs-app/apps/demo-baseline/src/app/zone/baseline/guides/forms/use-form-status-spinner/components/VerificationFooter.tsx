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

  const defaultExpected = "• useFormStatus pending 스피너 및 버튼 비활성화의 동작과 기대 결과를 확인합니다."
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
        title="useFormStatus pending 스피너 및 버튼 비활성화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="useFormStatus pending 스피너 및 버튼 비활성화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useFormStatus()</code>는 부모 <code>{'<'}form{'>'}</code>의 제출 진행 상태(<code>pending, data, method, action</code>)를 Props 전달 없이 하위 컴포넌트에서 직접 구독하는 React 19 컨텍스트 기반 훅입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 결제 폼 하위의 <code>{'<'}SubmitButton{'>'}</code> 컴포넌트가 <code>useFormStatus()</code>의 <code>pending</code> 불리언 값을 읽어, 서버 액션이 네트워크 통신을 진행하는 동안 버튼을 <code>disabled</code> 처리하고 로딩 스피너 애니메이션을 노출합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Props Drilling 없는 컴포넌트 캡슐화</strong>: 상위 폼 컴포넌트에서 로딩 상태를 Props로 넘겨받지 않고도 하위 버튼 컴포넌트가 독립적으로 폼 상태를 감지합니다.</li>
              <li><strong>중복 결제 및 다중 제출 방지</strong>: 폼 제출 중 결제 버튼을 즉시 비활성화하여 사용자의 빠른 연타 클릭으로 인한 다중 승인 사고를 원천 차단합니다.</li>
              <li><strong>재사용 가능한 버튼 디자인 시스템</strong>: 어떤 <code>{'<'}form{'>'}</code> 내부에서도 그대로 재사용할 수 있는 범용 <code>{'<'}SubmitButton{'>'}</code> 컴포넌트 생태계를 구축합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 결제 승인 버튼(<code>[189,000원 결제하기]</code>)의 중복 클릭 방어</li>
              <li>대용량 첨부파일 업로드 및 상품 대량 등록 폼의 진행 인디케이터</li>
              <li>게시글 작성, 상품 리뷰 등록, 1:1 문의 제출 폼의 상태 피드백</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>부모 form 요소 하위 호출 필수</strong>: <code>useFormStatus()</code>는 반드시 <code>{'<'}form{'>'}</code>을 렌더링하는 컴포넌트의 <strong>자식 컴포넌트 내부</strong>에서 호출해야 합니다. <code>{'<'}form{'>'}</code>과 동일한 레벨에서 호출하면 항상 <code>pending: false</code>를 반환합니다.</li>
              <li><strong>startTransition 미추적</strong>: <code>useFormStatus</code>는 <code>{'<'}form action=...{'>'}</code>의 제출만 감지하며, 폼 외부의 독립적인 <code>startTransition</code> 호출은 감지하지 않으므로 주의가 필요합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
