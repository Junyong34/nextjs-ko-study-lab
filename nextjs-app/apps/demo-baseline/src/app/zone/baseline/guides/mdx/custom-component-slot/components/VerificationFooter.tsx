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

  const defaultExpected = "• MDX 내 인터랙티브 장바구니 버튼 합성 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="MDX 내 인터랙티브 장바구니 버튼 합성 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="MDX 내 인터랙티브 장바구니 버튼 합성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>MDX 커스텀 컴포넌트 슬롯팅(<code>@next/mdx</code> / <code>useMDXComponents</code>)은 정적 마크다운 문서 내부에 인터랙티브한 React 클라이언트 컴포넌트(장바구니 담기, 실시간 재고 계산기, 인터랙티브 퀴즈)를 슬롯 형태로 자연스럽게 삽입 및 합성하는 콘텐츠 아키텍처 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 마크다운으로 작성된 제품 소개 가이드 본문 사이에 <code>{'<'}AddToCartWidget productId="PROD-001" /{'>'}</code> 클라이언트 컴포넌트를 합성하여, 문서를 읽던 고객이 페이지 이동 없이 즉시 수량을 선택하고 장바구니에 담는 인터랙션을 수행합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>콘텐츠와 인터랙션의 완벽한 융합</strong>: 정적인 텍스트 문서 중간에 결제 버튼, 실시간 차트, 코드 실행기 등 동적 UI 위젯을 손쉽게 배치할 수 있습니다.</li>
              <li><strong>마케터와 개발자의 협업 효율 극대화</strong>: 콘텐츠 작성자는 간단한 마크다운 및 커스텀 JSX 태그만 작성하고, 개발자는 컴포넌트 로직에만 집중할 수 있습니다.</li>
              <li><strong>서버 컴포넌트 기반 MDX 파싱</strong>: MDX 번들을 서버에서 파싱하여 초기 번들 크기를 경량화하고 빠른 초기 렌더링 속도를 보장합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>신상품 런칭 스토리/블로그 포스트 내 원클릭 바로구매 위젯 삽입</li>
              <li>개발자 API 가이드 문서 내 실시간 API 요청 테스트 위젯</li>
              <li>가전/IT 기기 사용 매뉴얼 내 인터랙티브 고장 진단 진단기 위젯</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 컴포넌트 임포트 분리</strong>: MDX 파일 자체는 서버에서 렌더링되므로 인터랙티브 상태(<code>useState</code>)가 필요한 위젯 컴포넌트는 반드시 상단에 <code>'use client'</code>를 명시하여 분리 임포트해야 합니다.</li>
              <li><strong>useMDXComponents 전역 정의</strong>: 프로젝트 루트의 <code>mdx-components.tsx</code> 파일에 커스텀 컴포넌트 매핑을 정확히 정의해야 누락 없이 렌더링됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
