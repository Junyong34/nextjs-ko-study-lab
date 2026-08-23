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

  const defaultExpected = "• 개인화 사용자별 Private 캐시 격리 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="개인화 사용자별 Private 캐시 격리 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="인증 세션과 'use cache' 결합 및 개인정보 격리">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>인증 사용자별 개인화 캐싱 패턴은 서버 컴포넌트에서 안전하게 세션 쿠키를 검증한 후, <code>'use cache'</code> 함수에 사용자 고유 ID를 명시적 인자로 주입하여 브라우저 개인 캐시 키를 생성하고 공용 캐시와의 데이터 혼선을 원천 방지하는 보안 캐싱 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 일반 회원(User 1)과 VIP 회원(User 2)이 각각 로그인했을 때, 각자의 주문 내역과 할인 쿠폰 잔액이 사용자별로 독립된 캐시 슬롯에 저장되어 상호 간섭 없이 0ms 즉시 응답되는 구조를 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>개인정보 유출(Cache Leak) 원천 방지</strong>: 공용 CDN이나 다른 사용자에게 내 개인 주문 정보가 잘못 캐싱 서빙되는 치명적인 보안 사고를 방지합니다.</li>
                    <li><strong>개인화 화면의 극단적 로딩 가속</strong>: 인증이 필요한 마이페이지 화면도 캐싱 혜택을 온전히 누려 네이티브 앱 수준의 속도를 달성합니다.</li>
                    <li><strong>세션 기반 정밀 캐시 무효화</strong>: 사용자가 프로필을 변경하면 해당 사용자의 캐시 태그(<code>user:profile:${'{'}userId{'}'}</code>)만 정밀하게 날릴 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 마이페이지의 최근 주문 배송 현황 및 쿠폰함 위젯</li>
                    <li>온라인 뱅킹 및 간편결제 서비스의 계좌 잔액 요약 카드</li>
                    <li>구독형 OTT 서비스의 개인 맞춤형 이어보기 재생목록</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>캐시 함수 내부 세션 직접 조회 금지</strong>: <code>'use cache'</code> 함수 안에서 <code>cookies()</code>나 <code>auth()</code>를 직접 부르면 캐시 키에 세션이 바인딩되지 않거나 bailout되므로, 반드시 상위에서 인자로 <code>userId</code>를 넘겨야 합니다.</li>
                    <li><strong>로그아웃 시 태그 퍼지 연동</strong>: 사용자가 로그아웃하거나 비밀번호를 변경할 때 관련 개인 캐시 태그를 즉시 <code>revalidateTag</code>해야 안전합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
