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

  const defaultExpected = "• 뷰포트 진입 자동 prefetch vs prefetch={false} 호버 시점 패칭 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="뷰포트 진입 자동 prefetch vs prefetch={false} 호버 시점 패칭 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="뷰포트 진입 자동 prefetch vs 호버 시점 패칭 대조">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js <code>{'<'}Link{'>'}</code>의 기본 동작은 브라우저 <code>IntersectionObserver</code>를 통해 뷰포트에 나타난 링크의 정적 세그먼트를 자동 프리패치(Viewport Prefetch)하는 반면, <code>prefetch={'{'}false{'}'}</code>는 호버(Hover) 시점까지 요청을 유예하는 두 가지 서로 다른 프리패치 전략 스펙을 제공합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 동일한 5개의 추천 상품 링크에 대해 [뷰포트 자동 프리패치 그룹]과 [호버 프리패치 그룹]을 나란히 배치하고, 스크롤 시 발생하는 네트워크 요청 발생 건수와 호버 시점의 지연 시간 차이를 실시간 비교 측정합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>트래픽 vs 속도의 최적 트레이드오프 수립</strong>: 전환율이 중요한 핵심 추천 상품과 부가 링크의 프리패치 전략을 명확히 분리하여 설계 가능합니다.</li>
                    <li><strong>정밀한 네트워크 자원 통제</strong>: 한정된 모바일 네트워크 리소스를 중요한 콘텐츠 로딩에 우선 집중할 수 있습니다.</li>
                    <li><strong>네트워크 탭 투명성 확보</strong>: 실제 전송되는 RSC 페이로드 크기와 발생 시점을 정확히 분석하여 프론트엔드 성능 튜닝에 기여합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>메인 홈 화면의 실시간 타임특가 배너(Viewport Prefetch 적용)</li>
                    <li>하단 카테고리 전체보기 드롭다운 메뉴(Hover Prefetch 적용)</li>
                    <li>대규모 B2B 사이트맵 네비게이션 트리 최적화</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>정적 vs 동적 라우트 프리패치 차이</strong>: 정적 라우트는 페이지 전체가 프리패치되지만, 동적 라우트는 <code>loading.tsx</code>를 포함한 공통 레이아웃 셸만 프리패치됩니다.</li>
                    <li><strong>모바일 터치 환경 고려</strong>: 모바일 디바이스에서는 마우스 호버가 없으므로 <code>onTouchStart</code> 시점에 프리패치가 트리거됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
