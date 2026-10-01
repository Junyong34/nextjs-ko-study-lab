'use client'

import Link from 'next/link'
import type { ActivityReturn } from '../types'
import { ACTIVITY_LAB_ATTR, AWAY_PATH } from '../lib/routes'

interface ActivityPanelProps {
  instanceId: string
  draft: string
  onDraftChange: (value: string) => void
  latestReturn: ActivityReturn | null
  returnCount: number
}

export function ActivityPanel({ instanceId, draft, onDraftChange, latestReturn, returnCount }: ActivityPanelProps) {
  const labAttr = { [ACTIVITY_LAB_ATTR]: '' }

  return (
    <section
      {...labAttr}
      data-instance-id={instanceId}
      className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <div>
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">B. 내비게이션과 &lt;Activity&gt; — 떠났다 돌아와도 state 유지</h4>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          cacheComponents가 켜져 있으면 Next.js는 떠난 라우트를 언마운트하지 않고 React <code>&lt;Activity mode=&quot;hidden&quot;&gt;</code>로
          숨깁니다(최대 3개 라우트). 아래 입력값과 인스턴스 ID는 이 컴포넌트의 <code>useState</code> 값입니다.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-1 flex-col gap-1 text-[11px] text-zinc-600 dark:text-zinc-400">
          배송 요청 메모 (임시 입력값)
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="예: 문 앞에 놓아 주세요"
            className="rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>
        <Link
          href={AWAY_PATH}
          aria-disabled={draft === ''}
          onClick={(e) => draft === '' && e.preventDefault()}
          className={`rounded px-3 py-1.5 text-xs font-bold ${
            draft === ''
              ? 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          다른 라우트로 이동
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-2 font-mono text-[11px] sm:grid-cols-3">
        <div className="rounded border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
          인스턴스 ID <span className="font-bold text-blue-700 dark:text-blue-300">{instanceId}</span>
        </div>
        <div className="rounded border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
          복귀 관측 {returnCount}회
        </div>
        <div className="rounded border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
          {latestReturn
            ? `away에서 본 이전 DOM: ${latestReturn.obs.hiddenByDisplayNone ? 'display: none' : latestReturn.obs.foundLab ? '보임' : '없음'}`
            : 'away 관측 없음'}
        </div>
      </div>
    </section>
  )
}
