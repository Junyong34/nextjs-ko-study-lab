'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  description?: string
}

export function VerificationFooter({ isMatched, expected, actual, description }: VerificationFooterProps = {}) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="'use cache: remote' 공유 캐시 풀 검증 결과"
        expected={expected ?? "3개 화면이 각자 호출해도 같은 캐시 엔트리를 공유하므로 cacheId·재고 값이 모두 동일해야 한다."}
        actual={actual ?? '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'}
        isMatched={isMatched}
        description={description ?? '3개 화면이 읽은 cacheId와 재고 값을 나란히 대조합니다.'}
      />
      <DemoDeepDiveCard title="cacheHandlers 미설정 시 기본 in-memory 원격 캐시 풀">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js 16 <code>&apos;use cache: remote&apos;</code>는 <code>next.config</code>의{' '}
              <code>cacheHandlers.remote</code>를 설정하면 Redis 같은 실제 원격 스토리지를 쓰지만,
              설정하지 않으면 <code>&apos;use cache&apos;</code>(<code>cacheHandlers.default</code>)와는
              별개의 기본 in-memory LRU 캐시 풀을 씁니다. 이 데모(로컬 dev)는 후자에 해당합니다 — 여러
              서버 프로세스나 리전에 걸친 진짜 분산 스토리지가 아닙니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              화면 A·B·C는 각자 독립적으로 인자 없는 <code>getRemoteStockSnapshot()</code>을 호출합니다.
              함수에는 같은 <code>cacheTag(&apos;remote-redis-cache:stock&apos;)</code>가 붙어 있고 인자가
              없어 캐시 키가 동일하므로, 세 호출은 하나의 캐시 엔트리를 공유합니다 — 그래서 cacheId가
              전부 같게 나옵니다. [주문 구매] 버튼은 Server Action에서 재고를 실제로 차감한 뒤{' '}
              <code>revalidateTag(&apos;remote-redis-cache:stock&apos;, &apos;max&apos;)</code>를 호출해 그
              엔트리를 stale로 표시합니다. 이 데모는 리전 간 실시간 동기화를 증명하는 것이 아니라, &quot;여러
              화면이 같은 공유 캐시 풀을 읽는다&quot;는 사실만 증명합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>인스턴스 간 캐시 공유</strong>: 운영 환경에서 <code>cacheHandlers.remote</code>로
                Redis 등을 연결하면, 서버리스처럼 여러 인스턴스가 각자 콜드 스타트해도 같은 캐시를 공유합니다.
              </li>
              <li>
                <strong>태그 기반 무효화</strong>: <code>cacheTag</code>/<code>revalidateTag</code>로 특정
                데이터만 선택해 무효화할 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>요청 시점(request time)까지 지연되는 컴포넌트에서 반복 조회되는 데이터</li>
              <li>속도 제한이 있는 업스트림 API나 느린 백엔드를 보호해야 하는 경우</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              5. 실무 주의사항 및 핵심 팁 (Caution & Tips)
            </h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>cacheHandlers 미설정 = in-memory</strong>: 이 데모처럼 <code>cacheHandlers.remote</code>를
                설정하지 않으면 &apos;use cache: remote&apos;도 단일 프로세스 메모리에 저장됩니다. 진짜
                다중 서버 공유가 필요하면 Redis 등으로 <code>cacheHandlers.remote</code>를 직접 구현해야
                합니다.
              </li>
              <li>
                <strong>stale-while-revalidate</strong>: <code>revalidateTag(tag, &apos;max&apos;)</code>는
                엔트리를 즉시 지우지 않고 stale로만 표시합니다. 다음 방문에서 새 값을 반영하므로, 새로고침을
                한 번 더 해야 갱신이 보일 수 있습니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
