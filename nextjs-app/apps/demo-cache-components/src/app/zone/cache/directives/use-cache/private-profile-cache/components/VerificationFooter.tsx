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

  const defaultExpected = "• 'use cache: private' 개인화 주문 내역 캐시 격리의 동작과 기대 결과를 확인합니다."
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
        title="'use cache: private' 개인화 주문 내역 캐시 격리 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                                    <DemoDeepDiveCard title="사용자 세션 스코프 개인화 데이터 'use cache' 패턴">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p>개인화 데이터 캐싱은 <code>'use cache'</code> 함수에 사용자 식별자(User ID, Tenant ID)를 명시적 인자로 주입하여 캐시 키를 사용자 단위로 격리하고, 전역 캐시와 개인 캐시의 오염을 방지하는 표준 보안 캐싱 패턴입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>이 예제에서는 사용자 A(user_101)와 사용자 B(user_202)의 개인 장바구니 요약 데이터를 <code>getUserCart(userId)</code>로 캐싱하고, 사용자별 캐시가 서로 섞이지 않는지 확인합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>사용자별 캐시 분리</strong>: 사용자 ID를 캐시 키에 포함해 다른 사용자의 개인정보나 결제 정보가 섞이지 않도록 합니다.</li>
                          <li><strong>개인화 화면 재사용</strong>: 마이페이지나 개인 대시보드처럼 사용자마다 다른 화면도 사용자별로 캐시할 수 있습니다.</li>
                          <li><strong>사용자별 독립 캐시 무효화</strong>: 사용자 A가 장바구니를 수정하면 <code>cacheTag('user-cart-' + userId)</code>를 통해 해당 사용자의 캐시만 정밀 타겟 무효화합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>쇼핑몰 마이페이지의 회원 등급, 보유 적립금, 사용 가능 쿠폰 수 요약</li>
                          <li>B2B SaaS 멀티테넌트 대시보드의 테넌트별 구독 플랜 및 사용량 통계</li>
                          <li>개인 맞춤형 추천 알고리즘 결과 및 최근 본 상품 목록</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>쿠키 직접 참조 금지</strong>: <code>'use cache'</code> 내부에서 <code>cookies()</code>를 직접 호출하면 다이나믹 렌더링으로 bailout될 수 있으므로, 외부에서 세션을 확인하고 <code>userId</code>를 인자로 넘깁니다.</li>
                          <li><strong>cacheLife 짧은 수명 권장</strong>: 개인화 데이터는 변경 빈도가 높으므로 <code>cacheLife('minutes')</code> 등 적절히 짧은 수명을 설정하거나 이벤트 기반 태그 무효화를 결합해야 합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
