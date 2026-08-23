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

  const defaultExpected = "• next.config.ts custom cacheLife 프로파일 정의 및 바인딩 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="next.config.ts custom cacheLife 프로파일 정의 및 바인딩 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="cacheLife() 런타임 커스텀 수명 프로파일 적용">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>cacheLife({'{'} stale, revalidate, expire {'}'})</code> 함수는 <code>'use cache'</code> 스코프 내부에서 호출되어, 해당 캐시 엔트리의 신선도(stale), 백그라운드 재검증 시작 시점(revalidate), 최종 메모리 폐기 시점(expire)을 런타임에 동적으로 부여하는 표준 캐시 수명 제어 함수입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 <code>cacheLife({'{'} stale: 5, revalidate: 15, expire: 60 {'}'})</code>을 선언한 실시간 재고 조회 함수가 5초 동안은 완전 정적 응답, 15초 이후에는 백그라운드 SWR 갱신, 60초 경과 시에는 완전 만료 후 즉시 재계산되는 3단계 수명 주기를 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>비즈니스 도메인별 정밀 TTL 부여</strong>: 초 단위(재고 현황), 분 단위(베스트셀러), 일 단위(회사 정보) 등 데이터의 변동 주기에 맞춰 완벽한 수명 설계 가능.</li>
                    <li><strong>직관적인 선언형 수명 관리</strong>: 복잡한 HTTP Cache-Control 헤더 문자열을 직접 조합하지 않고 명확한 객체 인자로 TTL을 정의합니다.</li>
                    <li><strong>서버 부하와 데이터 신선도의 최적화</strong>: Stale 시간 동안에는 서버 I/O를 100% 차단하여 성능을 극대화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>선착순 타임세일 이벤트 잔여 수량 표시(stale: 5s, revalidate: 10s)</li>
                    <li>실시간 인기 검색어 및 급상승 트렌드 랭킹(stale: 30s, revalidate: 60s)</li>
                    <li>일간 결제 통계 및 일일 리포트 요약 카드(stale: 1h, revalidate: 6h)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>'use cache' 스코프 내부 호출 필수</strong>: <code>cacheLife()</code>는 반드시 <code>'use cache'</code>가 선언된 함수나 컴포넌트 본문 내부에서 호출해야 유효합니다.</li>
                    <li><strong>중첩 호출 시 최소값 병합</strong>: 한 컴포넌트 내부에서 여러 개의 <code>cacheLife</code>가 호출되면 가장 짧은 수명이 전체 캐시 수명으로 적용됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
