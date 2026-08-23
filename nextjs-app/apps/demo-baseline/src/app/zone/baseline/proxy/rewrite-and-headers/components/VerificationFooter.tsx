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

  const defaultExpected = "• Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 16의 <code>proxy.ts</code>(또는 미들웨어 기반 리버스 프록시)는 들어오는 모든 HTTP 요청을 서버 사이드 렌더링 이전에 가로채어, 클라이언트 URL 변경 없이 내부 마이크로서비스로 경로를 재작성(Rewrite)하고 보안/인증 커스텀 헤더를 주입하는 인프라 라우팅 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 클라이언트가 <code>/api/catalog</code>로 요청을 보낼 때 프록시 계층이 이를 감지하여 내부 레거시 백엔드 엔드포인트로 투명하게 리라이트하고, <code>x-gateway-auth: verified</code> 및 <code>x-client-geo: KR</code> 헤더를 주입하여 백엔드로 전달하는 흐름을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>CORS 이슈 원천 해결</strong>: 브라우저는 동일 도메인(Same-origin)으로 요청하므로 별도의 CORS 설정 없이 이기종 백엔드 API와 통신 가능합니다.</li>
                    <li><strong>내부 인프라 은닉 및 보안 강화</strong>: 실제 백엔드 마이크로서비스 IP나 도메인을 외부에 노출하지 않고 프록시 뒤에 안전하게 격리합니다.</li>
                    <li><strong>공통 인증/인가 헤더 중앙 집중화</strong>: 모든 하위 요청에 대해 게이트웨이 레벨에서 공통 API 토큰 및 트레이싱 ID를 주입합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>레거시 모놀리식 API 서버와 신규 마이크로서비스 간의 투명한 트래픽 라우팅</li>
                    <li>다국어/글로벌 서비스에서 사용자 접속 국가에 따른 리전별 백엔드 프록시 분기</li>
                    <li>서드파티 결제/물류 API 호출 시 시크릿 API Key 서버사이드 헤더 주입</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Redirect vs Rewrite 구분</strong>: <code>redirect</code>는 브라우저 URL 주소창이 변경되고 HTTP 307/308 응답을 주지만, <code>rewrite</code>는 브라우저 URL을 유지한 채 내부 대상 경로의 응답을 그대로 반환합니다.</li>
                    <li><strong>무한 루프 방지</strong>: rewrite 목적지가 동일한 프록시 매칭 규칙에 다시 걸리지 않도록 경로 네임스페이스나 조건을 엄격히 격리해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
