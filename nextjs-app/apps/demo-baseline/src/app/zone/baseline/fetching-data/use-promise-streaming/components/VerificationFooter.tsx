'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isStarted?: boolean
  hasCompleted?: boolean
  delayMs?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { isStarted = false, hasCompleted = false, delayMs = 1500 } = props

  const defaultExpected =
    '• 메인 상품 정보(189,000원) 지연 없는 즉각 렌더링 (빠른 FCP)\n• 버튼 클릭 시 React 19 use(Promise)로 ' + delayMs + 'ms 지연 구매 후기 3건 스트리밍 언랩\n• Suspense Fallback 스켈레톤에서 실제 후기 UI로의 점진적 전환 관찰'

  const defaultActual = hasCompleted
    ? `• 스트리밍 언랩: React 19 use(Promise) 완료 (${delayMs}ms 지연 후기 수신)\n• 로드된 후기 수: 3건 (개발자K, 키보드매니아, 디자이너P)\n• 렌더링 상태: 메인 셸 즉시 렌더 + use(Promise) Suspense 스트리밍 검증 완료`
    : isStarted
    ? `• 스트리밍 상태: <Suspense fallback> 스켈레톤 렌더링 중 (${delayMs}ms 대기 중)\n• Promise 상태: Pending ➔ use(Promise) 언랩 진행 중`
    : `• 스트리밍 상태: 대기 중 (미실행)\n• 조작 방법: 상단 [⚡ 1. 구매 고객 후기 스트리밍 시작] 버튼을 클릭하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : hasCompleted
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="React 19 use(Promise)와 Suspense 스트리밍 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="React 19 use(Promise) & Suspense 점진적 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              React 19의 <code>use()</code> API는 미해결(Pending) <code>Promise</code> 객체를 Client Component에 전달하고, 클라이언트 렌더 단계에서 <code>use(promise)</code>로 언래핑하여 <code>{'<'}Suspense{'>'}</code> 바운더리와 결합된 점진적 스트리밍을 구현하는 표준 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 메인 상품 정보(189,000원)가 즉시 렌더링된 상태에서, 사용자가 버튼을 클릭하면 지연 Promise(3건: 개발자K, 키보드매니아, 디자이너P)를 생성합니다. Promise가 resolve되기 전까지는 <code>{'<'}Suspense fallback{'={ReviewsSkeleton /}>'}</code>이 표시되고, 설정된 시간 경과 후 <code>use(promise)</code>가 resolve되어 후기 목록으로 부드럽게 교체됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>지연 없는 초기 셸 렌더링</strong>: 무거운 서드파티 리뷰 DB 조회 전에도 메인 상품 정보와 레이아웃을 즉시 전송하여 First Contentful Paint(FCP)를 단축합니다.</li>
              <li><strong>클라이언트 폭포수 요청 제거</strong>: 클라이언트가 별도의 <code>useEffect</code> + <code>fetch</code>를 재호출하지 않고 서버에서 시작된 단일 스트림을 그대로 소비합니다.</li>
              <li><strong>선언적 로딩 상태 관리</strong>: 수동 로딩 플래그 제어 없이 Suspense 폴백 스켈레톤으로 일원화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 상품 상세 페이지의 구매 고객 실시간 후기 및 평점 스트리밍</li>
              <li>실시간 물류센터별 배송 도착 예정일 및 잔여 재고 수량 표시</li>
              <li>복잡한 맞춤 추천 상품 목록 및 사용자 혜택 견적 스트리밍</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Promise 인스턴스 재생성 방지</strong>: 컴포넌트 렌더마다 새 Promise 객체를 무한 생성하면 리렌더 루프가 발생할 수 있으므로 상태나 캐시를 통해 안정적인 Promise를 전달해야 합니다.</li>
              <li><strong>에러 바운더리 결합</strong>: <code>use(promise)</code>가 reject되면 가장 가까운 Error Boundary로 예외가 전파되므로 <code>{'<'}Suspense{'>'}</code> 외부에 <code>{'<'}ErrorBoundary{'>'}</code>를 반드시 배치해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
