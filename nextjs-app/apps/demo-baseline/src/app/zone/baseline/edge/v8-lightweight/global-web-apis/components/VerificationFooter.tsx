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

  const defaultExpected = "• Edge Runtime V8 Web API 실행의 동작과 기대 결과를 확인합니다."
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
        title="Edge Runtime V8 Web API 실행 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="Edge Runtime 내 표준 Web APIs 지원 & 초저지연 V8 글로벌 엣지 실행">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>export const runtime = 'edge'</code> 설정은 전 세계 CDN 엣지 노드의 초경량 V8 Isolate 위에서 실행되며, Web 표준 API(<code>fetch</code>, <code>Request</code>, <code>Response</code>, <code>Headers</code>, <code>URL</code>, <code>crypto.subtle</code>, <code>ReadableStream</code>, <code>TextEncoder</code>)를 네이티브 지원하여 콜드 스타트 0ms의 초저지연 연산을 제공합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 글로벌 환율 계산 및 암호화 서명 검증을 위해 Web Crypto API(<code>crypto.subtle.digest</code>)와 <code>TransformStream</code>을 활용하여, Node.js 모듈 없이 순수 Web APIs만으로 엣지 환경에서 수 밀리초 만에 계산 결과를 스트리밍 반환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>0ms 콜드 스타트</strong>: 무거운 Node.js 런타임 초기화 과정 없이 V8 엔진에서 즉각 실행되어 글로벌 사용자에게 일관된 초고속 응답을 제공합니다.</li>
              <li><strong>웹 표준 100% 호환</strong>: 브라우저, Cloudflare Workers, Deno 등과 동일한 Web 표준 API를 사용하여 코드 이식성이 뛰어납니다.</li>
              <li><strong>인프라 비용 극대화 절감</strong>: 인스턴스당 메모리 점유율이 수 MB에 불과하여 대규모 동시 접속 트래픽을 저비용으로 처리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 다국어/통화 변환 및 실시간 환율 계산기</li>
              <li>엣지 미들웨어에서의 Web Crypto 기반 JWT 인증 토큰 초고속 유효성 검증</li>
              <li>A/B 테스트 쿠키 파싱 및 지리적 위치(Geo-IP) 기반 엣지 라우팅</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Node.js 전용 API 사용 불가</strong>: <code>fs</code>, <code>net</code>, <code>path</code>, <code>child_process</code> 등 Node.js 내장 모듈이나 네이티브 C++ 바인딩(<code>bcrypt</code>, <code>sharp</code>)은 사용 시 빌드 에러가 발생하므로 반드시 Web 표준 대체 라이브러리(<code>jose</code>, <code>bcrypt-ts</code>)를 채택해야 합니다.</li>
              <li><strong>CPU 실행 시간 제약</strong>: 서버리스 엣지 함수는 플랫폼별로 최대 CPU 실행 시간 제한(보통 10ms~50ms)이 있으므로 대용량 파일 처리나 무거운 연산은 Node.js 런타임으로 분리해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
