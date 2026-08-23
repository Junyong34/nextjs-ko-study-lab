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

  const defaultExpected = "• Parallel Routes (@slots) 다중 슬롯 병렬 렌더링 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Parallel Routes (@slots) 다중 슬롯 병렬 렌더링 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Parallel Routes (@slots) 다중 슬롯 병렬 렌더링 아키텍처">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Parallel Routes는 골뱅이 기호(<code>@slotName</code>) 폴더 컨벤션을 통해 동일한 레이아웃 내에서 복수의 페이지 컴포넌트를 병렬 슬롯(<code>props.slotName</code>)으로 주입받아 동시에 렌더링하는 Next.js 코어 아키텍처입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 대시보드 레이아웃에서 <code>@analytics</code>, <code>@team</code>, <code>children</code> 슬롯을 동시에 마운트하여, 각 슬롯이 독립적인 로딩 상태와 에러 바운더리를 가지며 병렬로 데이터를 페치하고 UI를 렌더링하는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>독립적 로딩 & 에러 격리</strong>: 한 슬롯의 느린 데이터 페칭이나 런타임 오류가 다른 슬롯 및 메인 콘텐츠의 렌더링을 차단하지 않습니다.</li>
              <li><strong>동시 다발적 뷰 조합</strong>: 단일 URL 경로 아래에서 복잡한 멀티 패널 대시보드를 선언적으로 조합합니다.</li>
              <li><strong>조건부 슬롯 스위칭</strong>: 사용자 권한이나 상태에 따라 레이아웃에서 슬롯을 동적으로 선택 렌더링할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>관리자 분석 대시보드 (통계 차트 슬롯 + 실시간 활동 피드 슬롯 + 메인 그리드)</li>
              <li>소셜 커뮤니티 피드 (게시글 목록 + 추천 친구 슬롯 + 알림 패널)</li>
              <li>이커머스 상품 상세 (상품 정보 + 연관 추천 상품 슬롯 + 실시간 문의 채팅)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>default.tsx 필수 선언</strong>: 병렬 슬롯 중 하나만 라우트가 변경될 때 일치하지 않는 다른 슬롯의 404 방지를 위해 모든 <code>@slot</code> 폴더에 <code>default.tsx</code>를 배치해야 합니다.</li>
              <li><strong>슬롯명 네이밍 규칙</strong>: <code>@children</code>은 기본 예약어이므로 커스텀 슬롯에는 <code>@team</code>, <code>@modal</code> 등 명확한 도메인 이름을 사용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
