import React from 'react'
import { TRANSPORT_LABEL, SCENARIOS } from '../lib/scenarios'
import { judgeOne } from '../lib/judge'
import type { ProbeResult } from '../types'

const mark = (ok: boolean | undefined) => (ok === undefined ? '[ ]' : ok ? '[O]' : '[X]')

export function ScenarioTable({
  results,
  pending,
  onRun,
}: {
  results: Record<string, ProbeResult>
  pending: boolean
  onRun: (ids: string[]) => void
}) {
  return (
    <ul className="space-y-2">
      {SCENARIOS.map((s) => {
        const r = results[s.id]
        const v = judgeOne(s, r)
        const t = r?.body?.tenant
        return (
          <li key={s.id} className="rounded border border-zinc-200 p-2.5 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold">{mark(v.ok)}</span>
              <span className="text-xs font-semibold">{s.title}</span>
              <span className="font-mono text-[10px] text-zinc-500">{TRANSPORT_LABEL[s.transport]}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() => onRun([s.id])}
                className="ml-auto rounded border border-zinc-300 px-2 py-0.5 text-[11px] disabled:opacity-50 dark:border-zinc-700"
              >
                실행
              </button>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">{s.note}</p>
            {r && (
              <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <span>{v.detail}</span>
                {t && (
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-white" style={{ background: t.primary }}>
                    {t.name}
                  </span>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
