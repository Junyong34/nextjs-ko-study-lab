import type { ProbeEntry } from '../types'

const short = (s: string | null) => (s ? s.replace('/zone/baseline/config/redirects/header-query-condition', '…') : '(없음)')

function describeSent(e: ProbeEntry) {
  const { sent } = e.outcome
  const extra = Object.entries(sent.headers).map(([k, v]) => `${k}: ${v}`)
  return [`GET ${short(sent.pathname)}${sent.search}`, `host: ${sent.host}`, ...extra].join('\n')
}

export function ResultLog({ history }: { history: ProbeEntry[] }) {
  if (history.length === 0) {
    return <div className="rounded border border-dashed border-zinc-300 p-3 text-xs text-zinc-500 dark:border-zinc-700">[서버에서 실제 요청 보내기]를 누르기 전입니다.</div>
  }
  return (
    <ol className="space-y-2">
      {history.map((e, i) => (
        <li key={e.id} className="grid gap-2 rounded border border-zinc-200 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300 sm:grid-cols-2 dark:border-zinc-800">
          <pre className="whitespace-pre-wrap break-all text-zinc-400">{describeSent(e)}</pre>
          <div className="space-y-0.5 break-all">
            <div className={e.verdict.matched ? 'text-emerald-400' : 'text-rose-400'}>
              #{e.id}{i === 0 ? ' (최신)' : ''} {e.outcome.status ?? '오류'} · {e.outcome.location ? '리다이렉트됨' : '통과'}
            </div>
            <div>location: {short(e.outcome.location)}</div>
            {e.outcome.body && <div>body: {e.outcome.body}</div>}
            <div className="text-zinc-500">{e.verdict.reason}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}
