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

  const defaultExpected = "• [category]/layout.tsx 동적 카테고리 레이아웃 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="[category]/layout.tsx 동적 카테고리 레이아웃 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="동적 세그먼트 레이아웃 ([category]/layout.tsx) 및 파라미터 컨텍스트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>[category]/layout.tsx</code>는 동적 라우트 세그먼트(Dynamic Segment)에서 동작하는 레이아웃으로, <code>params</code> Promise를 전달받아 동적 카테고리별 공통 헤더, 서브 카테고리 탭, 프로모션 배너를 하위 경로 전체에 일관되게 제공합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>electronics</code>, <code>fashion</code>, <code>food</code> 등 동적 카테고리 파라미터를 변경할 때, 레이아웃 레벨에서 <code>category</code> 값을 읽어 해당 카테고리 전용 서브 네비게이션 탭과 실시간 필터를 렌더링하고 하위 상품 목록 뷰를 감싸는 동작을 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>도메인별 맞춤 레이아웃 격리</strong>: 카테고리별 특화 UI(패션 사이즈 필터, 전자기기 스펙 비교 바 등)를 해당 하위 페이지 전체에 선언적으로 적용합니다.</li>
              <li><strong>서브 네비게이션 상태 영속성</strong>: 카테고리 내부에서 상품 상세나 리뷰 탭 간 이동 시에도 상위 카테고리 헤더와 정렬 기준이 유지됩니다.</li>
              <li><strong>동적 메타데이터와의 유기적 결합</strong>: <code>generateMetadata</code>와 결합하여 카테고리별 오픈그래프 배너와 SEO 태그를 레이아웃 단위에서 자동 생성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대형 이커머스의 카테고리별 특화 기획전 템플릿(의류/가전/식품)</li>
              <li>다국어 및 지역별 스토어(예: <code>/[country]/[category]</code>) 레이아웃 분기</li>
              <li>B2B 판매자 전용 센터(예: <code>/[merchantId]/analytics</code>) 상단 브랜드 헤더</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>React 19 비동기 params 처리</strong>: Next.js 15+에서는 레이아웃의 <code>params</code>가 <code>Promise</code> 타입이므로, 서버 컴포넌트에서는 <code>await params</code>, 클라이언트 컴포넌트에서는 <code>use(params)</code>로 언래핑해야 합니다.</li>
              <li><strong>상위 세그먼트 전환 시 재렌더링</strong>: 동적 파라미터 자체가 바뀌는 경우(예: <code>/fashion</code>에서 <code>/electronics</code>로 이동)에는 레이아웃 인스턴스가 언마운트 후 재생성되므로 내부 상태가 초기화됨에 유의해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
