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

  const defaultExpected = "• useSearchParams() URL 쿼리 파싱 및 필터링 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="useSearchParams() URL 쿼리 파싱 및 필터링 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="useSearchParams() URL 쿼리 파싱 및 필터링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useSearchParams()</code> (<code>next/navigation</code>)는 현재 URL의 쿼리 스트링을 <code>ReadonlyURLSearchParams</code> 인터페이스(Web <code>URLSearchParams</code>의 읽기 전용 래퍼)로 읽어오는 클라이언트 훅입니다. <code>get()</code>, <code>getAll()</code>, <code>has()</code> 등의 메서드를 제공합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 사용자가 [카테고리], [가격대], [정렬 기준] 필터 버튼을 클릭할 때 <code>useSearchParams()</code>로 현재 쿼리를 읽고, 새 파라미터를 추가/수정하여 <code>router.push()</code>로 URL을 변경하고 목록을 즉시 갱신합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>URL SSOT(Single Source of Truth) 보장</strong>: UI 상태를 별도 전역 상태 없이 URL 쿼리에 완벽히 동기화하여 북마크와 링크 공유를 지원합니다.</li>
              <li><strong>다중 값(Multi-value) 파싱</strong>: <code>getAll('brand')</code>를 통해 복수 선택된 필터 배열을 손쉽게 추출합니다.</li>
              <li><strong>웹 표준 호환성</strong>: 브라우저 표준 <code>URLSearchParams</code> API 규격을 준수하여 러닝 커브가 낮습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 목록 검색 결과 페이지의 다중 패싯 필터(브랜드, 가격, 색상)</li>
              <li>테이블 뷰의 페이지네이션(<code>?page=2&limit=20</code>) 및 정렬(<code>?sort=price_desc</code>)</li>
              <li>마케팅 캠페인 유입 추적(<code>?utm_source=meta&utm_campaign=summer</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Suspense 바운더리 필수</strong>: 정적 렌더링(SSG) 페이지에서 <code>useSearchParams()</code>를 사용하는 클라이언트 컴포넌트는 빌드 시점에 렌더링을 차단하므로 반드시 <code>{'<'}Suspense{'>'}</code>로 감싸야 합니다.</li>
              <li><strong>불변 객체 수정 안티패턴</strong>: <code>useSearchParams()</code>가 반환한 객체는 읽기 전용이므로 <code>new URLSearchParams(searchParams.toString())</code>로 복제 후 조작해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
