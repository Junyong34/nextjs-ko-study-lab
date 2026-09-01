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

  const defaultExpected = "• experimental.cacheLife 커스텀 수명 프리셋 전역 정의의 동작과 기대 결과를 확인합니다."
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
        title="experimental.cacheLife 커스텀 수명 프리셋 전역 정의 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                                    <DemoDeepDiveCard title="next.config.ts custom cacheLife 프리셋 정의">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p><code>next.config.ts</code>의 <code>experimental.cacheLife</code> 설정은 서비스 특성에 맞는 사용자 정의 캐시 수명 프로파일(stale, revalidate, expire)을 커스텀 프리셋(e.g. <code>frequent</code>, <code>eCommerceFlash</code>)으로 사전 등록하여 코드 전역에서 일관되게 재사용하는 설정 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 커스텀 정의된 <code>flashSale</code> 프리셋(stale: 10초, revalidate: 30초, expire: 1분)을 적용한 타임특가 위젯이 지정된 시간 주기에 맞춰 정확하게 백그라운드 revalidation 및 만료 수명 주기를 수행하는 과정을 검증합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>전사 캐시 정책 표준화</strong>: 개발자마다 임의의 초 단위 숫자를 하드코딩하지 않고 표준화된 비즈니스 용어 프리셋으로 캐시 수명을 통일합니다.</li>
                          <li><strong>유지보수 중앙 집중화</strong>: 비즈니스 요구사항 변경 시 <code>next.config.ts</code>의 프리셋 값만 수정하면 전사 수십 개 페이지의 캐시 주기가 일괄 갱신됩니다.</li>
                          <li><strong>정밀한 3단계 수명 제어</strong>: 클라이언트 신선도(stale), 서버 revalidation 주기(revalidate), 최종 가비지 컬렉션(expire)을 세분화하여 제어합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>이커머스 타임특가/선착순 쿠폰 발급 위젯(flashSale 프리셋)</li>
                          <li>일간 랭킹 및 일일 통계 요약 카드(dailyDigest 프리셋)</li>
                          <li>정적 브랜드 소개 및 이용약관(permanent 프리셋)</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>3개 속성 간의 관계(stale {'<'}= revalidate {'<'}= expire)</strong>: 프리셋을 정의할 때 반드시 <code>stale {'<'}= revalidate {'<'}= expire</code> 대소 관계를 준수해야 유효한 캐시 수명 주기가 성립합니다.</li>
                          <li><strong>내장 프리셋과의 네이밍 충돌</strong>: Next.js 내장 프리셋(<code>seconds</code>, <code>minutes</code>, <code>hours</code>, <code>days</code>, <code>weeks</code>, <code>max</code>)과 겹치지 않는 고유한 비즈니스 이름을 부여해야 합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
