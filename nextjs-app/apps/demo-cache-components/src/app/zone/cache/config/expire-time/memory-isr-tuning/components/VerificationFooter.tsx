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

  const defaultExpected = "• expireTime 메모리 ISR 캐시 보존 기간 튜닝의 동작과 기대 결과를 확인합니다."
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
        title="expireTime 메모리 ISR 캐시 보존 기간 튜닝 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                                    <DemoDeepDiveCard title="expireTime 튜닝을 통한 메모리 캐시 GC 최적화">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p><code>next.config.ts</code>의 <code>expireTime</code>(또는 <code>cacheLife.expire</code>) 설정은 캐시된 데이터가 더 이상 revalidation되지 않고 서버 메모리/디스크에서 완전히 폐기(Garbage Collection)되는 만료 한계 시간을 튜닝하여 인스턴스 OOM(Out of Memory)을 방지하는 메모리 최적화 스펙입니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>본 데모에서는 수천 개의 동적 상품 ID에 대해 캐시가 생성될 때, <code>expireTime: 300</code>(5분) 설정에 따라 접근이 없는 오래된 캐시 청크들이 메모리에서 안전하게 정리되고 활성 캐시만 유지되는 메모리 사용량 추이를 검증합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>서버 메모리 누수 및 OOM 방지</strong>: 트래픽이 급증하여 무수히 많은 캐시 엔트리가 생성되어도 만료된 데이터가 제때 폐기되어 서버 안정성을 유지합니다.</li>
                          <li><strong>스토리지 자원 절감</strong>: 디스크 및 Redis 인메모리 저장소의 불필요한 좀비 캐시 점유율을 최소화합니다.</li>
                          <li><strong>장기 미조회 데이터의 자동 정리</strong>: 단발성 검색어나 비인기 상품의 캐시가 메모리를 영구 점유하지 않도록 자동 정리 파이프라인을 구축합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>수백만 개의 롱테일(Long-tail) 상품 카탈로그를 운영하는 대형 마켓플레이스</li>
                          <li>일회성 검색 쿼리 결과 및 사용자별 임시 필터 데이터 캐싱</li>
                          <li>메모리 리소스가 제한적인 경량 서버리스 컨테이너 환경</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>revalidate와 expire의 차이 이해</strong>: <code>revalidate</code>는 새 데이터를 백그라운드에서 가져오기 시작하는 시점이고, <code>expire</code>는 캐시를 완전히 버리고 동기적으로 새로 계산하는 최종 만료 시점입니다.</li>
                          <li><strong>과도하게 짧은 expire 설정 주의</strong>: expireTime을 너무 짧게 잡으면 캐시 히트율이 급감하여 백엔드 원본 DB로 요청이 쏟아지는 캐시 스탬피드(Cache Stampede) 현상이 발생할 수 있습니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
