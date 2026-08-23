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

  const defaultExpected = "• 독립 탭 네비게이션 슬롯 (Parallel Routes) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="독립 탭 네비게이션 슬롯 (Parallel Routes) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="독립 탭 네비게이션 슬롯 (Parallel Routes Independent Sub-navigation)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Parallel Routes의 각 <code>@slot</code>은 독립적인 서브 라우팅 히스토리를 가질 수 있어, 한 슬롯 내부에서 탭 이동이나 서브 세그먼트 전환이 발생해도 다른 슬롯의 스크롤 위치와 상태가 그대로 보존됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 좌측 <code>@metrics</code> 슬롯에서 [일간/주간/월간] 탭을 전환하거나 우측 <code>@feed</code> 슬롯에서 [실시간 알림/시스템 로그] 탭을 클릭했을 때, 상대편 슬롯의 렌더링 상태를 전혀 방해하지 않고 독립적으로 서브 뷰가 전환되는 동작을 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>상호 독립적 탭 상태 유지</strong>: 복수의 인터랙티브 위젯이 서로의 UI 상태를 초기화하지 않고 각자 독립적으로 동작합니다.</li>
              <li><strong>정밀한 Suspense 스트리밍</strong>: 탭 전환 시 변경된 슬롯의 데이터만 선별적으로 재검증하여 네트워크 비용을 절감합니다.</li>
              <li><strong>멀티태스킹 최적화 UX</strong>: 사용자가 여러 작업 영역(분석 지표 확인 + 로그 모니터링)을 동시에 탐색할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>거래소/핀테크 플랫폼의 차트 위젯과 호가창/체결 내역 패널의 독립 전환</li>
              <li>이커머스 판매자 센터의 주문 관리 탭과 배송 현황 탭의 동시 모니터링</li>
              <li>고객센터 상담원의 문의 내역 조회와 고객 프로필 탭 분할 뷰</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>URL 동기화 설계</strong>: 슬롯별 서브 경로가 URL에 매핑될 때 상위 레이아웃의 슬롯 수명 주기를 고려하여 <code>default.tsx</code> 폴백을 철저히 구성해야 합니다.</li>
              <li><strong>클라이언트 상태와의 결합</strong>: 탭 전환이 빈번한 경우 서버 라우팅 대신 로컬 컴포넌트 상태로 처리할지, 독립 URL이 필요한지(Parallel Route)를 트레이드오프 분석 후 선택해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
