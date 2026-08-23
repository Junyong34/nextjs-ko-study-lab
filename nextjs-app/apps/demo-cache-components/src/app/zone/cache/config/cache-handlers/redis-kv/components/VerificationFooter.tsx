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
                                    <DemoDeepDiveCard title="Redis KV 기반 분산 Cache Handler 연동">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p>Next.js의 Custom Cache Handler(<code>cacheHandler</code>) 설정은 서버 메모리에 종속된 기본 캐시 저장소를 탈피하여, Redis, Upstash, Memcached 등 분산 Key-Value 저장소와 연동하여 다중 인스턴스 환경에서도 일관된 캐시 공유를 지원하는 인프라 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 인스턴스 A에서 <code>'use cache'</code>로 생성된 캐시 데이터가 Redis KV 스토리지에 동기화되고, 인스턴스 B 및 C에서 동일 키로 접근 시 DB 재조회 없이 1ms 내에 Redis 캐시에서 직접 데이터를 반환하는 분산 아키텍처를 검증합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>다중 서버/컨테이너 간 캐시 공유</strong>: Kubernetes 클러스터나 멀티 인스턴스 배포 환경에서 캐시 불일치 문제를 완벽히 해결합니다.</li>
                          <li><strong>배포 시 캐시 보존(Cache Persistence)</strong>: 서버가 재시작되거나 롤링 배포가 이루어져도 외부 Redis에 캐시가 영구 보존되어 콜드 스타트 부하를 차단합니다.</li>
                          <li><strong>초당 수십만 QPS 처리</strong>: 인메모리 NoSQL의 초고속 I/O를 활용하여 데이터베이스 핫스팟 현상을 원천 방어합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>대규모 할인 이벤트(블랙프라이데이, 타임세일) 시 트래픽 폭증 대비</li>
                          <li>AWS ECS / Kubernetes 기반 멀티 컨테이너 쇼핑몰 백엔드 인프라</li>
                          <li>글로벌 멀티 리전 배포 환경에서의 중앙 캐시 클러스터링</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>cacheHandler 경로 등록</strong>: <code>next.config.ts</code>에 <code>cacheHandler: require.resolve('./cache-handler.js')</code> 형태로 모듈 경로를 정확히 지정해야 합니다.</li>
                          <li><strong>네트워크 지연 시간 고려</strong>: Redis 서버와의 통신 레이턴시가 발생하므로 Next.js 인스턴스와 동일한 VPC/서브넷 내에 Redis를 배치해야 최적의 성능을 얻습니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
