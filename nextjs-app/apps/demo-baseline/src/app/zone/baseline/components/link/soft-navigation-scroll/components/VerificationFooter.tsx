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

  const defaultExpected = "• <Link> 소프트 내비게이션 및 scroll 제어의 동작과 기대 결과를 확인합니다."
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
        title="<Link> 소프트 내비게이션 및 scroll 제어 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="<Link> 소프트 내비게이션 & scroll 제어 (scroll={true | false})">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>{'<'}Link{'>'}</code> 컴포넌트의 <code>scroll</code> 속성은 페이지 이동 시 브라우저 스크롤 위치를 상단(<code>window.scrollTo(0, 0)</code>)으로 초기화할지(<code>scroll={'{'}true{'}'}</code>, 기본값), 아니면 현재 스크롤 위치를 그대로 유지할지(<code>scroll={'{'}false{'}'}</code>)를 제어하는 내비게이션 옵션입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 탭 전환이나 페이지네이션(2페이지, 3페이지 클릭) 시 <code>scroll={'{'}false{'}'}</code>를 적용하여 사용자가 보고 있던 상품 리스트 스크롤 위치를 유지하고, 다른 카테고리로 이동할 때는 <code>scroll={'{'}true{'}'}</code>로 상단 배너부터 보여주는 UX를 대조 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>탭 및 필터 조작 시 스크롤 튐 방지</strong>: 검색 필터나 서브 탭 클릭 시 화면이 최상단으로 강제 롤백되는 불편한 UX를 완벽히 해결합니다.</li>
              <li><strong>해시(#) 앵커 스크롤 자동 정렬</strong>: <code>{'<'}Link href="#reviews" scroll={'{'}true{'}'}{'>'}</code> 사용 시 해당 ID를 가진 DOM 엘리먼트 위치로 부드럽게 자동 스크롤됩니다.</li>
              <li><strong>SPA 상태 연속성 보장</strong>: 장바구니 수량 변경이나 좋아요 토글 시 사용자의 시각적 컨텍스트를 보존합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 목록 페이지네이션 (1페이지 -{'>'} 2페이지 이동 시 스크롤 유지)</li>
              <li>상세 페이지 내 탭 네비게이션 ([상품정보] / [리뷰] / [Q&A] 전환)</li>
              <li>검색 결과 정렬 옵션 변경 (낮은가격순, 최신순 필터링)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>router.push()에서의 동일 제어</strong>: 프로그래밍 방식 내비게이션에서도 <code>router.push('/products', {'{'} scroll: false {'}'})</code> 옵션을 통해 동일하게 스크롤 초기화를 방지할 수 있습니다.</li>
              <li><strong>접근성(a11y) 고려</strong>: 긴 페이지 이동 시 스크롤이 유지되면 사용자가 페이지가 바뀐 것을 인지하지 못할 수 있으므로, 완전히 새로운 경로로 이동할 때는 기본값(<code>scroll: true</code>)을 유지하는 것이 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
