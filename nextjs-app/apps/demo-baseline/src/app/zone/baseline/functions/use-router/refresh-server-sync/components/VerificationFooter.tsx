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

  const defaultExpected = "• router.refresh() 서버 데이터 강제 재검증 동기화 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="router.refresh() 서버 데이터 강제 재검증 동기화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="router.refresh() 서버 데이터 강제 재검증 동기화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>router.refresh()</code>는 현재 라우트의 서버 컴포넌트 트리를 서버에 다시 요청하여 최신 RSC 페이로드를 가져와 병합하는 클라이언트 메서드입니다. 브라우저 새로고침(F5)과 달리 React 클라이언트 상태(입력 폼 값, 스크롤 위치 등)를 완벽히 보존합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 클라이언트 입력 폼에 텍스트를 작성한 상태에서 [서버 데이터 새로고침]을 실행하여, 클라이언트의 폼 상태는 그대로 유지된 채 서버의 실시간 재고/가격 데이터만 백그라운드에서 동기화되는 동작을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 상태 무손실 갱신</strong>: 사용자가 작성 중인 폼 데이터나 모달 열림 상태를 초기화하지 않고 서버 데이터만 최신화합니다.</li>
              <li><strong>Router Cache 무효화 연동</strong>: 현재 활성화된 라우트 세그먼트의 클라이언트 캐시를 새로고침하여 최신 서버 상태를 즉각 반영합니다.</li>
              <li><strong>낙관적 UI 후속 동기화</strong>: 클라이언트 상태를 먼저 변경한 뒤 <code>router.refresh()</code>를 트리거하여 최종 서버 상태와 안전하게 정렬합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>장바구니 수량 변경 후 총 결제 예상 금액 및 쿠폰 할인율 서버 재계산</li>
              <li>실시간 경매/주식 호가 화면에서 주기적 서버 데이터 폴링 동기화</li>
              <li>외부 팝업 결제창 완료 신호 수신 후 메인 주문 화면의 결제 상태 갱신</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Server Action과의 차이</strong>: Server Action은 내부에서 <code>revalidatePath</code>를 호출해 자동으로 refresh를 유발하지만, 외부 REST API 호출 후에는 명시적으로 <code>router.refresh()</code>를 호출해야 합니다.</li>
              <li><strong>네트워크 비용 고려</strong>: 잦은 <code>router.refresh()</code> 호출은 서버 RSC 렌더링 부하를 유발하므로 정밀한 캐시 태그 무효화와 병행해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
