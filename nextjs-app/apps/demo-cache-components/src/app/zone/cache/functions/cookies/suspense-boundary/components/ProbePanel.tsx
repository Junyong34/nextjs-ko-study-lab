'use client'

import type { ProbeTarget, StreamRun } from '../types'
import { READ_DELAY_MS } from '../lib/constants'
import { arrivalGap, judgeRun } from '../lib/judge'

interface ProbePanelProps {
  runs: StreamRun[]
  running: ProbeTarget | null
  cookieSent: string | null
  error: string | null
  onProbe: (target: ProbeTarget) => void
  onIssue: () => void
  onRemove: () => void
}

const btn =
  'cursor-pointer rounded px-3 py-1.5 text-left text-xs font-bold transition disabled:cursor-wait disabled:opacity-60'
const dark = `${btn} bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200`
const light = `${btn} border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200`

export function ProbePanel({ runs, running, cookieSent, error, onProbe, onIssue, onRemove }: ProbePanelProps) {
  const busy = running !== null
  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        두 하위 라우트는 같은 <code>cookies()</code> 읽기 뒤 {READ_DELAY_MS}ms를 기다립니다. 차이는 <code>&lt;Suspense&gt;</code> 안에서
        읽느냐 밖에서 읽느냐뿐입니다. 버튼을 누르면 브라우저가 해당 라우트의 HTML을 fetch해 마커가 도착하는 순서와 시각을 기록합니다.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={light} disabled={busy} onClick={onIssue}>
          쿠키 발급 (Server Action)
        </button>
        <button type="button" className={light} disabled={busy} onClick={onRemove}>
          쿠키 삭제
        </button>
        <span className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          현재 쿠키: {cookieSent ?? '없음'}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={dark} disabled={busy} onClick={() => onProbe('inside')}>
          {running === 'inside' ? '측정 중…' : 'inside 측정'}
          <span className="block text-[10px] font-normal opacity-70">Suspense 안에서 cookies() 읽기</span>
        </button>
        <button type="button" className={dark} disabled={busy} onClick={() => onProbe('outside')}>
          {running === 'outside' ? '측정 중…' : 'outside 측정'}
          <span className="block text-[10px] font-normal opacity-70">Suspense 없이 읽기 + instant = false</span>
        </button>
      </div>
      {error && <p className="text-[11px] text-rose-600 dark:text-rose-400">측정 실패: {error}</p>}
      <div className="w-0 min-w-full overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse font-mono text-[11px]">
          <thead>
            <tr className="text-left text-zinc-500 dark:text-zinc-400">
              {['#', '대상', '보낸 쿠키', '서버가 읽은 값', '정적→쿠키 영역 간격', 'fallback', '판정'].map((h) => (
                <th key={h} className="border-b border-zinc-200 pb-1 pr-2 font-semibold dark:border-zinc-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-2 text-zinc-400">
                  아직 측정하지 않았습니다.
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr key={run.runNo} className="text-zinc-700 dark:text-zinc-300">
                  <td className="py-1 pr-2">{run.runNo}</td>
                  <td className="pr-2">{run.target}</td>
                  <td className="pr-2">{run.cookieSent ?? '없음'}</td>
                  <td className="pr-2">{run.sessionUser ?? '-'}</td>
                  <td className="pr-2">{arrivalGap(run) ?? '-'}ms</td>
                  <td className="pr-2">{run.fallbackAt ? '먼저 도착' : '없음'}</td>
                  <td className={judgeRun(run) ? 'text-emerald-600' : 'text-rose-600'}>{judgeRun(run) ? '일치' : '불일치'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
