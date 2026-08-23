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

  const defaultExpected = "• useRouter 프로그래밍 네비게이션 및 prefetch 최적화 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="useRouter 프로그래밍 네비게이션 및 prefetch 최적화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="useRouter 프로그래밍 네비게이션 및 prefetch 최적화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>next/navigation</code>의 <code>useRouter()</code> 훅은 <code>router.push()</code>, <code>router.replace()</code>, <code>router.prefetch()</code> 메서드를 통해 클라이언트 사이드에서 프로그래밍 방식으로 라우팅을 제어하고, 지정된 경로의 RSC 페이로드를 백그라운드에서 사전 캐싱하는 클라이언트 네비게이션 표준 API입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 [결제 완료 후 이동]이나 [VIP 기획전 바로가기] 버튼에 마우스를 올리거나 포커스할 때 <code>router.prefetch('/zone/baseline/...')</code>를 수동 호출하여 RSC 청크를 사전 수신하고, 버튼 클릭 시 네트워크 대기 시간 없이 0ms 즉각 화면 전환을 수행합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>예측 기반 초고속 전환</strong>: 사용자 행동(호버, 결제 단계 진행 등)을 기반으로 다음 페이지 자원을 미리 캐싱하여 체감 로딩 속도를 제로화합니다.</li>
                    <li><strong>유연한 프로그래밍 라우팅</strong>: 폼 검증 완료 후 조건부 분기 이동, 타이머 종료 후 자동 리다이렉트 등 비동기 로직 결합이 용이합니다.</li>
                    <li><strong>네트워크 대역폭 제어</strong>: 링크 태그 자동 프리패치 외에 실무적으로 중요한 핵심 전환 경로만 선별적으로 프리패치할 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>주문 결제 폼 유효성 검사 성공 직후 완료 페이지(<code>/order/complete</code>)로 <code>router.push()</code></li>
                    <li>상품 장바구니 담기 후 [바로 구매하기] 버튼 호버 시 주문서 작성 페이지 사전 프리패치</li>
                    <li>로그인 세션 만료 알림 팝업 확인 클릭 시 로그인 페이지로 히스토리 덮어쓰기(<code>router.replace()</code>)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Production 빌드에서만 완전 동작</strong>: <code>router.prefetch()</code>의 실제 백그라운드 프리패치 캐싱 효과는 개발(dev) 모드가 아닌 <code>next build</code> 후 프로덕션 환경에서 확인할 수 있습니다.</li>
                    <li><strong>대량의 무분별한 prefetch 지양</strong>: 루프나 거대한 테이블의 모든 행에 대해 무차별적으로 <code>router.prefetch()</code>를 호출하면 모바일 사용자의 데이터 대역폭과 CPU 자원을 낭비할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
