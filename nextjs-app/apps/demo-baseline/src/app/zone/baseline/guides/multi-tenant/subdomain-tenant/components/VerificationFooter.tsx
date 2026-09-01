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

  const defaultExpected = "• 서브도메인 기반 테넌트 분기 및 브랜드 테마의 동작과 기대 결과를 확인합니다."
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
        title="서브도메인 기반 테넌트 분기 및 브랜드 테마 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="서브도메인 기반 테넌트 분기 및 브랜드 테마">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>서브도메인 기반 멀티 테넌트 라우팅은 Middleware가 수신 요청의 <code>Host</code> 헤더(예: <code>nike.shop.com</code>, <code>adidas.shop.com</code>)를 파싱하여 내부 동적 라우트 세그먼트(<code>/_tenants/[tenant]/...</code>)로 내부 재작성(Rewrite)함으로써 완벽한 데이터 및 라우트 격리를 제공하는 표준 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서브도메인 전환 시뮬레이터를 통해 <code>tenant-a.market.com</code> 요청이 내부의 독립된 카탈로그 및 주문 로직으로 라우팅되고, 각 테넌트의 전용 상품 목록과 독립 데이터베이스 스키마가 분기되는 메커니즘을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>투명한 URL 구조 및 독립 도메인 경험</strong>: 브라우저 주소창에는 깔끔한 서브도메인(또는 커스텀 도메인)이 유지되며 내부 라우팅 구조는 외부에 노출되지 않습니다.</li>
              <li><strong>테넌트 데이터 보안 완전 격리</strong>: 서버 컴포넌트가 세그먼트 파라미터(<code>tenant</code>)를 바탕으로 테넌트 전용 DB 스키마나 필터를 강제 적용하여 타사 데이터 유출을 방어합니다.</li>
              <li><strong>중앙 집중식 인프라 관리</strong>: 모든 서브도메인 트래픽을 단일 인프라 클러스터에서 수용하여 오토스케일링과 SSL 인증서 관리가 간소화됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 쇼핑몰 플랫폼의 셀러별 독립 스토어(<code>[store].myshop.com</code>)</li>
              <li>기업용 협업 SaaS의 워크스페이스별 전용 서브도메인(<code>[company].slack.com</code>)</li>
              <li>대학/기관별 온라인 강의 및 수강신청 전용 포털</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>와일드카드 서브도메인 DNS 및 SSL 설정</strong>: 인프라 레벨(Vercel, AWS Route53)에서 <code>*.shop.com</code> 와일드카드 DNS와 SSL 인증서가 사전에 올바르게 바인딩되어 있어야 합니다.</li>
              <li><strong>루트 도메인 및 정적 자원 예외 처리</strong>: 미들웨어에서 메인 랜딩 페이지(<code>shop.com</code>)나 정적 파일(<code>_next/*</code>) 요청이 테넌트 라우트로 잘못 리라이트되지 않도록 정밀한 필터링 조건을 구성해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
