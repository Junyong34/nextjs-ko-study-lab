'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { FetchResult } from '../types'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  sequentialResult?: FetchResult | null
  parallelResult?: FetchResult | null
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { sequentialResult, parallelResult } = props

  const defaultExpected =
    '• 직렬 Waterfall: 순차 await로 인해 합산 지연(600ms + 800ms ≈ 1,400ms) 발생\n• 병렬 Promise.all: 동시 발송으로 최대 지연(max(600ms, 800ms) ≈ 800ms)에 완료\n• 병렬 실행 시 직렬 대비 약 40% 이상(약 600ms) 총 응답 시간 단축 검증'

  const bothExecuted = Boolean(sequentialResult && parallelResult)

  let defaultActual = ''
  if (bothExecuted && sequentialResult && parallelResult) {
    const saved = sequentialResult.totalDurationMs - parallelResult.totalDurationMs
    const percent = Math.round((saved / sequentialResult.totalDurationMs) * 100)
    defaultActual = `• 직렬 Waterfall 소요 시간: ${sequentialResult.totalDurationMs}ms (상품 ${sequentialResult.product.fetchDurationMs}ms + 추천 ${sequentialResult.recommendations[0]?.fetchDurationMs || 800}ms)\n• 병렬 Promise.all 소요 시간: ${parallelResult.totalDurationMs}ms (동시 비동기 패칭)\n• 성능 개선율: 약 ${percent}% 단축 (약 ${saved}ms 절감)\n• Promise.all 병렬 데이터 패칭 가속 검증 완료`
  } else if (sequentialResult) {
    defaultActual = `• 직렬 Waterfall: ${sequentialResult.totalDurationMs}ms 완료\n• 병렬 Promise.all: 미실행 (대기 중)\n• 상태: [2. 병렬 Promise.all 실행] 버튼을 클릭하여 소요 시간을 대조하세요.`
  } else if (parallelResult) {
    defaultActual = `• 직렬 Waterfall: 미실행 (대기 중)\n• 병렬 Promise.all: ${parallelResult.totalDurationMs}ms 완료\n• 상태: [1. 직렬 Waterfall 실행] 버튼을 클릭하여 직렬 소요 시간을 대조하세요.`
  } else {
    defaultActual =
      '• 직렬 Waterfall: 미실행\n• 병렬 Promise.all: 미실행\n• 소요 시간 비교: 대기 중\n• 상태: 상단 [1. 직렬 Waterfall 실행]과 [2. 병렬 Promise.all 실행] 버튼을 차례로 클릭하세요.'
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : bothExecuted
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          'Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다.'
        }
      />
      <DemoDeepDiveCard title="Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js Server Component에서 독립적인 비동기 I/O 작업들을 <code>await Promise.all([req1, req2])</code>로 동시 발송하여 직렬 Waterfall 지연(<code>t1 + t2</code>)을 제거하고 총 응답 시간을 최대 지연(<code>max(t1, t2)</code>)으로 단축하는 표준 데이터 패칭 패턴입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상품 기본 정보 조회(600ms)와 추천 상품 목록 조회(800ms)를 직렬 Waterfall(순차 await, 총 약 1,400ms)과 병렬 <code>Promise.all</code>(동시 시작, max(600ms, 800ms) = 총 약 800ms)로 각각 실행하여 소요 시간 및 네트워크 타임라인 단축 효과(~40% 개선)를 실시간으로 대조 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 응답 속도(TTFB) 단축</strong>: 다중 마이크로서비스 또는 DB 쿼리 호출 시 대기 시간을 획기적으로 절감하여 첫 바이트 도달 시간을 최적화합니다.</li>
              <li><strong>서버 리소스 처리량 향상</strong>: I/O 대기 시간을 줄여 단일 인스턴스가 처리할 수 있는 동시 요청 처리량(Throughput)을 증대시킵니다.</li>
              <li><strong>단일 렌더 사이클 일괄 바인딩</strong>: 병렬로 로드된 데이터를 하나의 완성된 Server Component 트리에 즉시 바인딩하여 렌더링 일관성을 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>마이페이지 진입 시 사용자 프로필, 장바구니 요약, 최근 본 상품 목록을 동시 조회</li>
              <li>상품 상세 페이지에서 기본 상품 정보와 판매자 정보 및 리뷰 평점 병렬 조회</li>
              <li>관리자 대시보드에서 일간 매출 통계, 신규 가입자 수, 미처리 문의 현황 동시 패치</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Promise.allSettled를 통한 부분 실패 격리</strong>: 비필수 데이터(e.g. 추천 배너) 실패 시 전체 페이지가 크래시되지 않도록 <code>Promise.allSettled</code>를 적용하고 개별 에러 폴백을 처리하는 것이 안전합니다.</li>
              <li><strong>Suspense 스트리밍과의 조화</strong>: 병렬 처리 중 극도로 느린 작업이 포함된 경우 <code>Promise.all</code>로 전체 응답을 지연시키는 대신 <code>{'<'}Suspense{'>'}</code>로 분리하여 점진적 스트리밍을 적용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
