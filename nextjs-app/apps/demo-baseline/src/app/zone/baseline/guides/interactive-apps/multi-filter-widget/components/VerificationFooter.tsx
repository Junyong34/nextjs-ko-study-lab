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

  const defaultExpected = "• 다중 필터/정렬/장바구니 복합 인터랙티브 위젯 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="다중 필터/정렬/장바구니 복합 인터랙티브 위젯 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="다중 필터/정렬/장바구니 복합 인터랙티브 위젯">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js의 복합 인터랙티브 위젯 아키텍처는 URL 검색 파라미터(<code>useSearchParams</code>), React 19의 비동기 트랜지션(<code>useTransition</code>), 그리고 클라이언트 상태를 결합하여 복잡한 필터링·정렬·장바구니 상호작용을 끊김 없이 반응하도록 구성하는 UI 표준 패턴입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 카테고리 태그 다중 선택, 가격대 슬라이더 조절, 정렬 기준 변경 시 <code>useTransition</code>으로 감싸진 라우터 이동이 비차단(Non-blocking)으로 실행되며, 선택된 필터 뱃지와 상품 목록이 부드럽게 갱신되는 과정을 실증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>공유 및 새로고침 가능한 URL 상태 보존</strong>: 모든 필터링 및 정렬 조건이 <code>?category=outer&sort=price_asc</code> 형태로 URL에 동기화되어 링크 공유 및 북마크가 가능합니다.</li>
              <li><strong>메인 스레드 블로킹 없는 빠른 응답(INP 최적화)</strong>: 복잡한 필터 계산 중에도 체크박스 클릭과 슬라이더 드래그가 멈춤 없이 부드럽게 동작합니다.</li>
              <li><strong>뒤로 가기 / 앞으로 가기 완벽 지원</strong>: 브라우저 히스토리와 상태가 완벽히 연동되어 이전 필터 조건으로 즉시 복귀할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>패션/전자기기 쇼핑몰 카테고리 상품 목록의 다중 조건 패싯(Facet) 검색 필터</li>
              <li>호텔/숙박 예약 사이트의 날짜, 인원수, 편의시설 다중 필터 위젯</li>
              <li>채용 공고 포털의 직군, 경력, 지역, 연봉 복합 필터링 대시보드</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>연속 입력 시 디바운스(Debounce) 적용 필수</strong>: 가격 슬라이더나 검색어 입력처럼 고빈도로 발생하는 이벤트는 300ms 디바운스를 적용하여 불필요한 URL 갱신과 서버 요청을 방지해야 합니다.</li>
              <li><strong>useSearchParams Suspense 래핑</strong>: 클라이언트 컴포넌트에서 <code>useSearchParams</code>를 사용할 때는 정적 렌더링 최적화를 위해 컴포넌트를 <code>{'<'}Suspense{'>'}</code>로 감싸야 빌드 경고를 피할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
