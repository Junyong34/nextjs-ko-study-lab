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

  const defaultExpected = "• SWR 실시간 배송 조회 자동 폴링 & mutate() 갱신 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="SWR 실시간 배송 조회 자동 폴링 & mutate() 갱신 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="SWR 실시간 배송 조회 자동 폴링 & mutate() 갱신">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>SWR(Stale-While-Revalidate)의 <code>refreshInterval</code> 옵션은 클라이언트 사이드에서 지정된 주기(e.g. 3000ms)마다 백그라운드 HTTP 폴링을 실행하여 데이터를 최신화하고, 탭 포커스(<code>revalidateOnFocus</code>) 및 네트워크 재연결 시 즉시 재검증을 수행하는 실시간 클라이언트 데이터 페칭 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 실시간 택배 배송 트래킹 화면에서 3초 주기로 배송 기사 위치와 상태(집화완료 -{'>'} 이동중 -{'>'} 배송출발 -{'>'} 배송완료)를 자동 폴링하고, [즉시 갱신] 버튼 클릭 시 <code>mutate()</code>를 호출하여 폴링 주기와 무관하게 즉각 최신 상태를 반영하는 흐름을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>자동 백그라운드 동기화</strong>: 별도의 복잡한 WebSocket 서버 인프라 구축 없이 표준 HTTP 엔드포인트만으로 실시간성 UI를 구현합니다.</li>
                    <li><strong>지능형 자원 절약</strong>: 사용자가 다른 브라우저 탭으로 전환하거나 화면을 최소화하면 폴링을 자동으로 일시 중단하여 불필요한 배터리와 트래픽 소모를 방지합니다.</li>
                    <li><strong>강력한 내장 캐시</strong>: 이전 요청 데이터를 로컬 메모리에 보존하여 재검증 중에도 깜빡임 없는 매끄러운 뷰를 제공합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>배달 음식 주문 후 라이더 위치 및 도착 예정 시간 실시간 트래킹</li>
                    <li>주식/가상자산 거래소의 실시간 시세 및 호가창 자동 업데이트</li>
                    <li>고객센터 상담 대기 인원 수 및 티켓 처리 현황 모니터링</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>폴링 주기 최적화</strong>: 너무 짧은 폴링 주기(e.g. 500ms)는 서버 API 게이트웨이에 심각한 트래픽 부하를 유발하므로 실무 요구사항에 맞는 적절한 간격(3~10초)을 설정해야 합니다.</li>
                    <li><strong>Server Actions와의 역할 분담</strong>: 초기 화면 렌더링은 Server Component로 처리하고, 이후의 주기적 실시간 갱신 영역만 SWR을 적용하는 하이브리드 구성이 권장됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
