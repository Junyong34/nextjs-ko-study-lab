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

  const defaultExpected = "• 진입 애니메이션 및 폼 리셋 (template.tsx)의 동작과 기대 결과를 확인합니다."
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
        title="진입 애니메이션 및 폼 리셋 (template.tsx) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="template.tsx 진입 애니메이션 재생 및 폼 입력 상태 자동 리셋">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>template.tsx</code>는 라우트 이동 시마다 새로운 React 컴포넌트 인스턴스를 생성하므로, 내부의 로컬 폼 상태(<code>useState</code>)를 0ms 지연으로 자동 초기화하고 CSS 진입 애니메이션(Fade-in/Slide-in)을 매번 새롭게 재생시키는 파일 컨벤션입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자가 [검색어 입력 폼]에 텍스트를 작성하고 다른 탭 메뉴로 이동했을 때, <code>layout.tsx</code> 영역과 달리 <code>template.tsx</code>로 감싸진 입력 폼이 즉시 초기화되며 새로운 슬라이드인 애니메이션과 함께 렌더링되는 동작을 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>자동 상태 격리(Zero Stale State)</strong>: 이전 탭에서 작성 중이던 미저장 폼 데이터가 다음 페이지에 오염되는 현상을 프레임워크 레벨에서 방지합니다.</li>
              <li><strong>시각적 페이지 전환 피드백</strong>: 브라우저 히스토리 탐색 시 사용자에게 명확한 화면 갱신 인터랙션을 제공합니다.</li>
              <li><strong>선언적 초기화 구조</strong>: 복잡한 <code>useEffect</code> 클린업 함수나 라우터 이벤트 리스너 없이 파일 분리만으로 리셋 메커니즘을 완성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>다단계 회원가입 및 결제 주문서의 단계별 입력 폼 초기화</li>
              <li>탭별 독립 검색창 및 필터 입력 위젯</li>
              <li>마케팅 이벤트 배너의 탭 전환 시 시각적 진입 모션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>스크롤 위치 유지 충돌 고려</strong>: <code>template.tsx</code>로 전체 본문을 감싸면 페이지 전환 시 스크롤 위치가 유지되지 않고 상단으로 리셋될 수 있으므로, 스크롤 유지가 중요한 경우 <code>layout.tsx</code>와 조합하여 사용해야 합니다.</li>
              <li><strong>Key 수동 조작 불필요</strong>: Next.js가 내부적으로 라우트 세그먼트 기반 고유 키를 자동 부여하므로 개발자가 임의의 <code>key</code>를 템플릿 루트에 덮어쓰지 않도록 주의합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
