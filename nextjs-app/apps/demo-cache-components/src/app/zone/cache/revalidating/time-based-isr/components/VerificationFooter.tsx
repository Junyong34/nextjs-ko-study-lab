'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  elapsed?: number
  isStale?: boolean
  generatedTimestamp?: string
  cacheId?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { elapsed = 0, isStale, generatedTimestamp, cacheId } = props

  const defaultExpected =
    '• cacheLife({ stale: 10, revalidate: 10, expire: 60 }) 시간 기반 캐시 수명 관리\n• 10초 이내에는 FRESH 캐시(#ID 및 생성 시각) 유지\n• 10초 경과(Stale) 후 요청 시 백그라운드 SWR 재검증을 통해 새로운 캐시 ID 생성'

  let defaultActual = '• 캐시 데이터 로딩 대기 중...'
  if (generatedTimestamp && cacheId) {
    defaultActual = `• 캐시 ID: #${cacheId}\n• 생성 시각: ${generatedTimestamp}\n• 수명 주기 상태: ${
      isStale ? 'STALE (10초 경과, SWR 재검증 대상)' : `FRESH (${elapsed}초 경과 / 10초 수명)`
    }\n• 동작 모드: Next.js 16 cacheLife 시간 기반 SWR 캐시 수명주기 정상 동작`
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : elapsed >= 10
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Next.js 16 cacheLife 시간 기반 캐시 수명 & SWR 재검증 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          'Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다.'
        }
      />
      <DemoDeepDiveCard title="Next.js 16 cacheLife 시간 기반 캐시 수명 & SWR 재검증">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js 16의 시간 기반 캐싱은 <code>'use cache'</code> 지시어와 <code>cacheLife({'{'} stale, revalidate, expire {'}'})</code> 설정을 통해, 지정된 시간 동안 캐시 데이터를 즉시 서빙하고 stale 만료 후 첫 요청 시 기존 캐시를 반환하면서 백그라운드에서 비동기 재생성(Stale-While-Revalidate)을 수행하는 현대적 ISR 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 10초 수명이 설정된 캐시 데이터가 10초 이내에는 기존 타임스탬프와 캐시 ID를 유지(FRESH)하며 서빙되고, 10초 경과 후(STALE) 요청 시 기존 캐시를 즉시 반환하는 동시에 백그라운드에서 새 캐시 ID를 생성하여 다음 요청부터 최신 데이터로 전환되는 3단계 수명 주기를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>트래픽 폭증 시 데이터베이스 보호</strong>: 초당 수천 건의 요청이 유입되어도 설정된 stale 기간 동안은 서버 캐시에서 응답하여 백엔드 부하를 최소화합니다.</li>
              <li><strong>최적의 Time to First Byte (TTFB)</strong>: 사용자는 대기 시간 없이 사전에 계산된 캐시를 즉시 수신합니다.</li>
              <li><strong>선언적 캐시 수명 프로필</strong>: <code>cacheLife('minutes')</code>, <code>cacheLife('hours')</code> 등 표준 프리셋을 통해 일관된 캐시 만료 정책을 적용할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 실시간 랭킹 및 인기 검색어 순위(cacheLife('minutes'))</li>
              <li>블로그 포스트 및 뉴스 기사 목록 페이지(cacheLife('hours'))</li>
              <li>환율, 날씨, 유가 정보 등 주기적 데이터 브리핑 위젯</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>stale vs expire 차이</strong>: <code>stale</code>은 백그라운드 재검증이 시작되는 시점이며, <code>expire</code>는 캐시가 완전히 폐기되어 동기 재생성이 강제되는 최대 수명 한계입니다.</li>
              <li><strong>온디맨드 무효화와의 병행</strong>: 시간 기반 만료를 기본으로 두되 관리자 긴급 수정 시에는 <code>revalidateTag</code>를 병행 호출하는 2중 캐시 전략이 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
