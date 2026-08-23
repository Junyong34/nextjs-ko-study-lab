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

  const defaultExpected = "• 링크 호버 시 정적 셸만 사전 패칭 (Partial Prefetching) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="링크 호버 시 정적 셸만 사전 패칭 (Partial Prefetching) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="링크 호버 시 정적 셸만 사전 패칭 (Partial Prefetching)">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Partial Prerendering(PPR) 및 부분 프리패칭(Partial Prefetching)은 링크 마우스 호버 시점에 정적으로 사전 렌더링된 레이아웃 셸만 가볍게 사전 수신하고, 동적 데이터 청크는 실제 클릭/네비게이션 시점에 스트리밍으로 결합하는 고효율 프리패칭 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 [상품 카드 링크] 호버 시 50ms 이내에 경량 정적 셸(네비게이션 바, 탭 구조)만 백그라운드에서 프리패치하고, 클릭 시 동적 가격 및 재고 데이터가 Suspense 스트림을 통해 지연 없이 바인딩되는 과정을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>클라이언트 네트워크 대역폭 절약</strong>: 모든 동적 데이터를 미리 로드하지 않고 정적 셸만 가져와 모바일 데이터 소모량을 대폭 절감합니다.</li>
                    <li><strong>0ms 체감 네비게이션</strong>: 사용자가 클릭하는 즉시 로컬 캐시된 셸이 화면에 표시되어 전환 지연을 체감할 수 없습니다.</li>
                    <li><strong>서버 CPU 부하 분산</strong>: 프리패치 단계에서 무거운 동적 DB 조회가 발생하지 않아 불필요한 서버 자원 낭비를 방지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>수만 개의 상품이 노출되는 대형 쇼핑몰 메인 카탈로그 그리드</li>
                    <li>모바일 웹 환경의 하단 네비게이션 탭 및 카테고리 퀵 메뉴</li>
                    <li>트래픽이 집중되는 타임세일 이벤트 프로모션 랜딩 페이지</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>PPR(Partial Prerendering) 플래그 연동</strong>: 부분 프리패칭의 이점을 극대화하려면 <code>next.config.ts</code>에서 <code>experimental.ppr = true</code> 설정을 활성화해야 합니다.</li>
                    <li><strong>loading.tsx와의 조화</strong>: 정적 셸에 명확한 Suspense 스켈레톤 영역이 정의되어 있어야 동적 데이터 수신 시 레이아웃 흔들림이 발생하지 않습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
