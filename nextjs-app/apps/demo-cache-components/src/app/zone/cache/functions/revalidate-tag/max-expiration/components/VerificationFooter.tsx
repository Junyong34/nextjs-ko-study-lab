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

  const defaultExpected = "• revalidateTag max 캐시 만료 제어의 동작과 기대 결과를 확인합니다."
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
        title="revalidateTag max 캐시 만료 제어 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="revalidateTag()와 cacheLife('max') 장기 불변 캐시의 결합">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>cacheLife('max')</code>로 오래 캐시할 데이터에 <code>cacheTag()</code>를 부여하고, 데이터가 바뀔 때 <code>revalidateTag()</code>를 호출해 해당 캐시를 갱신하는 방식입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>이 예제에서는 브랜드 카탈로그에 <code>cacheLife('max')</code>를 적용하고, 관리자가 수정 후 <code>revalidateTag('brand-catalog')</code>를 실행했을 때 해당 태그의 캐시가 갱신되는 흐름을 확인합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>반복 조회 감소</strong>: 데이터가 바뀌지 않는 동안 캐시를 재사용해 원본 DB 조회를 줄일 수 있습니다.</li>
                    <li><strong>변경 시점 갱신</strong>: 수정이 발생했을 때 <code>revalidateTag</code>를 호출해 관련 캐시만 갱신합니다.</li>
                    <li><strong>비용 조정</strong>: 캐시 재사용 범위와 갱신 시점을 서비스 요구사항에 맞게 설정할 수 있습니다.</li>
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
