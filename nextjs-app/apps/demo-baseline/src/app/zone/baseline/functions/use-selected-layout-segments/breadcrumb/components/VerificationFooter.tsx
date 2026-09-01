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

  const defaultExpected = "• useSelectedLayoutSegments() 계층형 브레드크럼 생성의 동작과 기대 결과를 확인합니다."
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
        title="useSelectedLayoutSegments() 계층형 브레드크럼 생성 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="useSelectedLayoutSegments() 계층형 브레드크럼 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useSelectedLayoutSegments()</code> (<code>next/navigation</code>)는 현재 레이아웃 하위의 모든 활성화된 중첩 라우트 세그먼트들을 문자열 배열(<code>string[]</code>)로 반환하는 클라이언트 훅입니다. 계층형 브레드크럼(Breadcrumbs) 네비게이션 구현에 최적화되어 있습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 깊은 중첩 경로(<code>/shop/fashion/outer/coats</code>) 진입 시 <code>useSelectedLayoutSegments()</code>가 반환한 <code>['fashion', 'outer', 'coats']</code> 배열을 매핑하여 단계별 이동 링크와 화살표 구분자가 포함된 브레드크럼 트리를 동적으로 구성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>전체 중첩 깊이 자동 수집</strong>: 하위 세그먼트가 몇 단계로 깊어지든 배열 형태로 일괄 수집하여 브레드크럼을 손쉽게 렌더링합니다.</li>
              <li><strong>라우트 그룹 무시</strong>: 괄호로 묶인 라우트 그룹(<code>(shop)</code>)은 반환 배열에서 자동으로 제외되어 사용자 친화적인 URL 세그먼트만 남깁니다.</li>
              <li><strong>동적 경로 라우팅 연계</strong>: 각 세그먼트를 누적(accumulate)하여 상위 단계로의 역방향 링크를 안전하게 생성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 쇼핑몰 카테고리 계층 브레드크럼 (홈 {'>'} 여성의류 {'>'} 아우터 {'>'} 코트)</li>
              <li>파일 탐색기 및 클라우드 드라이브 폴더 계층 내비게이션</li>
              <li>다단계 복잡한 설정 및 엔터프라이즈 관리자 메뉴의 위치 추적 바</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>단수형과의 차이</strong>: 단일 탭 인디케이터에는 <code>useSelectedLayoutSegment()</code>(단수형)을, 전체 계층 추적에는 <code>useSelectedLayoutSegments()</code>(복수형)을 명확히 구분해 사용해야 합니다.</li>
              <li><strong>Client Component 전용</strong>: 레이아웃 컴포넌트 자체는 Server Component로 유지하고, 브레드크럼 렌더링 영역만 <code>'use client'</code> 컴포넌트로 분리하는 아키텍처가 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
