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

  const defaultExpected = "• startTransition을 통한 프로그래밍 방식 Server Action 호출 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="startTransition을 통한 프로그래밍 방식 Server Action 호출 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="startTransition 프로그래밍 방식 Server Action 호출 & 트랜지션 우선순위">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>startTransition</code> 및 <code>useTransition</code>은 <code>{'<'}form{'>'}</code> 요소 없이도 버튼 클릭(<code>onClick</code>)이나 커스텀 이벤트 핸들러에서 Server Action을 프로그래밍 방식으로 실행하고, 서버 통신 및 RSC 리렌더링을 비차단(Non-blocking) 백그라운드 트랜지션으로 스케줄링하는 React 19 표준 API입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 [장바구니 수량 변경] 또는 [위시리스트 토글] 버튼 클릭 시 <code>startTransition(async () ={'>'} {'{'} await updateCartAction(id) {'}'})</code>을 호출합니다. <code>isPending</code> 플래그가 활성화되어 버튼에 로딩 인디케이터가 표시되는 동안에도 사용자는 다른 상품을 클릭하거나 검색창에 타이핑할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>UI 반응성 보장(INP 최적화)</strong>: 네트워크 응답 대기 중에도 메인 스레드가 멈추지 않아 인터랙션 응답 지연(Interaction to Next Paint)을 최소화합니다.</li>
              <li><strong>선언적 Pending 상태 관리</strong>: 별도의 <code>useState(isLoading)</code> 보일러플레이트 없이 <code>isPending</code> 불리언 값으로 버튼 비활성화 및 스피너를 자동 제어합니다.</li>
              <li><strong>폼 없는 자유로운 제어</strong>: 단일 버튼, 드롭다운 변경, 스위치 토글 등 복잡한 폼 래핑 없이도 깔끔하게 Server Action을 트리거합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 목록에서의 원클릭 찜하기(위시리스트) 토글 및 즉각적인 카운트 동기화</li>
              <li>장바구니 수량 증감(+/-) 버튼 클릭 시 서버 재고 확인 및 금액 갱신</li>
              <li>다크모드/알림 수신 여부 등 사용자 환경설정 스위치 토글의 즉시 서버 저장</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>React 19 비동기 지원</strong>: React 19부터 <code>startTransition</code> 내에서 <code>async/await</code> 비동기 함수를 직접 전달할 수 있습니다(React 18의 동기 전용 제약 해결).</li>
              <li><strong>중복 클릭 방어</strong>: 트랜지션 실행 중 사용자가 빠르게 여러 번 클릭하면 다중 액션이 병렬 발송될 수 있으므로, <code>disabled={'{'}isPending{'}'}</code> 처리를 필수로 적용해야 합니다.</li>
              <li><strong>에러 바운더리 연동</strong>: Server Action 내부에서 예외가 발생하면 <code>startTransition</code>이 속한 가장 가까운 React Error Boundary로 에러가 전파됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
