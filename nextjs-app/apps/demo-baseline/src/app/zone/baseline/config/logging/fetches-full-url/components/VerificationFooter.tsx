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

  const defaultExpected = "• logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅의 동작과 기대 결과를 확인합니다."
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
        title="logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="next.config.ts logging.fetches 개발 서버 fetch 요청 전체 URL 및 캐시 로그 출력">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>logging.fetches: {'{'} fullUrl: true {'}'}</code> (<code>next.config.ts</code>) 설정은 로컬 개발 환경 터미널에 서버 컴포넌트나 Route Handler에서 발생하는 모든 <code>fetch()</code> 요청의 전체 URL, HTTP 메서드, 응답 상태 코드, 데이터 캐시 히트 여부(<code>HIT</code>, <code>MISS</code>, <code>SKIP</code>)를 상세 출력하도록 활성화하는 개발자 경험(DX) 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 컴포넌트가 외부 상품 API를 호출할 때 터미널 콘솔에 <code>GET https://api.shop.com/v1/products/101 200 in 42ms (cache: HIT)</code>와 같이 전체 경로와 캐시 적중 상태가 실시간 로깅되는 흐름을 확인합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>캐시 동작 직관적 디버깅</strong>: 해당 fetch 요청이 Next.js 데이터 캐시에서 히트되었는지(HIT), 새로 가져왔는지(MISS), 우회되었는지(SKIP) 한눈에 파악합니다.</li>
              <li><strong>네트워크 병목 및 Waterfall 탐지</strong>: 불필요하게 직렬로 호출되는 외부 API의 호출 시간과 중복 요청을 손쉽게 식별합니다.</li>
              <li><strong>개발 생산성(DX) 극대화</strong>: 별도의 <code>console.log</code> 디버깅 코드 삽입 없이 터미널에서 전체 서버 통신을 모니터링합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>복잡한 Server Component 트리 내부의 데이터 패칭 캐시 적중률 검증</li>
              <li>시간 기반 ISR(<code>revalidate: 60</code>) 만료 후 백그라운드 revalidation 동작 추적</li>
              <li>태그 무효화(<code>revalidateTag</code>) 후 캐시 미스 발생 여부 확인</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>개발 모드 전용</strong>: 이 로그 설정은 개발(development) 모드에서만 터미널에 출력되며 프로덕션 빌드에는 성능 영향을 주지 않습니다.</li>
              <li><strong>hmrRefreshes 옵션 연계</strong>: <code>logging.incomingRequests</code> 등 다른 로깅 옵션과 조합하여 HMR 및 들어오는 요청까지 종합 디버깅할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
