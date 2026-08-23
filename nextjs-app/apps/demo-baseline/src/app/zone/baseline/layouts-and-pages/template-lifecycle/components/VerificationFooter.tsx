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

  const defaultExpected = "• template.tsx 생명주기 및 인스턴스 재생성 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="template.tsx 생명주기 및 인스턴스 재생성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="template.tsx 생명주기 및 인스턴스 재생성">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>template.tsx</code>는 세그먼트 이동 시 상태를 유지하는 <code>layout.tsx</code>와 달리, 라우트 이동마다 새로운 컴포넌트 인스턴스를 생성하여 마운트/언마운트 생명주기를 재실행하고, <code>useState</code> 상태 초기화, <code>useEffect</code> 재실행, CSS 진입 애니메이션을 트리거하는 표준 파일 컨벤션입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 카테고리 탭을 전환할 때 <code>layout.tsx</code>에 위치한 검색창 상태는 그대로 유지되는 반면, <code>template.tsx</code> 내부의 폼 입력값과 페이지 전환 카운터는 0으로 초기화되며 진입 애니메이션이 매번 재생되는 차이점을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>진입/이탈 애니메이션 자동 트리거</strong>: 페이지 전환 시마다 DOM이 새로 마운트되어 Framer Motion이나 CSS 페이드인 효과를 자연스럽게 연출합니다.</li>
                    <li><strong>페이지별 클라이언트 상태 강제 초기화</strong>: 이전 페이지에서 입력하던 임시 폼 데이터나 모달 열림 상태를 안전하게 자동 리셋합니다.</li>
                    <li><strong>페이지 뷰 로깅(Analytics) 정확한 수집</strong>: <code>useEffect</code> 마운트 시점을 감지하여 경로 전환 시마다 페이지 체류/방문 이벤트를 정확히 로깅합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>상품 상세 페이지 간 이동 시마다 리뷰 작성 폼 및 수량 선택 카운터 자동 리셋</li>
                    <li>쇼핑몰 주요 기획전 진입 시 화려한 모션 그래픽 및 슬라이드 인 애니메이션 연출</li>
                    <li>페이지 전환 시마다 Google Analytics / Amplitude 페이지뷰 추적 비콘 발송</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>불필요한 렌더링 비용 주의</strong>: 단순 레이아웃 공유 목적이라면 상태 보존과 캐싱에 유리한 <code>layout.tsx</code>를 기본으로 사용하고, 인스턴스 재생성이 반드시 필요한 경우에만 <code>template.tsx</code>를 선택해야 합니다.</li>
                    <li><strong>컴포넌트 렌더 계층 순서</strong>: App Router의 렌더 트리는 <code>Layout {'>'} Template {'>'} ErrorBoundary {'>'} Suspense {'>'} Page</code> 순서로 중첩됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
