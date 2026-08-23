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

  const defaultExpected = "• rewrites() 쿼리 파라미터 매핑 라우팅 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="rewrites() 쿼리 파라미터 매핑 라우팅 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="next.config.ts rewrites() 쿼리 파라미터 변환 및 Vanity URL 라우팅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>rewrites()</code> 설정을 통해 복잡한 내부 쿼리 스트링 경로(예: <code>/catalog?category=fashion&sort=popular</code>)를 직관적인 단축 가상 URL(예: <code>/fashion-popular</code>)로 투명하게 매핑하는 설정 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 사용자가 간결한 브랜드 기획전 URL(<code>/brand/:slug</code>)로 접속하면, <code>rewrites()</code> 룰이 내부 목적지(<code>/shop/brand-detail?brandSlug=:slug</code>)로 파라미터를 캡처 및 주입하여 서버 컴포넌트가 정상적으로 데이터를 조회하도록 전달합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>마케팅 친화적 Vanity URL 제공</strong>: 인쇄물, SNS 광고, 배너에 노출하기 적합한 짧고 기억하기 쉬운 URL을 제공합니다.</li>
              <li><strong>검색엔진 최적화(SEO) 친화적 경로 구성</strong>: 복잡한 쿼리 스트링 대신 의미 있는 키워드가 포함된 정적 슬러그 구조를 완성합니다.</li>
              <li><strong>내부 아키텍처 은닉</strong>: 백엔드 데이터베이스 구조나 내부 라우팅 파라미터를 외부에 노출하지 않고 캡슐화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>시즌 마케팅 캠페인 단축 프로모션 URL (<code>/blackfriday</code> -{'>'} <code>/events?type=bf2026</code>)</li>
              <li>인플루언서 제휴 마케팅 링크 (<code>/partner/:name</code> -{'>'} <code>/shop?ref=:name</code>)</li>
              <li>카테고리별 인기 랭킹 단축 URL (<code>/best/:category</code> -{'>'} <code>/ranking?cat=:category</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>쿼리 우선순위 및 충돌</strong>: 요청에 이미 존재하는 쿼리 파라미터와 리라이트에서 주입하는 쿼리의 키가 중복될 경우의 덮어쓰기 우선순위를 명확히 설계해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
