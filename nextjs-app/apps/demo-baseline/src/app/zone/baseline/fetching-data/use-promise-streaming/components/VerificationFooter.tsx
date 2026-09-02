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
  reviewsDone?: boolean
  recDone?: boolean
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { isStarted = false, reviewsDone = false, recDone = false } = props

  const defaultExpected =
    '• 메인 상품 정보(189,000원) 0초 즉시 렌더링 (빠른 FCP 최적화)\n• 스트리밍 1: React 19 use(reviewsPromise)로 1.2초 후기 3건 먼저 언랩\n• 스트리밍 2: React 19 use(recommendationsPromise)로 2.5초 추천 상품 3건 순차 언랩\n• 서로 다른 지연 시간을 가진 독립된 Suspense 바운더리의 점진적 병렬 스트리밍 검증'

  const allCompleted = reviewsDone && recDone

  const defaultActual = allCompleted
    ? `• 0초 즉시 렌더: 메인 상품 정보(키보드) 즉시 표시 완료\n• 1.2초 스트리밍 1: use(reviewsPromise) 구매 후기 3건 수신 마운트 완료\n• 2.5초 스트리밍 2: use(recommendationsPromise) AI 추천 3건 수신 마운트 완료\n• React 19 use(Promise) 다중 점진적 스트리밍 검증 완료 (전체 블로킹 0%)`
    : isStarted
    ? `• 0초 즉시 렌더: 완료\n• 1.2초 스트리밍 1 (후기): ${reviewsDone ? '완료' : '스켈레톤 대기 중'}\n• 2.5초 스트리밍 2 (추천): ${recDone ? '완료' : '스켈레톤 대기 중'}`
    : `• 스트리밍 상태: 대기 중 (미실행)\n• 조작 방법: 상단 [⚡ 1. 점진적 병렬 스트리밍 시작] 버튼을 클릭하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : allCompleted
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="React 19 use(Promise)와 다중 Suspense 스트리밍 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="React 19 use(Promise) & 다중 Suspense 점진적 병렬 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              서버 컴포넌트에서 빠른 데이터는 즉시 <code>await</code>하여 초기 HTML 셸을 전송하고, 서로 다른 지연 시간(예: 1.2초 후기, 2.5초 추천)을 갖는 느린 데이터들은 <code>await</code>하지 않고 독립된 <code>Promise</code> 객체로 자식 컴포넌트에 넘깁니다. 자식 컴포넌트는 React 19의 <code>use(promise)</code>로 언랩하며, 각 <code>{'<'}Suspense{'>'}</code> 바운더리가 준비되는 순서대로 독립적인 스트리밍 교체를 수행합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 메인 상품 정보(189,000원)가 0초에 즉시 표시됩니다. 스트리밍 시작 시 1.2초 지연 후기 Promise와 2.5초 지연 추천 상품 Promise가 동시에 실행되며, 1.2초 시점에 후기 영역이 먼저 마운트되고 2.5초 시점에 추천 상품 영역이 마운트되는 <strong>다중 독립 스트리밍</strong>을 직접 관찰할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>가장 느린 API에 의한 전체 블로킹 방지</strong>: 5초 걸리는 AI 추천이나 서드파티 통계 때문에 0.01초 만에 나오는 상품 상세나 결제 버튼이 멈추지 않습니다.</li>
              <li><strong>독립적인 Suspense 격리</strong>: 각 영역이 서로를 기다리지 않고 데이터가 준비되는 즉시 점진적으로 화면을 완성합니다.</li>
              <li><strong>클라이언트 상태 코드 단순화</strong>: 복잡한 <code>useEffect</code>와 다중 로딩 플래그(<code>isReviewLoading</code>, <code>isRecLoading</code>) 없이 선언적으로 관리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세(0초 즉시) + 구매 후기(1초) + AI 개인화 추천(3초) 복합 이커머스 페이지</li>
              <li>대시보드 메인 KPI(즉시) + 월간 매출 분석 차트(2초) + 외부 연동 결제 내역(4초)</li>
              <li>호텔 예약 상세(즉시) + 실시간 객실 잔여 수량(1초) + 주변 관광지 날씨 API(3초)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>독립된 Suspense 바운더리 배치</strong>: 여러 개의 느린 데이터를 하나의 Suspense로 묶으면 가장 느린 데이터 시간(2.5초)에 맞춰 한꺼번에 뜨므로, 점진적 스트리밍의 이점을 살리려면 반드시 영역별로 Suspense를 분리해야 합니다.</li>
              <li><strong>Promise 참조 안정성</strong>: 렌더마다 인라인으로 <code>new Promise()</code>를 생성하면 리렌더마다 다시 스트리밍이 트리거되므로 서버 액션이나 캐시된 함수를 활용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
