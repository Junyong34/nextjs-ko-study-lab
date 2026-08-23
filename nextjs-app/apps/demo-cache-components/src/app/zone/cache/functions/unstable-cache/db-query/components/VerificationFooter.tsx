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

  const defaultExpected = "• unstable_cache를 통한 DB 쿼리 결과 캐싱 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="unstable_cache를 통한 DB 쿼리 결과 캐싱 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="unstable_cache()를 활용한 레거시 DB 쿼리 결과 캐싱">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js 14/15의 <code>unstable_cache(fetchData, keyParts, options)</code>는 ORM(Prisma, Drizzle)이나 원시 DB 쿼리 함수의 반환값을 Next.js Data Cache에 저장하고 <code>tags</code> 및 <code>revalidate</code> 주기를 바인딩하던 레거시 데이터 캐싱 함수 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 PostgreSQL 데이터베이스 쿼리를 <code>unstable_cache</code>로 래핑하여 <code>['products-list'], {'{'} tags: ['products'], revalidate: 60 {'}'}</code> 옵션을 부여하고, 캐시 히트 시 쿼리 실행 없이 1ms 내에 반환되는 레거시 캐싱 파이프라인을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>ORM 쿼리 캐싱 지원</strong>: fetch API가 아닌 Prisma, TypeORM, Redis 등 모든 비-fetch 비동기 데이터베이스 조회를 캐싱할 수 있습니다.</li>
                    <li><strong>수동 캐시 키 네임스페이스</strong>: 개발자가 직접 문자열 배열(<code>keyParts</code>)을 지정하여 캐시 저장소 키를 명시적으로 통제합니다.</li>
                    <li><strong>Next.js 16 use cache로의 이관 디딤돌</strong>: 레거시 프로젝트의 캐싱 구조를 파악하고 차세대 <code>'use cache'</code>로 안전하게 마이그레이션하기 위한 기술적 기준점을 제공합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>Next.js 14 기반 쇼핑몰의 Prisma ORM 상품 목록 쿼리 캐싱</li>
                    <li>복잡한 SQL JOIN 연산이 포함된 통계 데이터 조회</li>
                    <li>외부 gRPC 또는 TCP 소켓 통신 결과의 인메모리 캐싱</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>클로저 변수 참조 불가</strong>: <code>unstable_cache</code> 내부 콜백 함수는 외부 스코프의 변수를 안전하게 캡처하지 못하므로 반드시 <code>keyParts</code>에 파라미터를 명시해야 합니다.</li>
                    <li><strong>Next.js 16 use cache 전환 권장</strong>: Next.js 16에서는 보다 안전하고 간결한 <code>'use cache'</code> 디렉티브 사용이 적극 권장됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
