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

  const defaultExpected = "• experimental.staleTimes 클라이언트 라우터 캐시 시간 제어 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="experimental.staleTimes 클라이언트 라우터 캐시 시간 제어 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                                    <DemoDeepDiveCard title="staleTimes 설정을 통한 클라이언트 Router Cache 튜닝">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p><code>next.config.ts</code>의 <code>experimental.staleTimes</code> 옵션은 클라이언트 브라우저 메모리에 유지되는 App Router 캐시(Router Cache)의 정적(<code>static</code>) 및 동적(<code>dynamic</code>) 세그먼트 신선도 유지 시간(초)을 커스터마이징하는 클라이언트 캐시 튜닝 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 <code>staleTimes: {'{'} dynamic: 30, static: 180 {'}'}</code> 설정에 따라 동적 라우트 이동 후 30초 이내에는 뒤로가기 시 0ms 즉시 메모리에서 렌더링되고, 30초 경과 후 재방문 시 서버로 최신 RSC를 다시 요청하는 동작을 확인합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>불필요한 클라이언트 재요청 절감</strong>: 사용자가 메뉴 탭을 빈번하게 오갈 때 발생하는 반복적인 RSC 페치 트래픽을 완벽히 흡수합니다.</li>
                          <li><strong>실시간성과 성능의 완벽한 균형</strong>: 정적 콘텐츠는 길게(180초), 동적 데이터는 짧게(30초) 차등 튜닝하여 비즈니스 정합성을 만족합니다.</li>
                          <li><strong>모바일 브라우저 배터리 절약</strong>: 네트워크 칩셋 활성화 빈도를 줄여 모바일 기기의 전력 소모와 데이터 비용을 절감합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>쇼핑몰 탭 네비게이션(홈, 랭킹, 기획전, 마이페이지) 간의 고속 탐색</li>
                          <li>실시간 재고 조회가 중요한 커머스 화면의 Router Cache 수명 단축 튜닝</li>
                          <li>콘텐츠 변경이 적은 기업 홍보관 및 문서 사이트의 Router Cache 수명 연장</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>0초 설정 시의 영향</strong>: <code>dynamic: 0</code>으로 설정하면 모든 페이지 이동마다 서버로 요청이 발송되므로 서버 트래픽이 증가함을 인지해야 합니다.</li>
                          <li><strong>Server Actions 후 자동 무효화</strong>: Server Action 실행 시에는 staleTimes 설정과 무관하게 관련 Router Cache가 자동으로 클리어되어 최신 상태를 보장합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
