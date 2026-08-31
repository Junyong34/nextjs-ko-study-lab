'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { FlowStage } from './context'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  stage?: FlowStage
  errorMsg?: string | null
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { stage = 'order', errorMsg } = props

  const defaultExpected =
    '• 하위 결제 세그먼트(/payment)에서 504 에러 발생 시 상위 헤더를 유지한 채 error.tsx로 격리\n• [결제 다시 시도 (reset())] 호출 시 전체 새로고침 없이 세그먼트 정상 복구\n• 상위 레이아웃 보존 및 하위 에러 격리 복구 실증 검증'

  let defaultActual = '• 인터랙션 대기 중 (최종 결제 단계로 이동하여 결제 통신 에러 및 reset() 복구를 실행하세요)'
  if (stage === 'payment_ready') {
    defaultActual = '• 결제 세그먼트(/payment) 진입 완료\n• 상태: [결제 통신 에러 강제 발생] 버튼을 클릭하여 error.tsx 격리를 확인하세요.'
  } else if (stage === 'errored') {
    defaultActual = `• 세그먼트 에러 격리: payment/error.tsx 포착 완료\n• 상위 레이아웃: OrderSummaryHeader 정상 보존\n• 에러 사유: ${errorMsg || 'PG사 결제 게이트웨이 연결 실패 (504 Gateway Timeout)'}\n• 상태: [결제 다시 시도 (reset())] 버튼을 클릭하세요.`
  } else if (stage === 'recovered') {
    defaultActual = '• 세그먼트 에러 격리: payment/error.tsx 정상 포착 및 상위 OrderSummaryHeader 보존\n• 클라이언트 복구: reset() 호출로 PaymentPage 재마운트 성공\n• 관찰 결과: 전체 애플리케이션 크래시 없이 하위 세그먼트 격리 복구 완료'
  } else if (stage === 'completed') {
    defaultActual = '• 세그먼트 결제 완료: 정상 결제 승인 완료\n• 상위 레이아웃 및 세그먼트 정상 연동 검증 완료'
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : stage === 'recovered' || stage === 'completed'
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="error.tsx 세그먼트 에러 바운더리 격리 및 복구 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          'Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다.'
        }
      />
      <DemoDeepDiveCard title="error.tsx 세그먼트 레벨 에러 바운더리 격리 및 reset() 복구">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>error.tsx</code>는 클라이언트 컴포넌트(<code>'use client'</code>)로 선언되며, 해당 라우트 세그먼트의 <code>page.tsx</code>와 하위 컴포넌트 트리를 React Error Boundary로 감싸는 표준 파일 컨벤션입니다. <code>{'{'} error, reset {'}'}</code> Props를 전달받아 에러 정보를 표시하고 복구(Retry)를 시도합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 하위 결제 세그먼트(<code>/payment</code>)에서 PG사 게이트웨이 504 Timeout 예외가 발생했을 때, 상위 주문서 요약 헤더(<code>OrderSummaryHeader</code>)는 온전히 유지한 채 결제 세그먼트만 <code>payment/error.tsx</code> 폴백 UI로 격리합니다. [결제 다시 시도] 버튼 클릭 시 <code>reset()</code>을 호출하여 세그먼트를 정상 복구합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>화면 전체 크래시(White-out) 원천 방지</strong>: 특정 위젯이나 하위 페이지의 장애가 사이트 전체로 번지지 않도록 세그먼트 단위로 결함을 격리합니다.</li>
              <li><strong>사용자 이탈 방지</strong>: 에러 발생 시에도 상위 헤더 네비게이션을 통해 다른 단계로 자유롭게 이동할 수 있습니다.</li>
              <li><strong>보안 해시 다이제스트</strong>: 프로덕션 환경에서 민감한 서버 스택 트레이스를 숨기고 <code>error.digest</code> 해시 코드만 클라이언트에 전달하여 보안을 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>외부 PG사/배송사 API 일시 장애 시 결제/배송 조회 영역만의 맞춤 복구 안내</li>
              <li>상품 상세 페이지의 연관 추천 상품 섹션 에러 격리</li>
              <li>대시보드 내 특정 실시간 통계 차트 로딩 실패 시 재시도 위젯 표시</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동일 레벨 layout.tsx 에러 미포착</strong>: <code>error.tsx</code>는 컴포넌트 트리상 <code>layout.tsx</code>의 하위에 렌더링되므로, 동일 세그먼트 레이아웃의 에러를 잡으려면 상위 세그먼트의 <code>error.tsx</code>가 필요합니다.</li>
              <li><strong>reset()과 startTransition 연동</strong>: 서버 컴포넌트 데이터 페치 실패 후 <code>reset()</code>만 누르면 캐시된 에러가 재발생할 수 있으므로, <code>startTransition(() ={'>'} {'{'} router.refresh(); reset(); {'}'})</code> 패턴으로 서버 데이터를 새로고침해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
