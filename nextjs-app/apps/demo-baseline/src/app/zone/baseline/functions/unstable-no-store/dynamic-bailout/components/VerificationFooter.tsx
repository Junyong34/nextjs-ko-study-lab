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

  const defaultExpected = "• unstable_noStore()로 다이나믹 렌더링 선언의 동작과 기대 결과를 확인합니다."
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
        title="unstable_noStore()로 다이나믹 렌더링 선언 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="unstable_noStore()로 다이나믹 렌더링 선언 및 캐시 제외">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>unstable_noStore()</code> (<code>next/cache</code>)는 컴포넌트나 데이터 페칭 함수 내부에서 호출되어 해당 스코프의 정적 렌더링을 명시적으로 취소(Bailout)하고 항상 최신 데이터를 동적으로 페칭하도록 강제하는 함수입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 실시간 주식 호가 및 장바구니 요약 컴포넌트 내부에서 <code>unstable_noStore()</code>를 호출하여, 상위 페이지가 정적 렌더링으로 구성되어 있더라도 해당 컴포넌트 영역만큼은 요청 시마다 실시간으로 데이터를 조회하도록 처리합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>컴포넌트 레벨의 동적 제어</strong>: 페이지 전체를 <code>export const dynamic = 'force-dynamic'</code>으로 동적 전환하지 않고, 데이터 페칭 함수 단위에서 정밀하게 동적 전환을 제어합니다.</li>
              <li><strong>선언적 캐시 차단</strong>: <code>fetch(..., {'{'} cache: 'no-store' {'}'})</code>를 지원하지 않는 ORM(Prisma, Drizzle)이나 DB 직결 쿼리에서도 캐시를 안전하게 우회합니다.</li>
              <li><strong>데이터 신선도 100% 보장</strong>: 항상 실시간 최신 상태를 보장해야 하는 민감 데이터의 캐시 오염을 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>실시간 결제 승인 상태 및 포인트 잔액 조회</li>
              <li>라이브 방송 동시 접속자 수 및 실시간 채팅 위젯</li>
              <li>보안 일회용 OTP 인증 코드 생성</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Next.js 15+ 대안</strong>: Next.js 15+에서는 <code>connection()</code> 함수가 정식 도입되어 <code>unstable_noStore</code>를 대체하는 공식 수명 주기 선언으로 활용됩니다.</li>
              <li><strong>과도한 동적 전환 주의</strong>: 남용 시 CDN 캐싱 이점을 잃고 데이터베이스에 직접적인 트래픽 부하가 가해지므로 꼭 필요한 영역에만 제한적으로 사용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
