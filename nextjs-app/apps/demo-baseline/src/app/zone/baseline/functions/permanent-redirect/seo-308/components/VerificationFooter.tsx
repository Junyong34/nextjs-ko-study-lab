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

  const defaultExpected = "• permanentRedirect() 영구 URL 변경 (308 Permanent)의 동작과 기대 결과를 확인합니다."
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
        title="permanentRedirect() 영구 URL 변경 (308 Permanent) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="permanentRedirect() HTTP 308 영구 SEO 리다이렉트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>permanentRedirect()</code> (<code>next/navigation</code>)는 요청 메서드를 보존하면서 영구적인 URL 변경을 선언하는 HTTP 308 Permanent Redirect를 수행합니다. 검색엔진 크롤러에게 자원의 주소가 영구 변경되었음을 알려 이전 URL의 SEO 자산(PageRank)을 신규 URL로 100% 승계시킵니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 구형 카테고리 URL(<code>/categories/pc-parts</code>) 접근 시 <code>permanentRedirect('/shop/electronics/pc')</code>를 호출하여, 브라우저와 검색엔진 크롤러가 신규 표준 경로를 영구 캐싱하도록 유도합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>검색엔진 최적화(SEO) 랭킹 보존</strong>: 구 URL에 축적된 백링크 점수와 오가닉 검색 랭킹을 손실 없이 신규 URL로 이전합니다.</li>
              <li><strong>브라우저 영구 캐싱</strong>: 브라우저가 308 응답을 자체 캐싱하여 다음 방문부터는 서버 요청 없이 즉시 대상 URL로 접속합니다.</li>
              <li><strong>HTTP 301 대비 메서드 보존</strong>: 레거시 301과 달리 POST/GET 메서드를 엄격히 보존하여 API 엔드포인트 마이그레이션에도 안전합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>도메인 개편 또는 쇼핑몰 전체 카테고리 URL 체계 영구 통합</li>
              <li>단종 상품의 후속 신제품 공식 페이지로의 영구 리다이렉트</li>
              <li>소문자/대문자 정규화 및 캐노니컬 URL 표준화</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>강력한 브라우저 캐싱 주의</strong>: 308은 브라우저에 강력하게 영구 캐싱되므로, 잘못된 목적지로 설정 시 사용자 브라우저에서 캐시를 지우기 전까지 되돌리기 어렵습니다. 신중히 검증 후 배포해야 합니다.</li>
              <li><strong>try/catch 래핑 금지</strong>: 동일하게 내부 예외를 throw하므로 <code>try/catch</code> 블록 외부에서 호출해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
