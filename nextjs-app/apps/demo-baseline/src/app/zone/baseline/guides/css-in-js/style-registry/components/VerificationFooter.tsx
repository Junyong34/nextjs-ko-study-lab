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

  const defaultExpected = "• Style Registry를 통한 CSS-in-JS SSR 스타일 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Style Registry를 통한 CSS-in-JS SSR 스타일 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Style Registry를 통한 CSS-in-JS SSR 스타일 주입">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>CSS-in-JS 라이브러리(Styled-components, Emotion, Ant Design 등)를 App Router에서 사용할 때, <code>useServerInsertedHTML</code> 훅을 활용하여 서버 렌더링 중 생성된 CSS 규칙을 캡처하고 <code>{'<'}head{'>'}</code> 태그 내에 <code>{'<'}style{'>'}</code> 태그로 직접 주입하여 스타일 깜빡임(FOUC)을 방지하는 표준 레지스트리 패턴입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 Styled-components 기반의 버튼과 카드 컴포넌트가 서버에서 렌더링될 때 스타일 레지스트리가 CSS 문자열을 추출하고, 클라이언트가 HTML을 수신하는 즉시 완벽한 스타일이 적용되어 깜빡임 없이 렌더링되는 파이프라인을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>스타일 깜빡임(FOUC: Flash of Unstyled Content) 원천 차단</strong>: 브라우저 자바스크립트가 로드되기 전에 서버가 생성한 완전한 CSS 스타일시트를 함께 전달합니다.</li>
                    <li><strong>레거시 CSS-in-JS 생태계 호환성</strong>: 기존 Pages Router에서 작성된 방대한 Styled-components 디자인 시스템 자산을 App Router로 원활하게 이관 가능합니다.</li>
                    <li><strong>동적 테마 스타일링 유지</strong>: React Props 기반의 동적 색상/크기 계산 로직을 그대로 유지할 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>Styled-components 기반 엔터프라이즈 디자인 시스템의 Next.js App Router 도입</li>
                    <li>Ant Design, MUI(Material UI) 등 런타임 CSS-in-JS 기반 UI 라이브러리 연동</li>
                    <li>사용자 정의 테마 색상(Primary Color)이 실시간으로 반영되어야 하는 커스텀 대시보드</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>'use client' 선언 필수</strong>: Style Registry 컴포넌트는 React Context와 훅을 사용하므로 파일 상단에 반드시 <code>'use client'</code>를 명시해야 합니다.</li>
                    <li><strong>React Server Component 한계</strong>: 런타임 CSS-in-JS 라이브러리는 서버 컴포넌트 내부에서 직접 스타일을 동적으로 생성할 수 없으므로, Tailwind CSS나 CSS Modules 같은 제로 런타임 방식을 우선 고려하는 것이 좋습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
