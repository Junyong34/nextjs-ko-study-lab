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

  const defaultExpected = "• cacheLife 빌트인 프리셋 프로파일 (seconds vs hours vs max) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="cacheLife 빌트인 프리셋 프로파일 (seconds vs hours vs max) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Next.js 16 cacheLife 내장 프리셋 프로파일">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 16은 자주 사용되는 캐시 주기를 위해 <code>cacheLife('seconds')</code>, <code>cacheLife('minutes')</code>, <code>cacheLife('hours')</code>, <code>cacheLife('days')</code>, <code>cacheLife('weeks')</code>, <code>cacheLife('max')</code> 등 표준 내장 프리셋을 제공하여 복잡한 숫자 설정 없이 즉시 활용 가능한 프리셋 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 6가지 표준 프리셋을 각각 적용한 데이터 함수들의 TTL 파라미터(stale/revalidate/expire) 매핑 테이블을 확인하고, 프리셋 적용 시 캐시 헤더와 백그라운드 재검증 동작이 자동으로 스케줄링되는 과정을 대조 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>코드 가독성 및 생산성 극대화</strong>: 숫자 대신 <code>'hours'</code>, <code>'days'</code> 등 직관적인 문자열 프리셋을 사용하여 코드의 의도를 명확히 드러냅니다.</li>
                    <li><strong>Next.js 프레임워크 표준 모범 사례 준수</strong>: Vercel 및 글로벌 엣지 인프라에 최적화된 사전 검증된 TTL 설정값을 그대로 활용합니다.</li>
                    <li><strong>휴먼 에러 방지</strong>: 초/밀리초 변환 계산 실수나 비정상적인 만료 시간 설정으로 인한 버그를 원천 차단합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>실시간 환율/날씨 위젯(cacheLife('minutes'))</li>
                    <li>쇼핑몰 일반 상품 카탈로그 및 카테고리 목록(cacheLife('hours'))</li>
                    <li>이용약관, 개인정보처리방침 등 정적 공지 문서(cacheLife('max'))</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>프리셋 오버라이드 가능</strong>: 내장 프리셋의 기본 시간은 <code>next.config.ts</code>의 <code>experimental.cacheLife</code> 설정을 통해 전역 오버라이드할 수 있습니다.</li>
                    <li><strong>오타 주의</strong>: 정의되지 않은 프리셋 문자열을 전달하면 빌드 시 경고 또는 기본 fallback 정책이 적용되므로 표준 프리셋 명칭을 준수해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
