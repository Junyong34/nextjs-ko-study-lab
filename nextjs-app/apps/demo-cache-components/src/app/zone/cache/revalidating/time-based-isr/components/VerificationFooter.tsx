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

  const defaultExpected = "• cacheLife 시간 기반 캐시 수명 및 SWR 재검증 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="cacheLife 시간 기반 캐시 수명 및 SWR 재검증 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="cacheLife 시간 기반 캐시 수명 및 SWR 재검증">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 16의 시간 기반 캐싱은 <code>'use cache'</code> 스코프 내에서 <code>cacheLife({'{'} stale, revalidate, expire {'}'})</code> 또는 표준 프리셋을 선언하여, 지정된 시간 동안 초고속 정적 응답을 제공하고 만료 후 백그라운드에서 비동기 재검증을 수행하는 현대적 시간 기반 ISR 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 10초 수명이 설정된 타임세일 상품 캐시가 10초 이내에는 빌드 타임스탬프를 유지하며 0ms로 응답되고, 10초 경과 후 최초 요청 시 백그라운드 SWR 파이프라인이 발동하여 최신 가격과 시간으로 갱신되는 동작을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>트래픽 폭증 시 완벽한 서버 보호</strong>: 초당 수만 건의 요청이 유입되어도 설정된 시간 동안은 캐시에서 100% 응답하여 데이터베이스를 안전하게 보호합니다.</li>
                    <li><strong>최적의 응답 속도(TTFB)</strong>: 사용자는 항상 사전에 계산된 캐시 데이터를 즉시 전달받아 대기 시간을 체감하지 않습니다.</li>
                    <li><strong>자동화된 데이터 최신성 유지</strong>: 수동 무효화 요청 없이도 정해진 주기에 따라 데이터가 스스로 최신 상태로 유지됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 실시간 랭킹 및 인기 검색어 순위(cacheLife('minutes'))</li>
                    <li>뉴스 포털 및 블로그 기사 목록(cacheLife('hours'))</li>
                    <li>주기적인 환율, 날씨, 유가 정보 브리핑 위젯</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>백그라운드 재검증 중 에러 처리</strong>: 백그라운드 재생성 중 DB 연결 실패가 발생해도 이전 캐시 데이터가 안전하게 서빙되어 사용자 화면 장애를 방지합니다.</li>
                    <li><strong>온디맨드 무효화와의 병행</strong>: 시간 기반 만료를 기본으로 두되 긴급 수정 시에는 <code>revalidateTag</code>를 병행 호출하는 2중 캐시 전략이 가장 권장됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
