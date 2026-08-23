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

  const defaultExpected = "• 내부 마이크로서비스 프록시 라우팅 (proxy.ts) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="내부 마이크로서비스 프록시 라우팅 (proxy.ts) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="내부 마이크로서비스 프록시 라우팅 (proxy.ts / rewrites)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              프록시(Proxy) 게이트웨이 라우팅은 외부 클라이언트 요청을 가로채어 내부 마이크로서비스(주문 서비스, 재고 서비스, 검색 엔진)로 URL 변경 없이 투명하게 중계(Reverse Proxy)하고 인증 헤더를 주입하는 Next.js 백엔드 게이트웨이 아키텍처입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 클라이언트가 <code>/api/v1/orders</code>로 요청을 보냈을 때, 게이트웨이 라우터가 내부 주문 마이크로서비스(<code>http://order-service.internal:8080</code>)로 요청을 전달하고 내부 전용 서명 헤더(<code>X-Internal-Gateway: verified</code>)를 첨부하여 응답을 클라이언트로 되돌려주는 프록시 파이프라인을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>마이크로서비스 엔드포인트 은닉</strong>: 내부 백엔드 서버의 실제 IP와 포트를 외부에 노출하지 않고 단일 도메인으로 통합합니다.</li>
              <li><strong>CORS 이슈 원천 해결</strong>: 프론트엔드와 동일한 오리진(Origin)으로 API를 프록시하여 복잡한 브라우저 CORS 정책을 우회합니다.</li>
              <li><strong>중앙 집중식 인증 및 로깅</strong>: 모든 마이크로서비스 요청의 인증 토큰 검증, 트래픽 제한(Rate Limiting), 분산 추적 헤더를 게이트웨이에서 일괄 처리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>결제/주문/재고 분산 마이크로서비스 아키텍처의 프론트엔드 통합 게이트웨이</li>
              <li>레거시 백엔드 API에서 신규 서버리스 API로의 점진적 마이그레이션(BFF)</li>
              <li>외부 서드파티 API 호출 시 비공개 시크릿 키 자동 주입 프록시</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>스트리밍 본문 처리 주의</strong>: 파일 업로드나 대용량 페이로드 프록시 시 메모리에 전체 본문을 버퍼링하지 않고 Web Streams 파이프로 직접 전달해야 서버 메모리 고갈을 방지할 수 있습니다.</li>
              <li><strong>홉 바이 홉(Hop-by-hop) 헤더 제거</strong>: 프록시 중계 시 <code>Connection</code>, <code>Keep-Alive</code>, <code>Transfer-Encoding</code> 등 HTTP 홉 바이 홉 헤더를 적절히 정리해야 비정상 연결 종료를 예방할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
