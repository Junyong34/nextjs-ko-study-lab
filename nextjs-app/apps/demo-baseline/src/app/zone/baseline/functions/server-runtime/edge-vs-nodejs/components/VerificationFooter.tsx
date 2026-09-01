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

  const defaultExpected = "• Server Component runtime 분기 제어의 동작과 기대 결과를 확인합니다."
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
        title="Server Component runtime 분기 제어 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="server-runtime 설정 (Edge vs Node.js 런타임 분기)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>export const runtime = 'nodejs' | 'edge'</code>는 해당 라우트 세그먼트가 실행될 런타임 환경을 지정하는 Route Segment Config 옵션입니다. Node.js의 방대한 생태계(TCP/fs/네이티브)와 Edge의 초저지연 V8 Isolate(0ms 콜드 스타트) 간의 트레이드오프를 결정합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 글로벌 Geo-IP 및 JWT 검증용 라우트는 <code>runtime = 'edge'</code>로, 대용량 PDF 생성 및 레거시 DB 연결 라우트는 <code>runtime = 'nodejs'</code>로 각각 배포하여 실행 런타임별 특성과 제약을 비교 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>워크로드별 최적화 배포</strong>: 가벼운 프록시/인증은 글로벌 엣지로, 무거운 연산은 Node.js 서버리스로 세분화하여 효율을 극대화합니다.</li>
              <li><strong>글로벌 TTFB 단축</strong>: 엣지 런타임 채택 시 사용자 물리적 위치와 가장 가까운 CDN 노드에서 0ms 콜드 스타트로 응답합니다.</li>
              <li><strong>비용 절감</strong>: 엣지 리소스의 극소 메모리 점유율을 통해 인프라 운영 비용을 절감합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>사용자 인증 토큰 검증 및 미들웨어 라우팅 (<code>runtime = 'edge'</code>)</li>
              <li>지리적 위치(Geo-IP) 기반 통화/언어 즉시 분기 (<code>runtime = 'edge'</code>)</li>
              <li>Sharp 이미지 리사이징, PDF 생성, PostgreSQL 직결 쿼리 (<code>runtime = 'nodejs'</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Edge 런타임 내 Node.js 모듈 차단</strong>: <code>runtime = 'edge'</code>에서는 <code>fs</code>, <code>net</code>, <code>crypto</code>(Node) 등 내장 모듈 사용 시 빌드 에러가 발생하므로 Web 표준 대체재(<code>jose</code>, <code>@neondatabase/serverless</code>)를 사용해야 합니다.</li>
              <li><strong>기본값은 nodejs</strong>: 별도 지정이 없으면 Next.js의 기본 런타임은 <code>nodejs</code>입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
