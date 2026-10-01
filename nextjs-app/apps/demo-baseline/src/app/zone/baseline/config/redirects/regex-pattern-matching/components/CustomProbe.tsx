import { isProbeResult } from '../lib/judge'
import type { ProbeOutcome } from '../types'

interface Props {
  path: string
  onPathChange: (path: string) => void
  outcome: ProbeOutcome | null
  busy: boolean
  onRun: () => void
}

export function CustomProbe({ path, onPathChange, outcome, busy, onRun }: Props) {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
      <label className="flex flex-wrap items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
        직접 입력
        <span className="font-mono font-normal text-zinc-500">…/regex-pattern-matching</span>
        <input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          className="min-w-52 flex-1 rounded border border-zinc-300 bg-white px-2 py-1 font-mono dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          onClick={onRun}
          disabled={busy}
          className="rounded bg-zinc-900 px-2.5 py-1 font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          요청
        </button>
      </label>
      <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
        {!outcome && '위 규칙에 맞을 법한(또는 아슬아슬하게 어긋나는) 경로를 직접 넣어 보세요. 판정 없이 실측값만 표시합니다.'}
        {outcome && !isProbeResult(outcome) && <span className="text-rose-600">오류: {outcome.error}</span>}
        {isProbeResult(outcome) && (
          <>
            {outcome.status} {outcome.statusText} · Location: {outcome.location ?? '(없음)'}
            {outcome.refresh && ` · Refresh: ${outcome.refresh}`} · {outcome.elapsedMs}ms
          </>
        )}
      </div>
    </div>
  )
}
