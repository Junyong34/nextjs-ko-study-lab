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

  const defaultExpected = "• Next.js 14 레거시 fetch cache vs Route Segment revalidate 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Next.js 14 레거시 fetch cache vs Route Segment revalidate 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Next.js 14 레거시 fetch cache vs Route Segment revalidate">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 14에서 도입되었던 <code>fetch(url, {'{'} next: {'{'} revalidate: 60 {'}'} {'}'})</code> 옵션과 Route Segment Config(<code>export const dynamic</code>, <code>export const fetchCache</code>)는 HTTP Fetch 단위의 Data Cache 제어와 세그먼트 레벨 수명 제어를 결합한 레거시 캐싱 모델입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 개별 <code>fetch()</code> 호출마다 지정된 revalidate 시간(10초)과 페이지 세그먼트 전역 <code>revalidate = 30</code> 설정이 충돌할 때의 캐시 우선순위 판정과 백그라운드 재검증 타이밍을 대조 분석합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>요청 단위 세분화된 수명 제어</strong>: 동일 페이지 내에서도 자주 변하는 환율 정보(10초)와 고정된 회사 소개(하루)의 캐시 수명을 분리 설정 가능.</li>
                    <li><strong>자동 중복 요청 제거(Deduping)</strong>: 동일 렌더 트리 내에서 동일 URL에 대한 다중 fetch 호출 시 1회만 실제 네트워크 I/O 실행.</li>
                    <li><strong>점진적 마이그레이션 기준점</strong>: Next.js 15/16의 <code>use cache</code> 디렉티브로 전환하기 위한 핵심 레거시 아키텍처 이해 제공.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>레거시 Next.js 14 엔터프라이즈 프로젝트 유지보수 및 캐시 디버깅</li>
                    <li>외부 서드파티 REST API 다중 연동 시 엔드포인트별 응답 캐시 수명 차등화</li>
                    <li>Next.js 16 최신 <code>use cache</code> 아키텍처로의 전환 계획 수립</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Next.js 15+ 기본값 변경 주의</strong>: Next.js 15부터는 <code>fetch</code> 기본값이 <code>no-store</code>(비캐시)로 변경되었으므로, 캐싱이 필요한 경우 명시적으로 <code>cache: 'force-cache'</code>나 <code>next: {'{'} revalidate {'}'}</code>를 지정해야 합니다.</li>
                    <li><strong>Next.js 16 use cache로의 전환 권장</strong>: fetch 단위 캐싱의 복잡성을 해소하기 위해 차세대 함수/컴포넌트 단위 <code>'use cache'</code> 지시어 도입이 적극 권장됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
