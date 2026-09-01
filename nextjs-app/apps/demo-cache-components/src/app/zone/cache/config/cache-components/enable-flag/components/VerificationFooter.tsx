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

  const defaultExpected = '• cacheComponents: true Next.js 16 플래그 활성화의 동작과 기대 결과를 확인합니다.'
  const defaultActual = '• 사용자 조작 후 실제 결과를 표시합니다.'

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
        title="cacheComponents: true Next.js 16 플래그 활성화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || '이 예제의 동작과 검증 결과를 표시합니다.'}
      />
                                    <DemoDeepDiveCard title="Next.js 16 cacheComponents 플래그 활성화 및 빌드 파이프라인">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p>Next.js 16의 <code>experimental.dynamicIO</code>(또는 <code>cacheComponents</code>) 플래그는 기존의 복잡한 Data Cache 모델을 탈피하고, 컴포넌트 및 함수 단위의 <code>'use cache'</code> 지시어와 <code>cacheLife</code>/<code>cacheTag</code> 시스템을 활성화하는 컴파일러 설정 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 플래그 활성화 시 컴파일러가 비동기 I/O 함수를 감지하고 <code>'use cache'</code>가 부여된 세그먼트를 자동 식별하여 정적 캐시 아티팩트로 분리하는 빌드 파이프라인의 상태를 검증합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>차세대 캐싱 모델 통합</strong>: 모호했던 fetch 옵션 대신 React 표준 지시어(<code>'use cache'</code>)로 캐싱 멘탈 모델을 단순화합니다.</li>
                          <li><strong>빌드 타임 안전성 보장</strong>: 동적 데이터 접근과 캐시된 데이터 영역을 컴파일 단계에서 엄격히 분리하여 런타임 오류를 방지합니다.</li>
                          <li><strong>정밀한 캐시 수명 제어</strong>: <code>cacheLife()</code> 프로파일과 연동되어 초, 분, 시 단위의 정밀한 TTL 스케줄링을 지원합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>Next.js 16 신규 프로젝트의 표준 엔터프라이즈 캐싱 아키텍처 수립</li>
                          <li>대규모 이커머스 트래픽 처리를 위한 마이크로 캐싱 도입</li>
                          <li>기존 Next.js 14/15 레거시 캐시 시스템의 현대화 리팩토링</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>Node.js 18+ 환경 요구</strong>: 최신 Cache Components 파이프라인은 최신 Node.js 런타임과 React 19 Canary 버전을 필요로 합니다.</li>
                          <li><strong>동적 함수와의 격리</strong>: <code>cookies()</code>나 <code>headers()</code>를 직접 읽는 컴포넌트 내부에는 <code>'use cache'</code>를 직접 선언할 수 없으며 파라미터로 주입해야 합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
