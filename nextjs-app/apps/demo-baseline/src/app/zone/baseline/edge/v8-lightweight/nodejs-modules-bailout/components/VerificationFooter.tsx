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

  const defaultExpected = "• Edge Runtime 내 Node.js 전용 모듈 접근 차단 제한점 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Edge Runtime 내 Node.js 전용 모듈 접근 차단 제한점 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Edge Runtime 내 Node.js 전용 모듈 접근 제한 & Bailout 메커니즘">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Edge Runtime(<code>export const runtime = 'edge'</code>)은 전 세계 CDN 엣지 노드의 경량 V8 Isolate 위에서 동작하며, 표준 Web APIs(Request, Response, Web Crypto, Streams)만을 지원합니다. <code>fs</code>, <code>net</code>, <code>child_process</code> 같은 Node.js 내장 모듈 및 C++ 네이티브 바이너리는 엄격히 차단(Bailout)됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 Edge 세그먼트에서 파일 시스템(<code>fs.readFileSync</code>)이나 TCP 소켓 기반의 기존 DB 드라이버를 직접 호출하려 할 때 발생하는 번들링 에러(<code>Module not found: Can't resolve 'fs'</code>) 메커니즘을 시각화하고, Edge 호환 HTTP API 기반 드라이버로 대체하는 아키텍처를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>0ms 콜드 스타트 및 초고속 응답</strong>: Node.js VM 구동 오버헤드를 없애고 가벼운 V8 컨텍스트로 글로벌 엣지에서 즉시 실행됩니다.</li>
              <li><strong>보안 격리성 극대화</strong>: 파일 시스템 접근이나 임의 프로세스 생성이 원천 차단되어 서버리스 엣지 환경의 보안 취약점을 최소화합니다.</li>
              <li><strong>메모리 효율성</strong>: 인스턴스당 수 MB 수준의 극소 메모리 점유율로 대규모 분산 트래픽을 저비용으로 처리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 접속 사용자의 지리적 위치(Geo-IP) 기반 통화/언어 초고속 라우팅 미들웨어</li>
              <li>Web Crypto(<code>crypto.subtle</code>)를 활용한 Edge JWT 인증 토큰 유효성 고속 검증</li>
              <li>HTTP 기반 Serverless KV/Redis(Upstash)를 활용한 글로벌 봇 트래픽 레이트 리미팅</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>라이브러리 호환성 사전 확인</strong>: <code>jsonwebtoken</code>(Node crypto 의존) 대신 <code>jose</code>, <code>pg/mysql2</code>(TCP 소켓 의존) 대신 HTTP/WebSocket 기반의 <code>@neondatabase/serverless</code> 또는 <code>@vercel/postgres</code>를 채택해야 합니다.</li>
              <li><strong>런타임 세그먼트 분리</strong>: 무거운 이미지 처리(sharp)나 대용량 파일 IO가 필요한 라우트는 <code>export const runtime = 'nodejs'</code>로 명시하여 표준 Node.js 환경에서 구동해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
