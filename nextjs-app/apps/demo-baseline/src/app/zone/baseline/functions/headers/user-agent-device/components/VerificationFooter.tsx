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

  const defaultExpected = "• headers().get('user-agent') 기기 식별 및 최적화의 동작과 기대 결과를 확인합니다."
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
        title="headers().get('user-agent') 기기 식별 및 최적화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="headers() 디바이스 및 브라우저 파싱 레이아웃 분기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>headers()</code> (<code>next/headers</code>)는 HTTP 요청 헤더를 비동기 조회하는 표준 함수입니다. <code>user-agent</code> 헤더 등을 분석하여 서버 사이드 렌더링(SSR) 단계에서 디바이스(모바일/태블릿/데스크톱)에 최적화된 마크업을 사전 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버에서 <code>await headers()</code>를 호출하여 <code>User-Agent</code> 및 <code>Sec-CH-UA-Mobile</code> 헤더를 파싱하고, 클라이언트가 모바일인지 데스크톱인지 판별하여 디바이스 맞춤 레이아웃과 데이터 뷰를 사전 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Zero CLS 디바이스 최적화</strong>: 클라이언트 JS 하이드레이션 후 화면이 번쩍이며 모바일 UI로 전환되는 레이아웃 이동(CLS)을 원천 방지합니다.</li>
              <li><strong>서버사이드 User-Agent 파싱</strong>: 클라이언트 번들에 무거운 디바이스 판별 라이브러리를 포함하지 않아 번들 크기를 최적화합니다.</li>
              <li><strong>웹 표준 ReadonlyHeaders 인터페이스</strong>: 표준 <code>get()</code>, <code>has()</code>, <code>forEach()</code> 인터페이스를 제공하여 사용이 직관적입니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일/데스크톱 뷰포트별 적응형 GNB 메뉴 및 사이드바 렌더링</li>
              <li>봇/크롤러(Googlebot, NaverBot) 감지 시 맞춤형 SEO 콘텐츠 사전 렌더링</li>
              <li>글로벌 사용자의 <code>Accept-Language</code> 헤더 기반 기본 언어 감지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동적 렌더링(Dynamic Rendering) 전환</strong>: <code>headers()</code> 호출은 요청 시점에만 값을 알 수 있으므로 해당 라우트를 정적(SSG)에서 동적(Dynamic) 렌더링으로 자동 전환시킵니다.</li>
              <li><strong>Next.js 15+ 비동기 호출</strong>: Next.js 15부터 <code>headers()</code>는 Promise를 반환하므로 반드시 <code>await headers()</code> 또는 React 19 <code>use(headers())</code>로 언래핑해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
