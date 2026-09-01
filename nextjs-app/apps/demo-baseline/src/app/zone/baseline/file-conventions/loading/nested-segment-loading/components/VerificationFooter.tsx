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

  const defaultExpected = "• 중첩 라우트 세그먼트 로딩 격리의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="중첩 라우트 세그먼트 로딩 격리 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="중첩 라우트 세그먼트 로딩 격리 (Nested loading.tsx)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>loading.tsx</code>는 중첩 디렉토리 구조(<code>app/shop/loading.tsx</code>, <code>app/shop/[category]/loading.tsx</code>)에 따라 세그먼트 단위로 독립적인 Suspense 경계를 형성합니다. 상위 세그먼트 데이터가 준비된 상태에서 하위 세그먼트만의 로딩 상태를 부분적으로 격리하여 표시합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 카테고리 메인에서 하위 상품 상세로 진입할 때, 상위 카테고리 GNB와 필터 바는 정상 렌더링된 상태를 유지하고 하위 상세 영역만 중첩 <code>loading.tsx</code> 스켈레톤으로 격리 로딩되는 단계를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>부분적 로딩 격리(Isolated Suspense)</strong>: 전체 화면이 깜빡이지 않고 변경되는 하위 세그먼트 영역만 정밀하게 로딩 스켈레톤으로 대체합니다.</li>
              <li><strong>데이터 의존성 분리</strong>: 빠른 상위 데이터(카테고리 정보)는 즉시 렌더링하고 느린 하위 데이터(리뷰, 재고)만 비동기로 대기합니다.</li>
              <li><strong>네이티브 앱급 내비게이션 경험</strong>: 탭 전환 및 하위 탐색 시 시각적 안정성을 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대형 쇼핑몰의 카테고리 뷰어 내 하위 상품 상세 탭 전환</li>
              <li>마이페이지 내 주문 상세 내역 및 영수증 조회 영역</li>
              <li>파트너 센터 내 일별 매출 통계 차트 위젯 로딩</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>상위 loading.tsx의 전파 범위</strong>: 하위 디렉토리에 전용 <code>loading.tsx</code>가 없는 경우 가장 가까운 상위 <code>loading.tsx</code>가 상속되어 렌더링되므로, 하위 세그먼트의 독립적 UI가 필요하다면 전용 <code>loading.tsx</code>를 추가해야 합니다.</li>
              <li><strong>서버 컴포넌트 스트리밍 순서</strong>: 중첩된 서버 컴포넌트들은 상위부터 차례대로 해석되므로 상위 세그먼트의 blocking await가 길어지면 하위 loading.tsx 진입도 지연될 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
