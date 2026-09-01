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

  const defaultExpected = "• @next/third-parties Google Analytics 최적화의 동작과 기대 결과를 확인합니다."
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
        title="@next/third-parties Google Analytics 최적화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="@next/third-parties Google Analytics 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>@next/third-parties/google</code> 패키지의 <code>{'<'}GoogleAnalytics{'>'}</code> 및 <code>{'<'}GoogleTagManager{'>'}</code> 컴포넌트는 구글의 공식 웹 성능 최적화 가이드라인에 따라 스크립트를 지연 로드하고 메인 스레드 부하를 최소화하여 Core Web Vitals 점수를 방어하는 표준 라이브러리입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>{'<'}GoogleAnalytics gaId="G-SAMPLE-1234" /{'>'}</code> 컴포넌트를 로드하여, 상품 조회 및 장바구니 담기 이벤트가 메인 페이지 렌더링을 차단하지 않고 비동기로 Google Analytics 서버로 전송되는 과정을 시각화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>LCP 및 TBT 지표 개선</strong>: 기존 인라인 스크립트 방식 대비 초기 HTML 파싱과 상호작용 지연(TBT)을 대폭 줄여 검색엔진 랭킹 점수를 개선합니다.</li>
              <li><strong>선언적 단일 라인 연동</strong>: 수십 줄의 복잡한 <code>gtag.js</code> 보일러플레이트 코드 없이 단 한 줄의 컴포넌트 선언으로 GA4를 완벽 연동합니다.</li>
              <li><strong>페이지 전환 이벤트 자동 추적</strong>: App Router의 소프트 네비게이션(SPA 페이지 이동) 시에도 페이지뷰(pageview) 이벤트를 정확하게 자동 계측합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 마케팅 전환 추적(광고 유입 출처, 장바구니 담기, 결제 완료)</li>
              <li>사용자 체류 시간, 이탈률 및 카테고리별 상품 탐색 경로 분석</li>
              <li>프로모션 기획전 배너 클릭률(CTR) 및 A/B 테스트 지표 측정</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Root Layout 최상단 배치</strong>: 모든 하위 라우트에서 누락 없이 사용자 이벤트를 추적하려면 반드시 <code>app/layout.tsx</code>의 <code>{'<'}body{'>'}</code> 태그 내부에 배치해야 합니다.</li>
              <li><strong>커스텀 이벤트 전송 시 window 체크</strong>: 클라이언트 컴포넌트에서 <code>sendGAEvent</code> 함수를 호출할 때는 스크립트 로드 전 호출로 인한 오류를 방지하도록 안전하게 호출해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
