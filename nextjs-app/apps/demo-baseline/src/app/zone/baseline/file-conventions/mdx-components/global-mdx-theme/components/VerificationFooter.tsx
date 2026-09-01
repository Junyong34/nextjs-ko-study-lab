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

  const defaultExpected = "• 글로벌 MDX 스타일 매핑 (mdx-components.tsx)의 동작과 기대 결과를 확인합니다."
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
        title="글로벌 MDX 스타일 매핑 (mdx-components.tsx) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="글로벌 MDX 스타일 매핑 (mdx-components.tsx) 및 컴포넌트 확장">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>mdx-components.tsx</code>는 Next.js 프로젝트 루트에 위치하여 모든 <code>.mdx</code> 파일의 기본 HTML 태그(h1, h2, pre, code, a, table 등)를 Tailwind CSS 디자인 시스템이나 커스텀 React 컴포넌트로 전역 대체 매핑하는 Next.js 표준 파일 컨벤션입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 MDX로 작성된 상품 가이드 문서(<code>guide.mdx</code>)가 렌더링될 때, <code>mdx-components.tsx</code>에서 정의된 인터랙티브 코드 블록(복사 버튼 내장), 콜아웃 경고 박스(Callout), 반응형 테이블 컴포넌트가 자동으로 주입되어 렌더링되는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>일관된 문서 디자인 시스템</strong>: 개별 MDX 파일마다 컴포넌트를 import할 필요 없이 프로젝트 전체 마크다운 문서에 일관된 UI 스타일을 적용합니다.</li>
              <li><strong>인터랙티브 기능 주입</strong>: 정적 마크다운 요소에 클라이언트 인터랙션(코드 복사, 확대 뷰, 탭 전환)을 매끄럽게 결합합니다.</li>
              <li><strong>유지보수성 극대화</strong>: 디자인 시스템 개편 시 <code>mdx-components.tsx</code> 단 하나의 파일만 수정하면 수백 개의 MDX 문서 스타일이 즉시 변경됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>기술 문서 포털 및 개발자 API 가이드 (Interactive Playground 결합)</li>
              <li>이커머스 상품 상세 기술 스펙 및 사용자 매뉴얼 MDX 렌더링</li>
              <li>사내 위키 및 기술 블로그 아티클 시스템</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>useMDXComponents 함수 시그니처 필수</strong>: <code>mdx-components.tsx</code>는 반드시 <code>export function useMDXComponents(components: MDXComponents): MDXComponents</code> 형태로 선언되어야 빌드 타임에 Next.js MDX 컴파일러가 인식합니다.</li>
              <li><strong>next.config.mjs 설정 필요</strong>: <code>@next/mdx</code> 패키지가 설치되고 <code>next.config.mjs</code>에 <code>createMDX</code> 플러그인 래퍼가 설정되어 있어야 정상 동작합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
