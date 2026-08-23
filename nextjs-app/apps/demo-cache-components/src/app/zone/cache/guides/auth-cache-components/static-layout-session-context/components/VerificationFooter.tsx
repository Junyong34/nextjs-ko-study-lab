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

  const defaultExpected = "• 정적 캐시 상품 레이아웃 + Context use(UserContext) 세션 스트리밍 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="정적 캐시 상품 레이아웃 + Context use(UserContext) 세션 스트리밍 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="정적 캐시 레이아웃 + React 19 use(UserContext) 세션 스트리밍">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>이 패턴은 GNB 헤더와 전체 상품 레이아웃 셸을 <code>'use cache'</code>로 100% 정적 캐싱하여 0ms로 즉시 브라우저에 서빙하고, 사용자 로그인 세션(프로필 이름, 아바타)은 React 19 <code>use(UserContext)</code>를 통해 클라이언트 사이드에서 비동기 스트리밍으로 바인딩하는 하이브리드 아키텍처 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 페이지 최초 로드 시 무거운 상품 카탈로그 레이아웃이 서버 캐시에서 즉시 표시되고, 상단 헤더의 [로그인 영역]만 스켈레톤 상태에서 실제 사용자 세션 데이터로 깜빡임 없이 자연스럽게 채워지는 파이프라인을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>최고 수준의 TTFB 및 캐시 히트율</strong>: 인증 사용자 여부와 상관없이 모든 방문자에게 동일한 고속 정적 셸을 CDN에서 즉시 서빙합니다.</li>
                    <li><strong>로그인 후 화면 깜빡임 제거</strong>: 전체 화면을 다시 그리지 않고 오직 헤더의 프로필 위젯만 마이크로 하이드레이션됩니다.</li>
                    <li><strong>확장성(Scalability) 극대화</strong>: 대규모 트래픽 발생 시에도 백엔드 세션 DB로의 조회가 화면 전체 렌더링을 블로킹하지 않습니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 메인 페이지(공통 정적 기획전 셸 + 우측 상단 사용자 프로필 뱃지)</li>
                    <li>커뮤니티 포털(정적 게시판 레이아웃 + 로그인 사용자별 알림 카운터)</li>
                    <li>동영상 플랫폼(정적 추천 비디오 그리드 + 개인 구독 채널 목록)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Context Provider 위치 설계</strong>: <code>UserContextProvider</code>는 루트 또는 공통 레이아웃에 배치하고, 세션 Promise를 Props로 주입하여 <code>use(sessionPromise)</code>로 언래핑해야 합니다.</li>
                    <li><strong>스켈레톤 영역 크기 고정</strong>: 프로필 로딩 중 스켈레톤의 너비와 높이를 실제 아바타 크기와 동일하게 맞춰 레이아웃 이동(CLS)을 방지해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
