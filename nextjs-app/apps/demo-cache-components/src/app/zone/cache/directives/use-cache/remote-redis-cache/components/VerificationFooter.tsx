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

  const defaultExpected = "• 'use cache: remote' 분산 원격 캐시 계층 연동의 동작과 기대 결과를 확인합니다."
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
        title="'use cache: remote' 분산 원격 캐시 계층 연동 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                                    <DemoDeepDiveCard title="원격 분산 Redis KV 스토리지를 활용한 'use cache'">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p>Next.js 16 <code>'use cache'</code>는 로컬 프로세스 메모리뿐만 아니라 커스텀 <code>CacheHandler</code>를 통해 원격 분산 Redis KV 스토리지와 투명하게 연동되어, 다중 서버 및 글로벌 서버리스 엣지 환경에서 단일 캐시 계층을 구축하는 엔터프라이즈 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 <code>'use cache'</code>가 실행될 때 직렬화된 결과물이 외부 Redis 스토리지에 <code>HSET</code>으로 저장되고, 다른 엣지 인스턴스에서 동일 요청 수신 시 Redis에서 원격 캐시를 즉각 히트(Hit)하여 반환하는 분산 동기화 흐름을 시뮬레이션합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>글로벌 서버리스 인스턴스 간 캐시 공유</strong>: Vercel, AWS Lambda 등 수백 개로 자동 확장되는 서버리스 환경에서도 동일한 캐시 히트율을 보장합니다.</li>
                          <li><strong>배포 콜드 스타트 제거</strong>: 신규 컨테이너가 배포되어도 기존 Redis에 유지된 캐시를 즉시 활용하여 DB 과부하를 방지합니다.</li>
                          <li><strong>대용량 캐시 페이로드 지원</strong>: 로컬 Node.js 메모리 한계를 벗어나 대용량 카탈로그 데이터를 안정적으로 캐싱합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>글로벌 멀티 리전 이커머스 서비스의 전 세계 분산 상품 카탈로그</li>
                          <li>AWS Lambda / ECS 기반 오토스케일링 마이크로서비스 백엔드</li>
                          <li>대규모 프로모션 트래픽 대응을 위한 중앙 Redis 클러스터링</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>Redis 직렬화/역직렬화 오버헤드</strong>: 페이로드가 수십 MB 이상으로 너무 크면 Redis 네트워크 전송 및 JSON 파싱 비용이 증가하므로 필요한 핵심 필드만 정제하여 캐싱해야 합니다.</li>
                          <li><strong>Redis 연결 풀 관리</strong>: 서버리스 환경에서는 Redis 커넥션 고갈을 방지하기 위해 HTTP 기반 REST Redis(e.g. Upstash) 또는 커넥션 풀러를 사용해야 합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
