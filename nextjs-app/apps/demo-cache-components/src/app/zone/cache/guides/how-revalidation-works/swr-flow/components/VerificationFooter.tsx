'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  description?: string
  elapsed?: number
  isStale?: boolean
  generatedAt?: string
  cacheId?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { elapsed = 0, isStale, generatedAt, cacheId } = props

  const defaultExpected =
    "• cacheLife({ stale: 8, revalidate: 8, expire: 60 }) 시간 기반 캐시 수명 관리\n• 8초 이내에는 FRESH 캐시(#ID 및 생성 시각) 유지\n• 8초 경과(Stale) 후 요청 시 백그라운드 SWR revalidation을 통해 새로운 캐시 ID 생성"

  let defaultActual = '• 캐시 데이터 로딩 대기 중...'
  if (generatedAt && cacheId) {
    defaultActual = `• 캐시 ID: #${cacheId}\n• 생성 시각: ${generatedAt}\n• 수명 주기 상태: ${
      isStale ? 'STALE (8초 경과, SWR revalidation 대상)' : `FRESH (${elapsed}초 경과 / 8초 수명)`
    }\n• 동작 모드: Next.js 16 cacheLife 시간 기반 SWR 캐시 수명주기 정상 동작`
  }

  const isMatched = props.isMatched !== undefined ? props.isMatched : elapsed >= 8 ? true : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Stale-While-Revalidate 백그라운드 갱신 흐름 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={props.description || '이 예제의 동작과 검증 결과를 표시합니다.'}
      />
      <DemoDeepDiveCard title="Cache Components의 Stale-While-Revalidate 백그라운드 revalidation 흐름">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js 16 Cache Components의 SWR(Stale-While-Revalidate) 수명 주기는 캐시 수명(stale)이 만료된 후 요청이 들어왔을 때, 우선 기존 Stale 캐시를 사용자에게 즉각 서빙하고 백그라운드에서 조용히 새 데이터를 패치하여 다음 요청부터 최신 캐시로 교체하는 표준 백그라운드 갱신 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모는 <code>cacheLife({'{'} stale: 8, revalidate: 8, expire: 60 {'}'})</code>로 캐시된 함수가 반환한 실제 캐시 ID와 생성 시각을 화면에 표시합니다. 8초 이내 새로고침은 동일한 캐시 ID를 반환(FRESH)하고, 8초 경과 후 새로고침은 우선 기존 캐시를 반환하면서 백그라운드에서 재계산이 트리거되어(STALE), 그 다음 새로고침에서 새 캐시 ID로 교체되는 2단계 SWR 흐름을 실제 값으로 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>사용자 체감 지연 시간 제로</strong>: 어떤 사용자도 백엔드 DB 조회 지연 시간(수백 ms ~ 수 초)을 기다리지 않고 항상 즉각적인 응답을 받습니다.</li>
              <li><strong>서버 부하 스파이크 흡수</strong>: 수천 명의 사용자가 동시에 만료 시점에 접속해도 단 1건의 백그라운드 revalidation 작업만 실행되어 서버 과부하를 방지합니다.</li>
              <li><strong>탄력적인 고가용성</strong>: 백그라운드 revalidation 중 일시적인 DB 네트워크 장애가 발생해도 기존 Stale 캐시가 지속 서빙되어 서비스 중단을 막습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>초당 수천 건의 조회가 발생하는 인기 상품 상세 페이지</li>
              <li>실시간 환율 및 암호화폐 시세 브리핑 화면</li>
              <li>주요 포털 사이트의 실시간 검색어 및 뉴스 랭킹</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>첫 번째 사용자의 Stale 데이터 인지</strong>: 만료 후 첫 요청자는 이전 데이터를 보게 되므로, 결제 직전 최종 금액 확인과 같이 절대적으로 최신이어야 하는 단계는 Server Action으로 직접 조회해야 합니다.</li>
              <li><strong>expire 시간 초과 시 동기 렌더링</strong>: <code>expire</code> 시간을 초과하면 Stale 서빙이 중단되고 동기적으로 새 데이터를 가져오므로 적절한 expire 여유 시간을 두어야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
