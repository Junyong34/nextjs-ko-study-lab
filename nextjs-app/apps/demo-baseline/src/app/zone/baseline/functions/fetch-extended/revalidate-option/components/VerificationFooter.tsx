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

  const defaultExpected = "• Next.js 확장 fetch revalidate 옵션의 동작과 기대 결과를 확인합니다."
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
        title="Next.js 확장 fetch revalidate 옵션 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="Next.js 확장 fetch revalidate 옵션 & 시간 기반 ISR 캐싱">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js는 Web 표준 <code>fetch</code> API를 확장하여 <code>fetch(url, {'{'} next: {'{'} revalidate: 60 {'}'} {'}'})</code> 옵션을 제공합니다. 지정된 시간(초) 동안 데이터 소스 응답을 데이터 캐시(Data Cache)에 보관하고, 만료 후 Stale-While-Revalidate 방식으로 백그라운드 갱신을 수행합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 외부 환율 API를 60초 <code>revalidate</code> 옵션으로 호출하여, 60초 이내의 요청에는 0ms 캐시 응답을 반환하고, 60초 초과 시 다음 요청에서 백그라운드 revalidation을 트리거하여 최신 환율로 캐시를 갱신합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>백엔드 API 트래픽 99% 절감</strong>: 초당 수천 건의 트래픽이 몰려도 외부 API는 60초에 단 1회만 호출하여 부하를 차단합니다.</li>
              <li><strong>안정적인 고속 응답(TTFB)</strong>: 캐시된 응답을 즉시 서빙하여 외부 API의 레이턴시나 일시적 장애가 사용자에게 영향을 주지 않습니다.</li>
              <li><strong>선언적 캐시 수명 관리</strong>: 별도 Redis나 캐시 서버 없이 <code>fetch</code> 옵션만으로 세분화된 수명 주기를 제어합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>실시간성이 약간 허용되는 환율, 날씨, 인기 검색어 순위 데이터 조회</li>
              <li>상품 상세 페이지의 기본 스펙 및 카테고리 트리 캐싱 (예: <code>revalidate: 3600</code>)</li>
              <li>외부 뉴스 피드 및 블로그 포스트 목록 캐싱</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Next.js 15+ 기본값 변경</strong>: Next.js 15부터 <code>fetch</code>의 기본 동작이 <code>force-cache</code>에서 <code>no-store</code>(비캐시)로 변경되었으므로 캐싱을 원하면 명시적으로 <code>revalidate</code> 또는 <code>force-cache</code>를 선언해야 합니다.</li>
              <li><strong>cacheLife로의 발전</strong>: Next.js 16에서는 보다 정밀한 제어를 위해 <code>'use cache'</code> 지시어 및 <code>cacheLife()</code> 함수 사용이 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
