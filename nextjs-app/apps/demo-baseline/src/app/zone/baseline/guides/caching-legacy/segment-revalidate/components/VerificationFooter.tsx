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

  const defaultExpected = "• Route Segment revalidate 설정의 동작과 기대 결과를 확인합니다."
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
        title="Route Segment revalidate 설정 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Route Segment revalidate 설정 및 캐시 수명 제어">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Route Segment Config의 <code>export const revalidate = 60</code> 및 <code>export const dynamic = 'auto' | 'force-dynamic'</code>는 해당 라우트 세그먼트 전체의 정적 렌더링 주기와 증분 정적 재생성(ISR) 간격을 파일 레벨에서 선언하는 App Router 표준 설정 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 <code>export const revalidate = 10</code>이 적용된 라우트에서 10초 이내에는 이전 빌드된 HTML/RSC 페이로드가 0ms로 즉각 응답되고, 10초 경과 후 최초 요청 시 백그라운드에서 페이지가 revalidation되어 새 타임스탬프로 갱신되는 수명 주기를 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>선언적 세그먼트 수명 제어</strong>: 개별 fetch 문마다 설정을 반복하지 않고 파일 상단에 단 한 줄로 라우트 전체의 캐시 주기를 관리합니다.</li>
                    <li><strong>CDN 에지 캐싱 효율 극대화</strong>: 설정된 revalidate 주기에 맞춰 Vercel, Cloudflare 등 글로벌 엣지 CDN에 <code>s-maxage</code> 캐시 헤더를 자동 전파합니다.</li>
                    <li><strong>서버 부하 감소</strong>: 초당 수만 건의 트래픽이 몰려도 정해진 시간 동안은 사전 렌더링된 정적 캐시만 반환하여 DB 부하를 차단합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>주기적인 갱신이 필요한 쇼핑몰 카테고리별 베스트셀러 랭킹 화면</li>
                    <li>뉴스, 블로그, 공지사항 등 준실시간성 콘텐츠 포털 목록</li>
                    <li>주식/가상자산 시세 및 환율 정보 브리핑 페이지</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>최소값 우선순위 규칙</strong>: 동일 세그먼트 내에 여러 fetch가 서로 다른 revalidate 값을 가질 경우, 가장 짧은 revalidate 주기가 세그먼트 전체의 주기로 채택됩니다.</li>
                    <li><strong>동적 함수 사용 시 bailout</strong>: 세그먼트 내에서 <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code>를 사용하면 정적 revalidate가 무효화되고 동적 렌더링으로 전환될 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
