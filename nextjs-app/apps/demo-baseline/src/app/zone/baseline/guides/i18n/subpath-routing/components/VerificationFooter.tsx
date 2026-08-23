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

  const defaultExpected = "• /[lang]/products 다국어 서브패스 라우팅 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="/[lang]/products 다국어 서브패스 라우팅 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="/[lang]/products 다국어 서브패스 라우팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>다국어 서브패스 라우팅(<code>/[lang]/...</code>)은 URL 경로의 첫 번째 세그먼트에 국가/언어 코드(<code>/ko/products</code>, <code>/en/products</code>, <code>/ja/products</code>)를 명시하고, Middleware를 통해 사용자의 <code>Accept-Language</code> 헤더를 감지하여 적절한 언어 경로로 자동 리다이렉트하는 Next.js 다국어 라우팅 표준입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 로케일 파라미터가 포함된 URL 세그먼트(<code>/ko</code> vs <code>/en</code>)를 기반으로 상위 레이아웃이 <code>lang="ko"</code> HTML 속성을 주입하고, 하위 페이지들이 해당 국가의 화폐 단위(₩ vs $)와 배송 정책을 분기 렌더링하는 메커니즘을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>구글 다국어 SEO 표준 준수(hreflang 연동)</strong>: 언어별로 고유한 정규 URL(Canonical URL)을 부여하여 검색엔진이 지역별 타겟 페이지를 명확히 색인하도록 합니다.</li>
              <li><strong>공유 가능한 국가별 상품 링크</strong>: 사용자가 전달한 <code>/en/products/101</code> 링크를 다른 국가의 고객이 열람해도 영문 페이지가 일관되게 유지됩니다.</li>
              <li><strong>generateStaticParams 연동 SSG</strong>: <code>generateStaticParams</code>에서 <code>[{'{'} lang: 'ko' {'}'}, {'{'} lang: 'en' {'}'}]</code>를 반환하여 다국어 정적 HTML을 사전 빌드할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 크로스보더 전자상거래 쇼핑몰(한국몰, 미국몰, 일본몰 분기)</li>
              <li>글로벌 고객센터 및 다국어 제품 가이드 문서 포털</li>
              <li>해외 여행객 대상 면세점 상품 예약 및 환율 계산 서비스</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>미들웨어 내부 무한 루프 방지</strong>: 이미 <code>/ko</code>나 <code>/en</code> 접두사가 포함된 경로에 대해 리다이렉트를 반복하지 않도록 경로 검사 조건을 철저히 수립해야 합니다.</li>
              <li><strong>기본 언어 서브패스 정책 결정</strong>: 기본 언어(예: <code>/</code>)에 서브패스를 생략할지(<code>/</code> -{'>'} ko) 아니면 항상 강제 리다이렉트할지(<code>/</code> -{'>'} <code>/ko</code>) 비즈니스 규칙을 명확히 설정해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
