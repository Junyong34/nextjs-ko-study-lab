'use client'

import type { ProbeTarget, StreamRun } from '../types'
import { REQUEST_DELAY_MS } from '../lib/delay'
import { DEMO_PATH } from '../lib/routes'

interface StreamProbePanelProps {
  runs: StreamRun[]
  running: ProbeTarget | null
  error: string | null
  onProbe: (target: ProbeTarget) => void
}

const BUTTONS: { target: ProbeTarget; label: string; hint: string }[] = [
  { target: 'probe', label: 'probe 측정', hint: '<Suspense> 안에서 요청 데이터 읽기' },
  { target: 'blocking', label: 'blocking 측정', hint: 'Suspense 없이 읽기 + instant = false' },
]

export function StreamProbePanel({ runs, running, error, onProbe }: StreamProbePanelProps) {
  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div>
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">A. 정적 셸과 스트리밍 — 응답 HTML 직접 측정</h4>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          두 하위 라우트는 같은 요청 시점 데이터(<code>connection()</code> 후 {REQUEST_DELAY_MS}ms 지연)를 읽습니다. 버튼을 누르면
          브라우저가 <code>{DEMO_PATH}/&lt;대상&gt;</code>의 HTML을 fetch해 청크가 도착하는 순서와 시각을 기록합니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {BUTTONS.map(({ target, label, hint }) => (
          <button
            key={target}
            type="button"
            disabled={running !== null}
            onClick={() => onProbe(target)}
            className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-left text-xs font-bold text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {running === target ? '측정 중…' : label}
            <span className="block text-[10px] font-normal opacity-70">{hint}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-[11px] text-rose-600 dark:text-rose-400">측정 실패: {error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse font-mono text-[11px]">
          <thead>
            <tr className="text-left text-zinc-500 dark:text-zinc-400">
              {['#', '대상', '상태', '헤더 도착', '완료', '청크', "'use cache' ID", '요청 ID', 'fallback'].map((h) => (
                <th key={h} className="border-b border-zinc-200 pb-1 pr-2 font-semibold dark:border-zinc-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-2 text-zinc-400">
                  아직 측정하지 않았습니다.
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr key={run.runNo} className="text-zinc-700 dark:text-zinc-300">
                  <td className="py-1 pr-2">{run.runNo}</td>
                  <td className="pr-2">{run.target}</td>
                  <td className="pr-2">{run.status}</td>
                  <td className={`pr-2 ${run.headersMs < REQUEST_DELAY_MS ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {run.headersMs}ms
                  </td>
                  <td className="pr-2">{run.totalMs}ms</td>
                  <td className="pr-2">{run.totalChunks}</td>
                  <td className="pr-2">{run.cachedId ?? '-'}</td>
                  <td className="pr-2">{run.requestId ?? '-'}</td>
                  <td>{run.fallbackAt ? '먼저 도착' : '없음'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        헤더 도착이 {REQUEST_DELAY_MS}ms보다 빠르면 데이터를 기다리지 않고 셸부터 보낸 것입니다. dev 서버의 첫 요청은
        컴파일 시간이 섞여 느릴 수 있으니 2회 이상 측정해 비교하세요.
      </p>
    </section>
  )
}
