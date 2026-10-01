import type { ProbeState } from '../types'

const KIND_STYLE = {
  prefetch: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  navigation: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
} as const

// 관측된 RSC 요청과 hover를 시간순으로 보여준다. 모든 값은 fetch 계측에서 읽은 실측값이다.
export function RequestLog({ probe }: { probe: ProbeState }) {
  const rows = [
    ...probe.requests.map((r) => ({ at: r.startedAt, r, hover: null as string | null })),
    ...probe.hovers.map((h) => ({ at: h.at, r: null, hover: h.label })),
  ].sort((a, b) => a.at - b.at)

  return (
    <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-1.5 font-bold text-zinc-800 dark:text-zinc-200">관측 로그 (fetch 계측)</div>
      {rows.length === 0 ? (
        <p className="text-zinc-500">아직 관측된 RSC 요청이 없습니다.</p>
      ) : (
        <ol className="space-y-1 font-mono">
          {rows.map(({ at, r, hover }) => (
            <li key={r ? `r${r.id}` : `h${at}`} className="flex flex-wrap items-center gap-1.5">
              <span className="text-zinc-500">+{Math.round(at - probe.since)}ms</span>
              {r ? (
                <>
                  <span className={`rounded px-1 ${KIND_STYLE[r.kind]}`}>{r.kind}</span>
                  <span className="text-zinc-800 dark:text-zinc-200">{r.path.replace(/^.*\/hover-shell/, '…')}</span>
                  <span className="text-zinc-500">
                    _rsc={String(r.hasRscParam)} · next-router-prefetch={r.prefetchHeader ?? '없음'} · 헤더 {r.headersMs ?? '…'}ms / body {r.bodyMs ?? '…'}ms · {r.status ?? '…'}
                  </span>
                </>
              ) : (
                <span className="text-zinc-600 dark:text-zinc-400">{hover}</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
