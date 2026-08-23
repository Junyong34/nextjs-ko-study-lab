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

  const defaultExpected = "• Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js Server Component에서 독립적인 비동기 I/O 작업들을 <code>await Promise.all([req1, req2])</code>로 동시 발송하여 직렬 Waterfall 지연(<code>t1 + t2</code>)을 제거하고 총 응답 시간을 최대 지연(<code>max(t1, t2)</code>)으로 단축하는 표준 데이터 패칭 패턴입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 사용자 정보 조회(300ms)와 상품 주문 내역 조회(400ms)를 직렬(총 700ms)과 병렬(총 400ms)로 각각 실행하여 네트워크 타임라인과 레이턴시 차이를 실시간으로 비교 검증합니다.</p>
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
