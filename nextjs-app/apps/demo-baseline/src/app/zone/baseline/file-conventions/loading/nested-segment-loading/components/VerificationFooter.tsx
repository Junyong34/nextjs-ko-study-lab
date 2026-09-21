'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useLoadingObservation } from './LoadingObservation'
import { verifyNestedLoading } from '../verification'

const EXPECTED =
  '① 카탈로그 진입 시 상위 loading.tsx fallback 관측 → ② 카탈로그 완료 → ③ 상품 상세 진입 시 하위 loading.tsx fallback 관측 → ④ fallback이 보이는 동안 상위 레이아웃의 [상위 조작] 클릭 → ⑤ 상품 상세 완료. 다섯 단계가 같은 실행(run) 안에서 순서대로 실제 관측되어야 합니다.'

export function VerificationFooter() {
  const { activeRunId, timeline } = useLoadingObservation()
  const result = verifyNestedLoading(timeline, activeRunId)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="중첩 라우트 세그먼트 로딩 격리 검증 결과"
        expected={EXPECTED}
        actual={result.isMatched === undefined ? <>{result.reason}</> : result.reason}
        isMatched={result.isMatched}
        description="현재 실행(run)의 실제 fallback 마운트·완료·상위 조작 타임스탬프만 근거로 판정합니다. 다른 실행(run)의 기록이나 캐시로 건너뛴 관측은 증거로 인정하지 않습니다."
      />
      <DemoDeepDiveCard title="중첩 라우트 세그먼트 로딩 격리 (Nested loading.tsx)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙</h5>
            <p>
              <code>loading.tsx</code>는 같은 폴더의 <code>page.tsx</code>·<code>not-found.tsx</code>와, 하위(nested){' '}
              <code>layout.tsx</code>·<code>page.tsx</code>를 하나의 Suspense 경계로 묶어 자동 스트리밍한다. 단, 같은
              폴더의 <code>layout.tsx</code> 자체가 직접 무언가를 await한다면 그 지연은 이 경계로 감싸이지 않는다 —
              이 데모의 <code>catalog/[run]/layout.tsx</code>는 그래서 의도적으로 아무것도 await하지 않는다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실제 파일 트리와 경계 위치</h5>
            <pre className="min-w-0 overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed dark:border-zinc-800 dark:bg-zinc-900">
{`catalog/
├─ loading.tsx        [A] 상위 fallback
└─ [run]/
   ├─ layout.tsx       GNB (상위 조작, await 없음)
   ├─ page.tsx         카탈로그 목록 (지연)
   └─ [product]/
      ├─ loading.tsx     [B] 하위 fallback
      └─ page.tsx        상품 상세 (지연)`}
            </pre>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 왜 GNB가 하위 fallback 중에도 눌리는가</h5>
            <p>
              [B] 경계는 <code>catalog/[run]/layout.tsx</code>보다 더 안쪽에서 <code>[product]/page.tsx</code> 하나만
              감싼다. 그 layout은 카탈로그 목록이 처음 로드될 때 이미 [A] 경계 안에서 함께 커밋되었고, 이후 상품
              상세로 이동해도 [B] 경계 바깥에 있으므로 다시 서스펜드되지 않는다. 그래서 하위 fallback이 보이는
              동안에도 GNB의 [상위 조작] 버튼을 실제로 누를 수 있다 — 반대로 처음 카탈로그에 진입할 때는 GNB조차
              아직 화면에 없다(목록 페이지의 지연이 끝나야 [A]가 해제되며 함께 나타난다).
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. Router Cache 주의</h5>
            <p>
              같은 <code>[run]</code> 경로를 다시 방문하면 캐시로 인해 fallback이 생략되고 곧바로 완료 화면이 보일 수
              있다. 이 데모가 [새 실행 시작]을 누를 때마다 새로운 내부 경로를 만드는 이유이며, 검증 로직도 이전
              실행(run)의 기록을 이번 실행의 증거로 인정하지 않는다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
