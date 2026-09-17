'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { PollLogEntry, ProductCode } from '../types'

export interface VerificationFooterProps {
  productCode: ProductCode
  revalidateSeconds: number
  log: PollLogEntry[]
  isPolling: boolean
}

export function VerificationFooter({ productCode, revalidateSeconds, log, isPolling }: VerificationFooterProps) {
  const observed = log.filter((e) => e.cacheStatus !== 'INIT')
  const hitCount = observed.filter((e) => e.cacheStatus === 'HIT').length
  const missCount = observed.filter((e) => e.cacheStatus === 'MISS').length
  const hasObservedFullCycle = hitCount >= 1 && missCount >= 1

  const isMatched = log.length === 0 ? undefined : hasObservedFullCycle

  const expected =
    `• 조회 간격(1초) 누적이 revalidate(${revalidateSeconds}초) 미만이면 originCallCount가 그대로인 캐시 HIT\n` +
    `• 누적이 revalidate(${revalidateSeconds}초) 이상이 되는 첫 조회는 originCallCount가 증가하는 캐시 MISS(재검증)`

  const actual =
    log.length === 0
      ? '• 아직 조회하지 않았습니다. [자동 폴링 시작] 또는 [지금 1회 조회]를 눌러 주세요.'
      : `• ${productCode} 누적 조회 ${observed.length}회 (HIT ${hitCount}회 / MISS ${missCount}회)\n` +
        `• 최근 상태: ${log[0].cacheStatus} — 재고 ${log[0].stock}개, originCallCount=${log[0].originCallCount}, 응답 ${log[0].durationMs}ms\n` +
        `• ${
          hasObservedFullCycle
            ? 'HIT가 유지되다가 MISS로 전환되는 것을 실제로 관찰했습니다.'
            : isPolling
              ? `아직 ${revalidateSeconds}초 경과 후 MISS 전환을 관찰하지 못했습니다. 자동 폴링을 유지해 주세요.`
              : '자동 폴링을 시작하면 HIT → MISS 전환을 계속 관찰할 수 있습니다.'
        }`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Next.js 확장 fetch revalidate 옵션 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="1초 간격 실측 폴링으로 originCallCount 변화를 직접 비교해 캐시 HIT/MISS를 판정합니다."
      />
      <DemoDeepDiveCard title="Next.js 확장 fetch revalidate 옵션 & 시간 기반 캐시 만료">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js는 Web 표준 <code>fetch</code> API를 확장해{' '}
              <code>fetch(url, {'{'} next: {'{'} revalidate: N {'}'} {'}'})</code> 옵션을 제공한다. 이 옵션은
              데이터 캐시(Data Cache)에 저장된 응답의 캐시 수명을 최대 N초로 지정하며, N초가 지나기 전까지는
              같은 URL·옵션의 fetch 호출이 origin에 도달하지 않고 캐시된 응답을 그대로 반환한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모는 <code>/api</code> Route Handler를 실제 origin으로 두고, Server Action이{' '}
              <code>fetch(apiUrl, {'{'} next: {'{'} revalidate: {revalidateSeconds} {'}'} {'}'})</code>를 1초
              간격으로 반복 호출한다. Route Handler는 <code>force-dynamic</code>이라 호출될 때마다 반드시
              실행되며, 실행 횟수(<code>originCallCount</code>)를 응답에 그대로 실어 보낸다. 클라이언트는
              직전 응답과 이번 응답의 <code>originCallCount</code>를 비교해 값이 그대로면 HIT(캐시 응답),
              증가했으면 MISS(재검증으로 origin이 다시 실행됨)로 판정한다 — 값이 우연히 같아 보이는 것이
              아니라 origin 실행 여부 자체를 세어 확인하는 방식이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>백엔드 트래픽 절감</strong>: 짧은 간격으로 반복 조회해도 revalidate 초당 최대 1회만
                origin이 실행된다.
              </li>
              <li>
                <strong>선언적 캐시 수명 관리</strong>: 별도 캐시 서버 없이 fetch 옵션 한 줄로 수명을 제어한다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>실시간성이 약간 허용되는 환율, 날씨, 인기 검색어 데이터 조회</li>
              <li>상품 상세 페이지의 기본 스펙·재고 캐싱 (예: <code>revalidate: 60</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>Next.js 15+ 기본값 변경</strong>: fetch의 기본 동작이 <code>force-cache</code>에서{' '}
                <code>no-store</code>(비캐시)로 바뀌었으므로, 캐싱을 원하면 <code>revalidate</code> 또는{' '}
                <code>cache: &apos;force-cache&apos;</code>를 명시해야 한다.
              </li>
              <li>
                <strong>같은 URL, 다른 revalidate 값</strong>: 같은 라우트에서 같은 URL에 서로 다른{' '}
                <code>revalidate</code> 값을 지정하면 더 낮은 값이 적용된다. 이 데모가 revalidate 옵션을
                바꿀 때마다 세션(캐시 키)을 새로 발급하는 것도 이 규칙 때문이다.
              </li>
              <li>
                <strong>개발 모드 하드 리프레시</strong>: 브라우저 하드 새로고침처럼{' '}
                <code>cache-control: no-cache</code> 헤더가 실린 요청은 개발 모드에서 revalidate 옵션을
                무시하고 항상 origin을 호출한다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
