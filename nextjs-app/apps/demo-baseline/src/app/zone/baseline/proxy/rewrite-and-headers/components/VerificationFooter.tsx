'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface ProxyProbeResponse {
  status: number
  action: 'rewrite' | 'redirect'
  rewrittenPath: string
  redirectUrl: string | null
  headers: {
    'x-proxy-gateway': string
    'x-ab-variant': string
    'x-forwarded-country': string
    'x-user-authenticated': string
    'x-proxy-rewritten-path': string
  }
  timestamp: string
}

export interface VerificationFooterProps {
  probeResult?: ProxyProbeResponse | null
  selectedVariant?: string
  selectedCountry?: string
  isAuthenticated?: boolean
  hasInteracted?: boolean
}

export function VerificationFooter({
  probeResult = null,
  selectedVariant = 'control',
  selectedCountry = 'KR',
  isAuthenticated = true,
  hasInteracted = false,
}: VerificationFooterProps) {
  const isMatched =
    hasInteracted && probeResult !== null
      ? true
      : undefined

  const expected =
    `• proxy.ts 가로채기를 통해 x-proxy-gateway: Active, x-ab-variant: ${selectedVariant}, x-forwarded-country: ${selectedCountry} 헤더 주입\n• ` +
    (isAuthenticated
      ? `A/B 분기 리라이트 (/landing/${selectedVariant === 'variant_b' ? 'experiment-b' : 'control'}) 200 OK 수신`
      : '미인증 요청 감지 및 307 리다이렉트 처리')

  const actual =
    !hasInteracted || probeResult === null
      ? '• 프록시 요청 대기 중 (옵션 설정 후 [프록시 파이프라인 실행] 버튼을 클릭하세요)'
      : `• 수신 헤더: x-proxy-gateway: "${probeResult.headers['x-proxy-gateway']}", x-ab-variant: "${probeResult.headers['x-ab-variant']}", x-forwarded-country: "${probeResult.headers['x-forwarded-country']}"\n• ` +
        (probeResult.action === 'rewrite'
          ? `프록시 리라이트 목적지: ${probeResult.rewrittenPath} (HTTP ${probeResult.status} OK)`
          : `인증 실패 리다이렉트: ${probeResult.redirectUrl} (HTTP ${probeResult.status} Redirect)`)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입 실증 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Next.js 16 proxy.ts 파이프라인이 렌더링 전 요청을 가로채어 헤더 주입 및 rewrite 분기를 수행하는 과정을 실증 검증합니다."
      />
      <DemoDeepDiveCard title="Next.js 16 proxy.ts 요청 가로채기 및 rewrite/헤더 주입">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js 16의 <code>proxy.ts</code>는 들어오는 모든 HTTP 요청을 서버 사이드 렌더링 이전에 가로채어, 클라이언트 URL 변경 없이 내부 마이크로서비스나 A/B 세그먼트로 경로를 재작성(Rewrite)하고 보안/인증 커스텀 헤더를 주입하는 인프라 라우팅 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 클라이언트가 요청을 보낼 때 <code>src/proxy.ts</code>가 <code>NextResponse.next({'{'} request: {'{'} headers {'}'} {'}'})</code>를 통해 <code>x-proxy-gateway: Active</code>, <code>x-ab-variant</code>, <code>x-forwarded-country</code> 헤더를 주입하고 대상 경로(<code>/landing/...</code>)로 리라이트하는 전체 파이프라인을 실시간 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>CORS 이슈 원천 해결</strong>: 동일 도메인 요청으로 취급되어 복잡한 CORS 헤더 설정 없이 백엔드 API와 통신 가능합니다.</li>
              <li><strong>내부 인프라 은닉 및 보안 강화</strong>: 백엔드 마이크로서비스 내부 주소를 노출하지 않고 프록시 뒤에 격리합니다.</li>
              <li><strong>중앙 집중식 A/B 테스트 라우팅</strong>: 엣지/서버 진입점에서 사용자 쿠키/헤더를 검사하여 깜빡임 없는 리라이트 분기를 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>A/B 테스트 시 URL 변경 없는 투명한 랜딩 페이지 분기 렌더링</li>
              <li>GeoIP 국가 헤더에 따른 리전별 서비스 라우팅 및 다국어 분기</li>
              <li>API 게이트웨이 레벨에서의 인증 토큰 유효성 검사 및 307 리다이렉트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Redirect vs Rewrite 구분</strong>: <code>redirect</code>는 브라우저 주소창이 변경되는 307/308 이동이며, <code>rewrite</code>는 브라우저 URL을 유지한 채 내부 목적지 콘텐츠를 반환합니다.</li>
              <li><strong>Matcher 경로 격리</strong>: 무한 루프를 방지하기 위해 프록시 대상 경로와 정적 에셋(_next/static)을 matcher 설정에서 명확히 분리해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
