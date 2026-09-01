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

  const defaultExpected = "• cacheTag를 이용한 태그 기반 무효화의 동작과 기대 결과를 확인합니다."
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
        title="cacheTag를 이용한 태그 기반 무효화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Cache Components 초정밀 캐시 태그 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>초정밀 태그 무효화(Precision Tag Purge)는 페이지 전체를 다시 빌드하는 대신 <code>'use cache'</code> 컴포넌트나 함수에 부여된 고유 식별자 태그(e.g. <code>'product:stock:prod-101'</code>)만을 타겟팅하여 무효화함으로써, 변경되지 않은 주변 UI 캐시는 100% 보존하는 초경량 revalidation 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 복합 상품 화면에서 [가격 위젯], [재고 위젯], [리뷰 위젯]이 각각 독립된 태그를 가지고 있을 때, [재고 변경] 이벤트 발생 시 오직 재고 위젯의 캐시만 정밀하게 날아가고 나머지 위젯은 이전 캐시를 그대로 유지하는 과정을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>서버 렌더링 비용 극소화</strong>: 전체 페이지를 다시 계산하지 않고 변경된 마이크로 위젯만 새로 계산하므로 CPU 사용량을 90% 이상 절감합니다.</li>
                    <li><strong>CDN 대역폭 절약</strong>: 무효화 대상이 아닌 정적 콘텐츠는 CDN 에지 캐시에서 계속 서빙되어 오리진 부하를 최소화합니다.</li>
                    <li><strong>이벤트 기반 실시간성 극대화</strong>: 다양한 마이크로서비스 이벤트에 맞춰 정밀하게 필요한 데이터 조각만 최신화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>상품 상세 화면의 실시간 잔여 재고 수량 뱃지만 정밀 갱신</li>
                    <li>라이브 방송 중 진행자의 현재 방송 상태 및 시청자 수 카운터 갱신</li>
                    <li>대시보드의 실시간 서버 CPU 사용률 그래프만 단독 최신화</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>태그 스코프의 명확한 분리</strong>: 태그를 너무 광범위하게 지정(e.g. <code>'products'</code>)하면 정밀 무효화의 이점이 사라지므로 세부 엔티티 단위(e.g. <code>'product:101:price'</code>)로 설계해야 합니다.</li>
                    <li><strong>캐시 키 오버헤드 관리</strong>: 지나치게 잘게 쪼갠 수백 개의 태그는 관리 복잡성을 높이므로 도메인 변경 빈도에 맞춰 적절한 계층으로 구성해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
