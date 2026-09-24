'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { SCENARIOS } from '../scenarios'
import type { ScenarioResult } from '../hooks/useTriggerRunner'

interface Props {
  results: Record<string, ScenarioResult>
  isRunning: boolean
}

const TREE = `programmatic-not-found/
├─ [id]/
│  ├─ not-found.tsx        ← 경계 "product-[id]"
│  ├─ page.tsx             ← generateMetadata(draft) + page(없는 id, private)
│  ├─ actions.ts           ← Server Action(작성자 아님)
│  └─ reviews/[reviewId]/
│     └─ page.tsx          ← 없는 리뷰 (자기 not-found.tsx 없음 → 위로 전파)
├─ api/probe/route.ts      ← 서버 카운터 조회/초기화
└─ lib/probe-store.ts      ← notFound() 직전/다음 줄 카운터`

export function VerificationFooter({ results, isRunning }: Props) {
  const done = SCENARIOS.filter((s) => results[s.key])
  const complete = done.length === SCENARIOS.length && !isRunning
  const failed = done.filter((s) => !results[s.key].matched)

  const expected = (
    <span>
      {[
        '• page.tsx(없는 id·비공개)·하위 세그먼트: 문서 요청 404',
        '• generateMetadata(초안): 브라우저 UA는 metadata 스트리밍이라 200, 화면은 경계로 교체',
        '• 대조군 P-100을 뺀 6개 모두 경계 식별자 product-[id]',
        '• notFound() 직전 줄 +1, 다음 줄 +0 (never 반환 = throw)',
        '• Link 이동: 문서 재요청 없이 같은 경계',
        '• Server Action: POST 404, URL 유지, 현재 페이지 트리 재렌더(+1)',
      ].join('\n')}
    </span>
  )

  const actual = (
    <span>
      {done.length === 0
        ? '• [전체 트리거 실측 실행]을 누르면 실제 측정값이 표시됩니다.'
        : SCENARIOS.map((s) => {
            const r = results[s.key]
            if (!r) return `• ${s.condition}: 대기`
            const status = s.mode === 'soft' ? `새로고침 없음=${r.noReload}, RSC ${r.status ?? '-'}` : s.mode === 'action' ? `POST ${r.status ?? '-'}` : r.status
            return `• ${s.condition}: ${status} / ${r.boundary ?? r.renderedRoute ?? '-'} / 직전 +${r.reachedDelta} 다음 +${r.afterDelta}${r.matched ? '' : ' ← 불일치'}`
          }).join('\n')}
    </span>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="호출 위치·조건별 notFound() 트리거 검증"
        expected={expected}
        actual={actual}
        isMatched={complete ? failed.length === 0 : undefined}
        description={
          complete
            ? failed.length === 0
              ? '7개 트리거 모두 기대한 상태 코드·경계·카운터와 일치했습니다.'
              : `${failed.length}개 트리거가 기대와 다릅니다. 표의 빨간 값을 확인하세요.`
            : '실측 전이거나 진행 중입니다. 값은 모두 실제 iframe DOM과 서버 카운터(api/probe)에서 읽습니다.'
        }
      />
      <DemoDeepDiveCard title="notFound()는 어디서 호출하든 throw이고, 가장 가까운 not-found 경계가 받는다">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 메커니즘</h5>
            <p>
              <code>notFound()</code>는 <code>NEXT_HTTP_ERROR_FALLBACK;404</code> 오류를 던지고 반환 타입이 <code>never</code>입니다.
              그래서 <code>return notFound()</code>가 필요 없고, 호출 다음 줄(<code>markAfterNotFound</code>)은 한 번도 실행되지 않습니다.
              던져진 오류는 호출한 세그먼트에서 위로 올라가며 처음 만나는 <code>not-found.tsx</code>가 화면을 대신합니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 파일 구조와 경계 선택</h5>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] dark:bg-zinc-900">{TREE}</pre>
            <p className="mt-1">
              <code>reviews/[reviewId]</code>에는 자기 not-found.tsx가 없어서 한 단계 위의 <code>[id]/not-found.tsx</code>가 렌더됩니다.
              상품 P-100은 멀쩡히 존재해도 경계는 <code>[id]</code> 세그먼트 전체 자리를 차지합니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 호출 위치별로 달라지는 점</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><strong>page.tsx 본문</strong>: 응답이 시작되기 전에 던지므로 문서 요청이 실제 HTTP 404가 됩니다.</li>
              <li>
                <strong>generateMetadata</strong>: Next.js 16은 브라우저 UA에 metadata를 스트리밍하므로 셸이 이미 200으로 나간 뒤
                던져집니다. page.tsx도 병렬로 끝까지 렌더되고(카운터로 확인), 브라우저가 경계로 교체합니다. 응답에는
                <code> noindex</code>가 붙습니다. <code>facebookexternalhit</code> 같은 HTML 전용 봇 UA에서는 metadata가 렌더를 막으므로 404입니다.
                그래서 404가 필요하면 page 본문에서도 같은 검사를 해야 합니다.
              </li>
              <li><strong>Link 소프트 내비게이션</strong>: 문서를 다시 받지 않고 RSC 요청 결과로 같은 경계가 그려집니다.</li>
              <li>
                <strong>Server Action</strong>: POST 응답이 404로 오고 URL은 그대로입니다. Next.js는 현재 페이지 RSC 트리를 다시
                렌더해 함께 보내므로(page.tsx 카운터 +1) 액션을 호출한 화면 기준 가장 가까운 경계가 그려집니다.
              </li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>로깅·정리 작업은 notFound() <em>이전</em>에 둡니다. 이후 코드는 실행되지 않습니다.</li>
              <li><code>try/catch</code>로 감싸면 오류가 삼켜져 경계가 렌더되지 않습니다. 필요하면 <code>unstable_rethrow</code>를 먼저 호출합니다.</li>
              <li>비공개·권한 없음을 403 대신 404로 응답하면 리소스 존재 여부 자체를 숨길 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
