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

  const defaultExpected = "• 세그먼트 즉시 프리패칭 (instant) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="세그먼트 즉시 프리패칭 (instant) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Next.js 프리페칭 아키텍처 & Router Cache 기반 인스턴트 내비게이션">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js App Router는 <code>{'<'}Link prefetch{'>'}</code> 컴포넌트와 클라이언트 Router Cache, 그리고 부분 사전 렌더링(PPR)을 결합하여 페이지 이동 지연을 0ms로 단축하는 인스턴트 내비게이션 아키텍처를 제공합니다. (참고: Route Segment Config에 별도의 <code>export const instant</code> 상수는 존재하지 않으며, Link 컴포넌트 및 PPR 설정으로 제어합니다.)
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자의 뷰포트에 <code>{'<'}Link href="/products/101" prefetch={'{'}true{'}'}{'>'}</code>가 노출되거나 호버되는 순간, Next.js 라우터가 백그라운드에서 RSC 페이로드(또는 PPR 정적 셸)를 사전에 가져와 메모리 캐시에 적재함으로써 클릭 즉시 0ms 화면 전환을 구현합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>네이티브 앱 수준의 반응 속도</strong>: 네트워크 왕복 시간(RTT)을 사용자의 클릭 전에 미리 소비하여 전환 체감 속도를 극대화합니다.</li>
              <li><strong>대역폭 지능형 절약</strong>: 변경되지 않은 상위 레이아웃을 제외하고 변경되는 하위 세그먼트 데이터만 선별적으로 프리페치합니다.</li>
              <li><strong>이커머스 구매 전환율 증대</strong>: 상품 목록에서 상세 페이지 및 주문서로의 이동 이탈률을 획기적으로 낮춥니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 메인 GNB 카테고리 탭 메뉴 및 베스트셀러 배너 링크</li>
              <li>장바구니 화면의 [주문서 작성/결제하기] CTA 버튼 사전 로드</li>
              <li>검색 결과 목록 상위 노출 1~3위 핵심 상품 상세 링크</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>과도한 prefetch=true 지양</strong>: 링크가 수백 개 존재하는 대규모 리스트에서 <code>prefetch={'{'}true{'}'}</code>를 남용하면 서버 트래픽과 모바일 데이터가 낭비되므로, 기본 뷰포트 프리페치(정적 셸/loading.tsx까지만 로드)를 사용하는 것이 안전합니다.</li>
              <li><strong>staleTimes 튜닝</strong>: 동적 데이터의 최신성이 중요한 경우 <code>next.config.ts</code>의 <code>experimental.staleTimes.dynamic</code> 설정을 통해 Router Cache 유효 시간을 조율해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
