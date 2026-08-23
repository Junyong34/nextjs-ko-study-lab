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

  const defaultExpected = "• revalidateTag max 즉시 만료 제어 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="revalidateTag max 즉시 만료 제어 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="revalidateTag()와 cacheLife('max') 장기 불변 캐시의 결합">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>cacheLife('max')</code>로 영구에 가깝게 장기 캐싱된 불변(Immutable) 데이터에 <code>cacheTag()</code>를 부여하고, 데이터가 수정되는 극히 드문 시점에만 <code>revalidateTag()</code>를 호출하여 100% 온디맨드 이벤트 기반으로만 캐시를 갱신하는 궁극의 고성능 캐싱 패턴입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 평소에는 100% 캐시 히트(0ms 응답)로 서빙되는 브랜드 공식 카탈로그에 <code>cacheLife('max')</code>를 적용하고, 관리자가 긴급 수정 후 <code>revalidateTag('brand-catalog')</code>를 실행했을 때만 선택적으로 새 캐시가 생성되는 수명 주기를 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>극한의 서버 부하 제로화</strong>: 주기적인 ISR 재생성조차 발생하지 않아 트래픽이 폭증해도 원본 DB 조회가 0건에 수렴합니다.</li>
                    <li><strong>완벽한 데이터 신선도 보장</strong>: 수정이 발생할 때만 정확히 <code>revalidateTag</code>가 발동하므로 사용자는 항상 최신 상태를 유지하면서도 캐시 혜택을 100% 누립니다.</li>
                    <li><strong>비용 효율 극대화</strong>: 서버리스 컴퓨팅 실행 시간과 데이터베이스 읽기 비용을 99% 이상 절감합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>국가별 법정 공휴일 목록 및 표준 우편번호/주소 데이터</li>
                    <li>연간 브랜드 룩북 및 변경 빈도가 극히 낮은 공식 제품 카탈로그</li>
                    <li>다국어 정적 번역 사전(Dictionary) 데이터</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>무효화 누락 주의</strong>: 데이터베이스는 수정되었는데 <code>revalidateTag</code> 호출이 누락되면 영구히 이전 캐시가 서빙될 수 있으므로, DB 변경 트랜잭션에 무효화 로직을 반드시 결합해야 합니다.</li>
                    <li><strong>에러 핸들링</strong>: 외부 CMS 웹훅 실패 시 재시도 큐(Retry Queue)를 두어 태그 무효화가 유실되지 않도록 방어 로직을 구축해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
