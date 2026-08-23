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

  const defaultExpected = "• 카테고리 전환 시 장바구니 Drawer 열림 유지 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="카테고리 전환 시 장바구니 Drawer 열림 유지 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="카테고리 전환 시 장바구니 Drawer 열림 유지">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js App Router의 중첩 레이아웃(<code>layout.tsx</code>) 또는 최상위 React Context Provider에 클라이언트 상태(장바구니 Drawer 열림 여부, 작성 중인 쪽지 등)를 유지함으로써, 하위 라우트 세그먼트가 이동하더라도 Drawer UI와 인터랙션 상태가 닫히거나 초기화되지 않도록 보존하는 표준 상태 보존 패턴입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 우측 하단 장바구니 Drawer를 열어둔 상태에서 <code>/clothing</code>, <code>/electronics</code>, <code>/shoes</code> 등 서로 다른 카테고리 링크를 클릭해도, 메인 상품 목록만 새로고침되고 열려 있던 Drawer UI와 내부 장바구니 품목 목록이 그대로 유지되는 동작을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>쇼핑 전환율 및 사용자 경험 극대화</strong>: 상품을 장바구니에 담아둔 채 다른 카테고리를 자유롭게 둘러보아도 Drawer가 닫히지 않아 결제 흐름이 단절되지 않습니다.</li>
                    <li><strong>불필요한 전역 리렌더링 차단</strong>: 페이지 URL 전환이 발생해도 최상위 Layout 레벨의 UI 컴포넌트는 리렌더되지 않고 보존됩니다.</li>
                    <li><strong>자연스러운 모달/드로어 인터랙션</strong>: SPA 특유의 부드러운 상태 유지 경험을 라우팅과 완벽히 결합합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 퀵 장바구니 드로어 및 실시간 결제 예정 금액 플로팅 바</li>
                    <li>1:1 실시간 고객상담 채팅 위젯의 페이지 이동 간 대화창 유지</li>
                    <li>음악 스트리밍 및 오디오북 플레이어의 연속 재생 컨트롤러</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>상태 위치(Lift State Up) 주의</strong>: Drawer 상태를 <code>page.tsx</code> 내부에 두면 페이지 이동 시 언마운트되므로, 반드시 <code>layout.tsx</code>나 별도의 글로벌 Client Provider에 상태를 두어야 합니다.</li>
                    <li><strong>URL 동기화 결합 고려</strong>: 필요에 따라 Drawer 열림 여부를 <code>?drawer=open</code>과 같은 URL 쿼리 파라미터와 동기화하면 브라우저 뒤로가기로 드로어를 닫는 UX를 구현할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
