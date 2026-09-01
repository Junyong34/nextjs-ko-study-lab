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

  const defaultExpected = "• Google Fonts 가변 폰트 CSS 변수 연동의 동작과 기대 결과를 확인합니다."
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
        title="Google Fonts 가변 폰트 CSS 변수 연동 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="next/font/google 가변 폰트(Variable Font) & CSS 변수 토큰">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/font/google</code>은 구글 폰트를 빌드 시점에 자동 다운로드하여 자체 호스팅(Zero Layout Shift, No External Network Request)하고, <code>variable: '--font-name'</code> 옵션을 통해 Tailwind CSS 및 CSS 변수 토큰으로 바인딩하는 Next.js 공식 폰트 최적화 컴포넌트입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>Geist</code> 및 <code>Geist_Mono</code> 가변 폰트의 <code>variable</code> 속성이 최상위 <code>{'<'}body{'>'}</code>의 className에 주입되어, 하위 모든 컴포넌트에서 <code>font-sans</code> 또는 <code>var(--font-geist-sans)</code>로 가변 웨이트(100~900)를 깜빡임(FOUT/FOIT) 없이 완벽히 소비하는 동작을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>누적 레이아웃 이동(CLS) 0 달성</strong>: 폰트 로딩 시점의 크기 불일치로 인한 텍스트 흔들림(Layout Shift)을 자동 크기 조정(size-adjust)으로 완전 제거합니다.</li>
              <li><strong>개인정보 보호 및 네트워크 절약</strong>: 브라우저가 Google 서버로 폰트 요청을 보내지 않아 GDPR을 준수하고 외부 DNS 룩업 지연을 없앱니다.</li>
              <li><strong>Tailwind CSS 토큰 완벽 연동</strong>: CSS 변수를 <code>tailwind.config</code>의 <code>fontFamily</code>에 직접 매핑하여 유연한 유틸리티 클래스를 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 전역 본문(Sans) 및 영문 가격/수량(Mono) 타이포그래피 토큰 시스템</li>
              <li>가변 웨이트(100~900) 단일 파일 서빙을 통한 폰트 파일 용량 다이어트</li>
              <li>다국어 지원을 위한 서브셋(<code>subsets: ['latin']</code>) 최적화 로딩</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>모듈 최상위 스코프 선언 필수</strong>: <code>next/font</code> 인스턴스는 반드시 컴포넌트 함수 외부(모듈 최상위)에서 선언해야 컴파일 타임 폰트 추출이 정상 작동합니다.</li>
              <li><strong>display: 'swap' 권장</strong>: 폰트 로드 지연 시 시스템 폰트로 즉시 텍스트를 먼저 표시하도록 <code>display: 'swap'</code>을 기본 지정하는 것이 좋습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
