import { CASES } from '../lib/cases'
import { expectedLocation, isProbeResult, judgeCase } from '../lib/judge'
import type { ExpectedStatus, Prediction, ProbeOutcome } from '../types'

interface Props {
  outcomes: Record<string, ProbeOutcome>
  predictions: Record<string, Prediction>
  pendingId: string | null
  onPredict: (id: string, p: Prediction) => void
  onRun: (id: string, path: string) => void
}

const PREDICTIONS: { value: ExpectedStatus; label: string }[] = [
  { value: 308, label: '308 영구' },
  { value: 307, label: '307 임시' },
  { value: 404, label: '일치 안 함(404)' },
]
const btn = 'rounded bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'

export function CaseTable({ outcomes, predictions, pendingId, onPredict, onRun }: Props) {
  const busy = pendingId !== null
  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-xs">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th className="px-3 py-1.5">요청 경로 (…/regex-pattern-matching 이후)</th>
            <th className="px-3 py-1.5">규칙</th>
            <th className="px-3 py-1.5">예측(선택)</th>
            <th className="px-3 py-1.5" />
            <th className="px-3 py-1.5">실측 응답</th>
          </tr>
        </thead>
        <tbody>
          {CASES.map((c) => {
            const o = outcomes[c.id]
            const ok = isProbeResult(o) ? judgeCase(c, o) : false
            const wrong = isProbeResult(o) && predictions[c.id] != null && predictions[c.id] !== o.status
            return (
              <tr key={c.id} className="border-t border-zinc-200 align-top dark:border-zinc-800">
                <td className="px-3 py-1.5">
                  <div className="font-mono text-[11px] text-zinc-900 dark:text-zinc-100">{c.path}</div>
                  <div className="text-zinc-500">{c.label}</div>
                </td>
                <td className="px-3 py-1.5 font-mono">#{c.rule}</td>
                <td className="px-3 py-1.5">
                  <select
                    aria-label={`${c.path} 예측`}
                    value={predictions[c.id] ?? ''}
                    onChange={(e) => onPredict(c.id, e.target.value ? (Number(e.target.value) as ExpectedStatus) : null)}
                    className="rounded border border-zinc-300 bg-white px-1.5 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="">예측 안 함</option>
                    {PREDICTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <button onClick={() => onRun(c.id, c.path)} disabled={busy} className={btn}>
                    {pendingId === c.id ? '요청 중...' : '요청'}
                  </button>
                </td>
                <td className="px-3 py-1.5 font-mono text-[11px]">
                  {!o && <span className="text-zinc-400">대기 중</span>}
                  {o && !isProbeResult(o) && <span className="text-rose-600">오류: {o.error}</span>}
                  {isProbeResult(o) && (
                    <div className="space-y-0.5">
                      <div className={ok ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                        {ok ? '일치' : '불일치'} · {o.status} {o.statusText}
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-400">Location: {o.location ?? '(없음)'}</div>
                      {!ok && <div className="text-zinc-500">기대: {c.expectStatus} · {expectedLocation(c) ?? '(Location 없음)'}</div>}
                      {wrong && <div className="text-amber-600">예측 {predictions[c.id]} ≠ 실제 {o.status}</div>}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
