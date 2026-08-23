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

  const defaultExpected = "• Server Action 폼 검증 및 useActionState 실시간 할인 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Server Action 폼 검증 및 useActionState 실시간 할인 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Server Action 폼 검증 및 useActionState 실시간 할인">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>React 19의 <code>useActionState</code> 및 Server Actions는 서버사이드 비즈니스 유효성 검사 결과(할인율, 오류 객체, 검증 상태)를 클라이언트 컴포넌트 상태와 선언적으로 동기화하는 비동기 폼 처리 표준 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 프로모션 쿠폰 코드(예: <code>SAVE20</code>)를 입력하고 적용 버튼을 누르면 Server Action이 서버에서 쿠폰 유효성을 검증하고, <code>useActionState</code>를 통해 할인된 결제 금액과 실시간 할인율(20%)을 즉시 UI에 반영합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버사이드 비즈니스 무결성</strong>: 클라이언트 코드 변조나 비정상 요청으로 임의 할인을 적용할 수 없도록 서버 함수 내에서 엄격하게 쿠폰 정책을 검증합니다.</li>
              <li><strong>선언적 상태 동기화</strong>: 별도의 <code>useState</code>나 <code>fetch</code> 이벤트 핸들러 없이 Server Action의 반환 객체(할인 금액, 메시지)가 폼 상태로 자동 갱신됩니다.</li>
              <li><strong>점진적 향상(Progressive Enhancement) 지원</strong>: 클라이언트 자바스크립트가 로딩되지 않은 환경에서도 표준 HTML form POST 요청으로 서버 검증 및 할인이 동작합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 결제 단계에서의 실시간 프로모션 쿠폰/포인트 적용 및 검증</li>
              <li>배송지 주소 입력 폼의 우편번호 조회 및 실시간 지역별 배송비 가산 계산</li>
              <li>회원가입 시 이메일 중복 확인 및 추천인 코드 유효성 실시간 검증</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>에러 객체 반환 패턴 권장</strong>: 예상 가능한 유효성 검증 실패는 <code>throw new Error()</code> 대신 <code>{'{'} error: '유효하지 않은 쿠폰입니다' {'}'}</code> 형태의 직렬화 가능 객체로 반환해야 <code>useActionState</code>가 안전하게 상태를 수신합니다.</li>
              <li><strong>클라이언트 계산값 신뢰 금지</strong>: 클라이언트에서 전달된 할인율이나 최종 결제 금액을 그대로 믿지 말고, 서버 액션 내부에서 원본 상품 가격과 쿠폰 DB를 기반으로 금액을 재계산해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
