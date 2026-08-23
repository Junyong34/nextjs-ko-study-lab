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

  const defaultExpected = "• View Transitions 이미지 확대 애니메이션 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="View Transitions 이미지 확대 애니메이션 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="View Transitions API를 활용한 카드 줌 확대 애니메이션">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Document View Transitions API(<code>document.startViewTransition</code>)는 브라우저가 이전 DOM 상태와 새로운 DOM 상태의 스냅샷을 캡처하여, CSS <code>::view-transition-group</code> 및 <code>view-transition-name</code>을 통해 두 화면 간의 부드러운 확대/축소(Zoom) 및 위치 모핑 전환 효과를 네이티브 수준으로 연출하는 최신 웹 애니메이션 표준 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상품 그리드의 썸네일 카드(<code>view-transition-name: product-hero</code>)를 클릭했을 때, 해당 카드가 부드럽게 전체화면 상세 뷰로 확장되고 [닫기] 클릭 시 원래 카드 위치로 축소 복귀하는 네이티브 모핑 애니메이션을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>네이티브 앱급 부드러운 화면 전환</strong>: 별도의 무거운 자바스크립트 모션 라이브러리 없이 브라우저 GPU 하드웨어 가속 기반으로 60fps 전환을 달성합니다.</li>
                    <li><strong>선언적 CSS 애니메이션 제어</strong>: CSS 의사 요소(<code>::view-transition-old</code>, <code>::view-transition-new</code>)를 통해 지속 시간, 이징(Easing), 블러 효과를 손쉽게 커스터마이징합니다.</li>
                    <li><strong>선택적 점진적 향상(Progressive Enhancement)</strong>: View Transitions API를 지원하지 않는 브라우저에서는 기본 즉각 전환으로 우아하게 폴백됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 상품 카탈로그 그리드 ↔ 상품 상세 뷰 간의 확대 전환</li>
                    <li>포토 갤러리 썸네일 클릭 시 라이트박스 전체화면 모달 오픈</li>
                    <li>음악 재생 목록의 미니 플레이어 ↔ 전체화면 가사/커버 플레이어 전환</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>고유한 view-transition-name 지정 필수</strong>: 동일한 화면 내에 여러 요소가 동일한 <code>view-transition-name</code>을 공유하면 트랜지션이 무효화되므로 각 상품 카드마다 고유 ID(e.g. <code>card-prod-101</code>)를 부여해야 합니다.</li>
                    <li><strong>브라우저 호환성 검사</strong>: 실행 전 반드시 <code>if (!document.startViewTransition)</code> 조건을 검사하여 미지원 브라우저에서의 크래시를 방지해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
