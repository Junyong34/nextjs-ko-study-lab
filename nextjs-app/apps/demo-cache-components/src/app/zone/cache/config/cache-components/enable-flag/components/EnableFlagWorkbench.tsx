'use client'

import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useStreamProbe } from '../hooks/useStreamProbe'
import { useActivityProbe } from '../hooks/useActivityProbe'
import { judgeActivity, judgeBlocking, judgeFlag, judgeStream, judgeUseCache } from '../lib/judge'
import { StreamProbePanel } from './StreamProbePanel'
import { ActivityPanel } from './ActivityPanel'
import { Verification } from './Verification'

/**
 * Next가 next.config의 cacheComponents 값을 번들에 컴파일 타임 상수로 주입한 내부 값
 * (next/dist/build/define-env.js). 공개 API가 아니므로 관찰용으로만 읽는다.
 */
const clientFlag: unknown = process.env.__NEXT_CACHE_COMPONENTS

export function EnableFlagWorkbench({ serverFlag }: { serverFlag: unknown }) {
  const stream = useStreamProbe()
  const activity = useActivityProbe()

  const probeRuns = stream.runs.filter((r) => r.target === 'probe')
  const blockingRuns = stream.runs.filter((r) => r.target === 'blocking')
  const checks = [
    judgeFlag(serverFlag, clientFlag),
    judgeStream(probeRuns.at(-1)),
    judgeUseCache(probeRuns),
    judgeBlocking(blockingRuns.at(-1)),
    judgeActivity(activity.latestReturn),
  ]

  const handleReset = () => {
    stream.reset()
    activity.reset()
  }

  return (
    <>
      <DemoPlaygroundCard title="cacheComponents: true가 바꾸는 동작 실측">
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-[11px] text-zinc-300 dark:border-zinc-800">
            <div className="space-y-0.5">
              <div className="text-zinc-500">// apps/demo-cache-components/next.config.ts (실제 파일)</div>
              <div>
                <span className="text-blue-300">cacheComponents</span>: <span className="text-emerald-400">true</span>,
              </div>
              <div className="text-zinc-500">
                // 번들에 주입된 값 — 서버 {String(serverFlag)} / 클라이언트 {String(clientFlag)}
              </div>
            </div>
            <span className="rounded bg-amber-100 px-2 py-1 font-sans text-[11px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              이 zone에서는 항상 켜져 있습니다 (끈 상태는 재현하지 않음)
            </span>
          </div>

          <StreamProbePanel runs={stream.runs} running={stream.running} error={stream.error} onProbe={stream.probe} />

          <ActivityPanel
            instanceId={activity.instanceId}
            draft={activity.draft}
            onDraftChange={activity.setDraft}
            latestReturn={activity.latestReturn}
            returnCount={activity.returnCount}
          />

          <div className="flex justify-end">
            <DemoResetButton onReset={handleReset} />
          </div>
        </div>
      </DemoPlaygroundCard>
      <Verification checks={checks} />
    </>
  )
}
