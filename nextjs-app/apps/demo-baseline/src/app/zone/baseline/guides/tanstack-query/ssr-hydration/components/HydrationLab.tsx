'use client'
import React, { useRef } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useHydrationProbe } from '../hooks/useHydrationProbe'
import { useStaleProbes } from '../hooks/useStaleProbes'
import { BASE } from '../lib/deals-query'
import type { ServerRenderInfo } from '../types'
import { DealsList } from './DealsList'
import { ModeNav } from './ModeNav'
import { StaleProbe } from './StaleProbe'
import { VerificationFooter } from './VerificationFooter'

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'

export function HydrationLab({ info }: { info: ServerRenderInfo }) {
  const listRef = useRef<HTMLDivElement>(null)
  const probe = useHydrationProbe(info, listRef)
  const stale = useStaleProbes(info.variant)
  const prefetched = info.variant === 'prefetched'

  const reset = async () => {
    // 서버 읽기 기록을 비우고 문서를 새로 받는다 — 초기 HTML이 학습 대상이라 새로고침이 곧 초기화다.
    await fetch(`${BASE}/api/reads`, { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="서버 prefetch와 HydrationBoundary"
        concept="서버 컴포넌트가 요청마다 새 QueryClient로 데이터를 미리 받아(prefetch) dehydrate한 상태를 HydrationBoundary로 넘기면, 브라우저의 useQuery는 첫 렌더부터 그 캐시를 읽는다. 초기 HTML에 데이터가 들어 있고 하이드레이션 뒤 추가 요청이 없는지, 클라이언트에서만 가져오는 대조군과 나란히 잰다."
        steps={[
          { step: 1, title: '이 화면(prefetch) 판정 보기', description: '하이드레이션 직후 DOM 행 수, queryClient 상태, api/deals 요청 수, 서버 읽기 기록이 자동으로 측정됩니다.', actionBadge: '자동 측정', observe: '행 4개 · 요청 0건', observeAt: 'verification' },
          { step: 2, title: '[응답 HTML 검사]', description: '이 라우트의 HTML을 다시 받아 상품 행과 dehydrated state(queryKey)가 들어 있는지 확인합니다.', actionBadge: 'HTML 확인' },
          { step: 3, title: 'staleTime 구독 추가', description: '같은 키를 staleTime 0과 60초로 각각 구독해, 데이터 나이에 따라 재요청이 생기는지 봅니다.', actionBadge: 'staleTime', observe: '0이면 1건, 60초면 0건', observeAt: 'network' },
          { step: 4, title: '대조군 탭으로 이동', description: 'prefetch 없는 라우트는 로딩 표시 후 브라우저가 api/deals를 1번 요청합니다. 새로고침해 하드 로드로도 비교해 보세요.', actionBadge: '대조군' },
        ]}
      />
      <DemoPlaygroundCard title={prefetched ? '오늘의 특가 — page.tsx에서 prefetch' : '오늘의 특가 — client-only/page.tsx (prefetch 없음)'}>
        <div className="space-y-3">
          <ModeNav current={info.variant} />
          <div ref={listRef} className="min-h-40 rounded-md border border-zinc-200 dark:border-zinc-800">
            <DealsList variant={info.variant} />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button className={btn} onClick={() => void probe.checkHtml()}>응답 HTML 검사</button>
            <button className={btn} onClick={() => stale.add(0)}>staleTime: 0 구독 추가</button>
            <button className={btn} onClick={() => stale.add(60_000)}>staleTime: 60초 구독 추가</button>
            <DemoResetButton onReset={reset} />
          </div>
          {stale.runs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {stale.runs.map((r) => (
                <StaleProbe key={r.id} variant={info.variant} run={r} />
              ))}
            </div>
          )}
          <p className="text-[11px] text-zinc-500">
            [응답 HTML 검사]는 이 라우트를 한 번 더 서버 렌더하므로 서버 읽기 기록이 1회 늘어납니다(판정은 첫 측정값으로 고정). 실습 화면의 링크는 실제 라우트 이동이며, 처음 연 화면이 아니면 HTML 대신 RSC Payload로 데이터가 전달됩니다.
          </p>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter info={info} probe={probe} stale={stale} />
    </DemoContainer>
  )
}
