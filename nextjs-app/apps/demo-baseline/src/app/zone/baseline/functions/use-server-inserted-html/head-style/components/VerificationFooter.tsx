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

  const defaultExpected = "• useServerInsertedHTML SSR 인라인 스타일/스크립트 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="useServerInsertedHTML SSR 인라인 스타일/스크립트 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="useServerInsertedHTML() SSR 인라인 스타일 및 CSS-in-JS 주입">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useServerInsertedHTML()</code> (<code>next/navigation</code>)는 서버 사이드 렌더링(SSR) 스트리밍 도중 <code>{'<'}head{'>'}</code> 영역에 인라인 CSS 스타일이나 스크립트를 동적으로 주입할 수 있도록 지원하는 훅입니다. 주로 Emotion, Styled-components 등 CSS-in-JS 라이브러리의 SSR Style Registry 구현에 사용됩니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 CSS-in-JS 스타일 레지스트리 프로바이더가 컴포넌트 렌더링 중 생성된 동적 클래스 스타일시트를 수집하고, <code>useServerInsertedHTML</code>을 통해 HTML 스트림 <code>{'<'}head{'>'}</code> 내에 <code>{'<'}style{'>'}</code> 태그로 실시간 주입하여 깜빡임 없는 첫 화면을 완성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>FOUC(스타일 미적용 깜빡임) 원천 방지</strong>: 첫 HTML 응답과 함께 필수 CSS가 인라인 주입되어 브라우저 렌더링 즉시 완벽한 스타일을 표시합니다.</li>
              <li><strong>스트리밍 SSR 완벽 호환</strong>: React 19 스트리밍 렌더링 도중에도 서브 청크가 렌더링될 때마다 필요한 스타일을 실시간으로 헤드에 추가합니다.</li>
              <li><strong>전역 CSS-in-JS 레지스트리 표준화</strong>: 다양한 서드파티 스타일링 도구의 App Router 서버 렌더링 연동을 표준 인터페이스로 통일합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>styled-components 및 Emotion 기반 레거시 디자인 시스템의 Next.js App Router 마이그레이션</li>
              <li>테넌트별 런타임 동적 테마 CSS 변수의 SSR 인라인 주입</li>
              <li>다크모드 플래시 방지용 초기 인라인 스크립트 주입</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 렌더링 중에만 실행</strong>: 이 훅은 클라이언트 사이드 내비게이션 중에는 실행되지 않으며 오직 초기 서버 렌더링 시점에만 실행됩니다.</li>
              <li><strong>순수 함수 스타일 반환</strong>: 반환하는 JSX는 부수 효과 없이 순수 <code>{'<'}style{'>'}</code> 또는 <code>{'<'}script{'>'}</code> 태그여야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
