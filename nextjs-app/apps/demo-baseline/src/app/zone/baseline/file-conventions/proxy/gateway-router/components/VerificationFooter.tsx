'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { GATEWAY_ROUTES, GatewayProbeResult } from '../types'

export interface VerificationFooterProps {
  latest: GatewayProbeResult | null
}

/**
 * 최근 게이트웨이 요청 1건의 기대값(라우팅 테이블 기준)과 실제 응답 헤더를 대조한다.
 * ExpectedActualPanel의 isMatched={undefined} + 문자열 자동비교 버그를 피하기 위해,
 * "대기" / "일치" / "불일치" 세 상태를 조건부 JSX로 분리해 렌더링한다 — 대기 상태에서는
 * actual을 문자열이 아닌 JSX 노드로 전달해 내부 자동 문자열 비교를 트리거하지 않는다.
 */
export function VerificationFooter({ latest }: VerificationFooterProps) {
  const expectedRoute = latest ? GATEWAY_ROUTES.find((r) => r.prefix === latest.prefix) : undefined
  const isUnroutedCase = latest ? !expectedRoute : false
  const expectedService = latest ? (isUnroutedCase ? 'unrouted' : expectedRoute?.service ?? null) : null
  const expectedStatus = latest ? (isUnroutedCase ? 404 : 200) : null

  const expectedText = latest
    ? `x-gateway-target-service: "${expectedService}"\nHTTP status: ${expectedStatus}\n(경로 /api/${latest.prefix} → ${
        isUnroutedCase ? '라우팅 테이블에 없음 → 통과 후 자연 404' : `services/${expectedService}`
      })`
    : `라우팅 테이블 (proxy.ts GATEWAY_SERVICE_TABLE):\n${GATEWAY_ROUTES.map(
        (r) => `/api/${r.prefix} → ${r.service} (:${r.port})`
      ).join('\n')}\n/api/legacy-billing → (미매핑) → 404`

  const actualText = latest
    ? `x-gateway-target-service: "${latest.targetService}"\nHTTP status: ${latest.status}\nx-gateway-request-id: ${
        latest.requestId ?? 'null'
      }`
    : null

  const isMatched = latest ? latest.targetService === expectedService && latest.status === expectedStatus : undefined

  return (
    <div className="space-y-4">
      {latest === null && (
        <ExpectedActualPanel
          title="게이트웨이 라우팅 검증"
          expected={expectedText}
          actual={<span className="text-zinc-400">대기 중 — 위 버튼으로 요청을 실행해 주세요.</span>}
          description="선택한 경로 접두사에 따라 proxy.ts가 어떤 내부 서비스로 rewrite하는지 검증합니다."
        />
      )}
      {latest !== null && isMatched === true && (
        <ExpectedActualPanel
          title="게이트웨이 라우팅 검증"
          expected={expectedText}
          actual={actualText}
          isMatched={true}
          description={
            isUnroutedCase
              ? 'proxy.ts가 라우팅 테이블에 없는 접두사를 임의로 가로채지 않고 그대로 통과시켜, Next.js 라우터가 자연스러운 404를 반환했습니다.'
              : 'proxy.ts가 경로 접두사를 실제로 판독해 기대한 내부 서비스로 rewrite했습니다.'
          }
        />
      )}
      {latest !== null && isMatched === false && (
        <ExpectedActualPanel
          title="게이트웨이 라우팅 검증"
          expected={expectedText}
          actual={actualText}
          isMatched={false}
          description="기대한 라우팅 결과와 실제 응답이 다릅니다. proxy.ts의 매칭 조건을 다시 확인하세요."
        />
      )}

      <DemoDeepDiveCard title="게이트웨이 라우팅 (proxy.ts + NextResponse.rewrite)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 메커니즘</h5>
            <p>
              <code>proxy.ts</code>는 요청이 실제 라우트를 렌더링하기 전에 실행된다. 이 데모는{' '}
              <code>request.nextUrl.pathname</code>에서 <code>/api/&lt;prefix&gt;</code> 세그먼트를 추출해
              라우팅 테이블과 대조하고, 일치하면 <code>NextResponse.rewrite()</code>로 URL을 그대로 둔 채
              내부적으로 다른 파일(<code>services/&lt;service&gt;/route.ts</code>)이 응답하도록 바꿔치기한다.
              클라이언트 URL과 실제로 응답을 만든 파일이 서로 다르다는 점이 리다이렉트와의 차이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 요청 파이프라인</h5>
            <pre className="rounded bg-zinc-900 p-2.5 text-[11px] text-zinc-300 overflow-x-auto">
{`GET /api/orders
  → proxy.ts: pathname 접두사 'orders' 매칭
  → requestHeaders.set('x-gateway-target-service', 'order-service')
  → NextResponse.rewrite('/.../services/order-service')
  → services/order-service/route.ts (실제 Route Handler) 실행
  → 200 응답 (x-gateway-target-service 헤더 포함)`}
            </pre>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무 이점</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>단일 진입점(BFF)</strong>: 클라이언트는 서비스별 실제 엔드포인트를 몰라도 된다.</li>
              <li><strong>점진적 마이그레이션</strong>: 접두사별 라우팅 테이블만 바꾸면 백엔드 교체가 가능하다.</li>
              <li><strong>미매핑 경로 방어</strong>: 표에 없는 접두사는 그대로 통과해 자연스러운 404가 발생한다 — 게이트웨이가 임의로 응답을 조작하지 않는다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주의사항</h5>
            <p>
              <code>matcher</code>는 빌드 타임에 정적으로 분석되므로 라우팅 테이블의 키(prefix) 자체는 동적으로
              늘릴 수 있어도 <code>config.matcher</code> 경로 패턴은 상수여야 한다. 또한 같은 <code>proxy.ts</code> 안에
              먼저 오는 조건문이 <code>return</code>하면 뒤의 조건은 도달하지 않는다 — 이 데모의 분기도 그래서
              공용 프록시의 일반 처리 분기보다 앞쪽에 배치돼 있다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
