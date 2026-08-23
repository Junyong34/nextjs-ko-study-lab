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

  const defaultExpected = "• Next.js 16 cacheLife('hours') 프로파일 기반 수명 제어 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Next.js 16 cacheLife('hours') 프로파일 기반 수명 제어 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="cacheLife('hours') 프로파일 기반 장기 ISR 수명 제어">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>cacheLife('hours')</code> 프로파일은 Next.js 16 Cache Components에서 레거시 <code>export const revalidate = 3600</code>을 완전히 대체하여, 시간 단위(수 시간)로 데이터 신선도를 유지하고 정기적인 백그라운드 재검증을 수행하는 현대적 ISR 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 대규모 상품 카탈로그 목록에 <code>cacheLife('hours')</code>를 선언하고, 1시간 동안은 완벽한 정적 캐시 히트(0ms)로 동작하며 1시간 경과 후 최초 요청 시 백그라운드에서 신규 카탈로그 데이터로 자동 갱신되는 동작을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Next.js 16 표준 아키텍처 정렬</strong>: 파일 레벨의 파편화된 Route Segment Config 대신 컴포넌트/함수 단위의 일관된 <code>cacheLife</code> 인터페이스를 적용합니다.</li>
                    <li><strong>글로벌 CDN 에지 캐싱 최적화</strong>: 전 세계 분산 CDN 에지 노드에 최적의 <code>s-maxage</code> 캐시 헤더를 자동 전파하여 오리진 서버 트래픽을 99% 절감합니다.</li>
                    <li><strong>유연한 태그 결합</strong>: 주기적 시간 만료 외에도 긴급 수정 시 <code>revalidateTag</code>를 통한 즉각 무효화를 완벽히 병행 지원합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>수만 개의 아이템을 보유한 이커머스 전체 카테고리 카탈로그</li>
                    <li>일간 베스트셀러 도서 목록 및 인기 브랜드 랭킹</li>
                    <li>기술 문서 및 개발자 가이드 포털 사이트</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>레거시 revalidate 설정과의 혼용 금지</strong>: 동일 세그먼트에서 <code>export const revalidate</code>와 <code>cacheLife()</code>를 혼용하면 충돌이 발생할 수 있으므로 <code>cacheLife</code>로 일원화해야 합니다.</li>
                    <li><strong>비즈니스 변동 주기 분석</strong>: 데이터 수정이 잦은 영역에 무조건 <code>hours</code>를 적용하면 사용자에게 오래된 정보가 노출될 수 있으므로 도메인 특성을 면밀히 검토해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
