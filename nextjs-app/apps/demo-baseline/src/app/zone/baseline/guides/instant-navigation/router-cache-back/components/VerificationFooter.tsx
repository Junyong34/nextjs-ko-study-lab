'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useRouterCacheLab } from './RouterCacheProvider'
import { GROUP_LABEL, afterRefreshRecords, averageMs, evaluate, recordsOf } from '../verification'
import { SERVER_DELAY_MS, type NavGroup } from '../types'

const GROUPS: NavGroup[] = ['history', 'link', 'refresh']

const TREE = `router-cache-back/layout.tsx   ← 공유 layout (조작부·측정기, 이동 중 유지)
├─ page.tsx                   ← 시작 화면 (측정 제외)
├─ catalog/page.tsx           ← 동적: await connection() + ${SERVER_DELAY_MS}ms, 요청마다 새 렌더 ID
└─ product/page.tsx           ← 동적: 동일

브라우저 Client Cache (메모리)
  history 항목 A ─ catalog RSC 페이로드 (렌더 ID x)  ← 뒤로 가기 시 그대로 재사용
  history 항목 B ─ product RSC 페이로드 (렌더 ID y)  ← 앞으로 가기 시 그대로 재사용`

export function VerificationFooter() {
  const { records } = useRouterCacheLab()
  const verdict = evaluate(records)
  const postRefresh = afterRefreshRecords(records)

  const actual = (
    <div className="space-y-1">
      {GROUPS.map((g) => {
        const rows = recordsOf(records, g)
        const rsc = rows.map((r) => r.rscCount ?? 0)
        const reused = rows.filter((r) => r.reused).length
        return (
          <div key={g}>
            • {GROUP_LABEL[g]}:{' '}
            {rows.length === 0
              ? '측정 전'
              : `${rows.length}회 / RSC 요청 ${rsc.join('·')}건 / 렌더 ID 재사용 ${reused}회 / 평균 ${averageMs(rows)}ms (${rows[rows.length - 1].mode})`}
          </div>
        )
      })}
      <div>
        • 관찰(판정 제외) refresh 이후 뒤로/앞으로:{' '}
        {postRefresh.length === 0
          ? '기록 없음'
          : `${postRefresh.length}회 / RSC 요청 ${postRefresh.map((r) => r.rscCount ?? 0).join('·')}건 / 렌더 ID 재사용 ${postRefresh.filter((r) => r.reused).length}회`}
      </div>
      <div className="pt-1 text-[11px] opacity-80">{verdict.reasons.join(' ')}</div>
    </div>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="뒤로/앞으로 복원 vs 새 진입 vs refresh"
        expected={
          <div className="space-y-1">
            <div>• 뒤로/앞으로: RSC 요청 0건, 이전 렌더 ID 그대로 (서버 재렌더 없음)</div>
            <div>• &lt;Link&gt; 새 진입: RSC 요청 1건 이상, 새 렌더 ID (동적 page는 캐시 안 됨)</div>
            <div>• router.refresh(): RSC 요청 1건 이상, 새 렌더 ID</div>
            <div>• 평균 소요: 뒤로/앞으로 &lt; &lt;Link&gt; 새 진입 (서버 대기 {SERVER_DELAY_MS}ms 포함)</div>
            <div>• 관찰 항목: refresh 뒤, 그 전에 떠났던 경로로 뒤로/앞으로 가면 캐시가 비워져 다시 요청됨</div>
          </div>
        }
        actual={actual}
        isMatched={verdict.isMatched}
        description="세 방식을 각각 한 번 이상 실행하면 판정합니다. 모든 값은 이 브라우저가 Resource Timing API와 서버가 준 렌더 ID로 직접 측정한 것입니다."
      />
      <DemoDeepDiveCard title="가이드 관점: 같은 page라도 '어떻게 도착했는가'에 따라 서버 요청이 달라진다" className="min-w-0">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. Client Cache의 두 가지 규칙</h5>
            <p>
              Client Cache는 방문했거나 prefetch한 경로의 RSC 페이로드를 브라우저 메모리에 보관합니다. 공식 용어집은
              &quot;page는 기본적으로 캐시되지 않지만 브라우저 뒤로/앞으로 이동에서는 재사용된다&quot;고 정리합니다. Next.js 15부터
              &lt;Link&gt;·router.push로 이동할 때는 page 세그먼트를 캐시에서 꺼내 쓰지 않으며(staleTimes.dynamic 기본값 0초), 뒤로/앞으로
              이동은 레이아웃 이동과 스크롤 위치 손실을 막기 위해 staleTimes 설정과 무관하게 캐시를 씁니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 파일 구조와 캐시 항목</h5>
            <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-200">{TREE}</pre>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. router.refresh()와 dev/production 차이</h5>
            <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
              <li>router.refresh()는 서버에 새로 요청해 현재 page를 다시 렌더합니다. useState와 스크롤은 유지되지만 서버 쪽 데이터 캐시는 무효화하지 않습니다. 서버 데이터까지 새로 받으려면 revalidatePath/revalidateTag를 씁니다.</li>
              <li>공식 문서는 refresh가 &quot;현재 경로의 Client Cache를 지운다&quot;고 설명합니다. 16.3.2 실측에서는 refresh 전에 떠났던 다른 히스토리 항목도 다음 뒤로/앞으로 이동 때 서버에 다시 요청했습니다(측정표의 &quot;refresh 이후 복원&quot;). 그래서 이 행은 판정에서 빼고 관찰값으로만 보여줍니다.</li>
              <li>뒤로/앞으로 복원은 dev와 production 모두 서버 요청 0건입니다. dev는 자동 prefetch가 없고 경로를 처음 열 때 컴파일 시간이 더해지며, 이동→커밋 시간도 production보다 깁니다(측정표 참고).</li>
              <li>production은 화면에 보이는 &lt;Link&gt;의 경로 트리를 자동 prefetch하지만, Cache Components 없는 동적 page는 loading.tsx가 없으면 page 데이터를 prefetch하지 않아 클릭 시 서버 왕복이 남습니다. refresh 직후에는 캐시가 비워져 보이는 링크를 다시 prefetch하므로, 측정표는 도착 경로 요청만 &quot;RSC 요청&quot;으로 세고 나머지는 &quot;다른 경로&quot;로 따로 표시합니다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 체크리스트</h5>
            <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
              <li>목록 → 상세 → 뒤로 흐름은 추가 코드 없이 즉시 복원됩니다. 뒤로 왔을 때 최신 데이터가 꼭 필요하면 복원된 화면에서 router.refresh()를 호출하는 식으로 명시적으로 갱신합니다.</li>
              <li>뒤로 가기 화면이 &quot;예전 값&quot;을 보여주는 것은 버그가 아니라 설계입니다. 데이터 변경 뒤에는 Server Action에서 revalidatePath/updateTag로 캐시를 무효화하면 Client Cache도 함께 비워집니다.</li>
              <li>&lt;Link&gt; 재진입까지 캐시하고 싶다면 next.config의 experimental.staleTimes.dynamic을 늘릴 수 있지만 앱 전역 설정이므로 신중히 결정합니다(이 데모 앱은 기본값 사용).</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
