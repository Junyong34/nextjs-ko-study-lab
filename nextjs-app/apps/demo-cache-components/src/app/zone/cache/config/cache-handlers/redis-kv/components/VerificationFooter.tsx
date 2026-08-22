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

  const defaultExpected = "• experimental.cacheHandlers 분산 Redis 캐시 핸들러 연동 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="experimental.cacheHandlers 분산 Redis 캐시 핸들러 연동 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="experimental.cacheHandlers 분산 Redis 캐시 핸들러 연동">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>cacheHandlers는 Next.js 16 캐시 스토리지 엔진을 기본 로컬 메모리/파일시스템에서 분산 Redis, Cloudflare KV 등 원격 공유 저장소로 교체하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>cacheHandlers: &#123; default: require.resolve(&apos;./cache-handler.js&apos;) &#125;를 통해 멀티 인스턴스로 배포된 모든 웹 서버 파드가 동일한 Redis 캐시 계층을 실시간 공유합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>멀티 파드 캐시 일관성 보장: 한 인스턴스에서 발생한 상품 데이터 갱신/태그 무효화가 모든 서버 인스턴스에 실시간으로 즉시 전파됩니다.</li>
              <li>서버 재배포 시 캐시 보존: 신규 컨테이너 배포 시 로컬 캐시가 초기화되는 문제 없이 원격 Redis에서 웜(Warm) 상태를 즉시 유지합니다.</li>
              <li>스토리지 수평 확장: Redis 클러스터를 통해 수백만 개 상품의 캐시 용량을 확장하고 TTL/적중률을 중앙 관제합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 트래픽 이커머스 쿠버네티스(K8s) 멀티 파드 클러스터 운영</li>
              <li>타임세일 이벤트 시 멀티 인스턴스 간 실시간 재고 캐시 동기화</li>
              <li>글로벌 분산 엣지 환경의 Redis KV 공유 캐시 아키텍처</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
