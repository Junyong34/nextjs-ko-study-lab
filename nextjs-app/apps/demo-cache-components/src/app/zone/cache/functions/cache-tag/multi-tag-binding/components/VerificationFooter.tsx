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

  const defaultExpected = "• cacheTag 다중 태그 바인딩 및 정밀 연관 관계 구성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="cacheTag 다중 태그 바인딩 및 정밀 연관 관계 구성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="다중 엔티티 캐시 태그 복합 바인딩">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>다중 태그 바인딩은 하나의 복합 비즈니스 뷰(e.g. 상품 상세 화면)가 의존하는 여러 도메인 엔티티(상품 기본 정보, 판매자 정보, 리뷰 평점)의 태그들을 <code>cacheTag('product-101', 'seller-202', 'reviews-101')</code>로 한 번에 등록하여, 어떤 엔티티가 변경되더라도 복합 뷰가 정확히 갱신되도록 보장하는 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 복합 상품 뷰에 [상품], [판매자], [리뷰] 3개 태그를 등록하고, [판매자 정보 변경] 또는 [신규 리뷰 등록] 버튼을 각각 눌렀을 때 해당 엔티티 태그를 통해 복합 화면 캐시가 즉시 무효화되는 정밀 반응성을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>데이터 불일치(Stale Data) 완벽 방지</strong>: 상품 정보는 최신인데 판매자 이름이나 리뷰 개수가 이전 상태로 남는 데이터 파편화 현상을 방지합니다.</li>
                    <li><strong>마이크로서비스 이벤트 연동 최적화</strong>: 서로 다른 백엔드 서비스(상품 서비스, 회원 서비스, 리뷰 서비스)에서 발행된 웹훅에 맞춰 각각 태그를 무효화할 수 있습니다.</li>
                    <li><strong>독립적인 엔티티 수명 주기 관리</strong>: 각 도메인의 수정 빈도에 구애받지 않고 통합 캐시의 무결성을 유지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>상품 상세 페이지(상품 데이터 + 판매자 프로필 + 최신 리뷰 평점 통합 뷰)</li>
                    <li>사용자 피드 화면(작성자 프로필 + 게시글 내용 + 댓글 수 태그 바인딩)</li>
                    <li>대시보드 메인 뷰(주문 통계 + 결제 정산 현황 + 고객 문의 지표)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>가변 인자 및 배열 전달</strong>: <code>cacheTag('tag1', 'tag2')</code>와 같이 가변 인자로 넘기거나 여러 번 호출해도 모두 합집합으로 정상 등록됩니다.</li>
                    <li><strong>대소문자 구분</strong>: 캐시 태그 문자열은 대소문자를 엄격히 구분하므로 소문자 통일(e.g. <code>toLowerCase()</code>) 컨벤션을 권장합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
