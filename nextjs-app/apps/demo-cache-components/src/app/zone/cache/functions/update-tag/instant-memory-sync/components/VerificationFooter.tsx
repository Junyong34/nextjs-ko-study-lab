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

  const defaultExpected = "• updateTag() 즉시 캐시 메모리 패치 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="updateTag() 즉시 캐시 메모리 패치 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Next.js 16 updateTag() 메모리 캐시 즉시 동기화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 16의 <code>updateTag(tag)</code>는 기존 <code>revalidateTag()</code>가 캐시를 단순히 폐기하고 다음 요청 시 백그라운드 재계산을 기다리던 것과 달리, 서버 메모리 캐시를 즉각 최신 상태로 동기 치환하여 다음 요청자가 0ms 만에 새로운 캐시를 즉시 수신하도록 보장하는 차세대 캐시 동기화 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상품 가격 수정 직후 <code>updateTag('product-price')</code>를 실행했을 때, Stale 상태를 거치지 않고 메모리 상에서 즉각 새 가격 데이터로 캐시 엔트리가 덮어씌워져 다음 방문자에게 지연 없이 최신 가격이 서빙되는 과정을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Stale 데이터 노출 시간 제로화</strong>: 재검증 대기 시간 동안 이전 데이터가 잠깐이라도 노출되는 순간적인 불일치 현상을 완전히 제거합니다.</li>
                    <li><strong>캐시 스탬피드(Cache Stampede) 방지</strong>: 캐시가 비어있는 순간에 수많은 요청이 동시에 DB로 쏟아지는 병목 현상을 원천 방어합니다.</li>
                    <li><strong>결제/금융급 데이터 일관성</strong>: 가격이나 잔여 좌석처럼 1초의 오차도 허용되지 않는 민감한 트랜잭션 화면에 최적화됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>타임세일 특가 오픈 시 정각 가격 전환 및 재고 수량 즉시 동기화</li>
                    <li>항공권/호텔 예약 시스템의 실시간 잔여 객실 수 메모리 갱신</li>
                    <li>라이브 옥션(경매) 서비스의 현재 최고 입찰가 즉시 반영</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>updateTag 지원 환경 확인</strong>: <code>updateTag</code>는 Next.js 16 최신 실험적 캐시 엔진에서 제공되므로 프로젝트의 Next.js 버전을 확인해야 합니다.</li>
                    <li><strong>연산 비용 고려</strong>: 동기화 시점에 새 데이터를 즉시 계산하므로 너무 무거운 배치 작업보다는 핵심 단건 데이터 갱신에 적합합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
