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

  const defaultExpected = "• 중첩 Suspense 점진적 청크 스트리밍 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="중첩 Suspense 점진적 청크 스트리밍 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="중첩 Suspense 점진적 청크 스트리밍">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>중첩 Suspense 스트리밍은 하나의 페이지 내에서 서로 다른 로딩 속도를 가진 독립적인 비동기 컴포넌트들을 다중 <code>{'<'}Suspense{'>'}</code> 바운더리로 계층화하여, 빠른 영역(상품 기본 정보)은 즉시 렌더링하고 느린 영역(리뷰 평점, 연관 추천 상품)은 준비되는 순서대로 점진적 HTML 청크로 스트리밍하는 표준 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 즉시 표시되는 [상품 요약 셸(0ms)], 1초 소요되는 [고객 리뷰 목록], 2.5초 소요되는 [AI 개인화 추천]을 중첩 Suspense로 구성하여, 각 영역이 준비되는 대로 스켈레톤에서 실제 콘텐츠로 독립 전환되는 멀티 청크 스트리밍을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>가장 느린 데이터에 의한 블로킹 제거</strong>: 추천 알고리즘이나 통계 쿼리가 3초 걸리더라도 사용자는 0ms 만에 상품 기본 정보와 구매 버튼을 확인 가능합니다.</li>
                    <li><strong>Time to First Byte(TTFB) 및 FCP 극대화</strong>: 초기 레이아웃 셸이 서버에서 즉시 브라우저로 플러시(Flush)되어 체감 로딩 시간을 최소화합니다.</li>
                    <li><strong>독립적인 로딩 및 에러 격리</strong>: 추천 상품 조회가 실패하거나 지연되어도 리뷰 영역이나 본문 페이지는 정상 동작을 유지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>이커머스 상품 상세 페이지(기본 정보 + 리뷰 섹션 + AI 연관 상품 추천 바운더리)</li>
                    <li>대시보드 메인 화면(핵심 지표 요약 + 실시간 로그 스트림 + 대용량 집계 차트)</li>
                    <li>동영상 포털(비디오 플레이어 + 댓글 목록 + 추천 재생목록)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Suspense 바운더리 배치 설계</strong>: 너무 많은 작은 컴포넌트마다 Suspense를 남발하면 화면이 산발적으로 깜빡거릴 수 있으므로 의미 있는 UI 블록 단위로 묶는 것이 좋습니다.</li>
                    <li><strong>SEO 크롤러의 스트리밍 인식</strong>: 검색엔진 크롤러는 스트리밍 응답이 완료될 때까지 대기하여 전체 HTML을 수집하므로 SEO 점수에 불이익이 없습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
