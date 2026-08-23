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

  const defaultExpected = "• useSelectedLayoutSegment() 하위 탭 인디케이터 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="useSelectedLayoutSegment() 하위 탭 인디케이터 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="useSelectedLayoutSegment() 단일 활성 세그먼트 인디케이터">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useSelectedLayoutSegment()</code> (<code>next/navigation</code>)는 현재 레이아웃 바로 한 단계 아래의 활성화된 단일 라우트 세그먼트 이름을 문자열(또는 <code>null</code>)로 반환하는 클라이언트 훅입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 카테고리 레이아웃 하위에서 <code>useSelectedLayoutSegment()</code>를 호출하여 사용자가 진입한 세그먼트(<code>'electronics'</code>, <code>'fashion'</code>, <code>'books'</code>)를 감지하고, 서브 네비게이션 바의 해당 필(Pill) 버튼에 액티브 스타일을 실시간으로 바인딩합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>단일 단계 정밀 타겟팅</strong>: 전체 경로를 파싱하지 않고 바로 직하위 세그먼트 이름만 단일 문자열로 추출하여 탭 UI 구현 코드가 간결해집니다.</li>
              <li><strong>병렬 라우트 슬롯 지원</strong>: <code>useSelectedLayoutSegment('slotName')</code> 인수를 통해 특정 <code>@slot</code>의 활성 세그먼트도 조회할 수 있습니다.</li>
              <li><strong>하위 깊이 격리</strong>: 더 깊은 중첩 경로(<code>electronics/laptops/123</code>)로 이동해도 직하위 세그먼트(<code>electronics</code>)만 안정적으로 반환합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 카테고리 탭(패션, 가전, 리빙)의 서브 네비게이션 탭 필(Pill) 활성화</li>
              <li>설정 페이지(계정, 알림, 보안)의 직하위 서브 라우트 메뉴 인디케이터</li>
              <li>마이페이지 내 주문/쿠폰/포인트 탭 바의 슬라이딩 액티브 바 위치 계산</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>루트 세그먼트 null 반환</strong>: 현재 레이아웃과 동일한 기본 경로에 머물러 있는 경우 <code>null</code>을 반환하므로 <code>segment ?? 'default'</code> 형태의 기본값 처리가 필요합니다.</li>
              <li><strong>다중 계층 불가</strong>: 전체 경로의 배열이 필요한 브레드크럼 구현에는 <code>useSelectedLayoutSegments()</code>(복수형)을 사용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
