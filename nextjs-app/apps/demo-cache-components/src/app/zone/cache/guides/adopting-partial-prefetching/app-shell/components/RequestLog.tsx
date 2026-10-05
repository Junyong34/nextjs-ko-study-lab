'use client'

import { DemoResetButton } from '@study/demo-kit'
import { useProbe } from './ProbeContext'

const cell = 'px-2 py-1 align-top'

/** window.fetch로 잡은 RSC 요청 로그. 헤더 값은 라우터가 실제로 보낸 값이다. */
export function RequestLog() {
  const { requests, reset } = useProbe()
  const prefetches = requests.filter((r) => r.kind === 'prefetch')

  return (
    <section className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
          RSC 요청 {requests.length}건 (prefetch {prefetches.length}건). 링크가 뷰포트에 들어오면 production에서만 prefetch 요청이 생깁니다.
        </p>
        <DemoResetButton label="로그 초기화" onReset={reset} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse font-mono text-[10px] text-zinc-700 dark:text-zinc-300">
          <thead>
            <tr className="text-left text-zinc-500">
              {['#', '종류', 'path', 'next-router-prefetch', 'segment-prefetch', 'status', '헤더 ms'].map((h) => (
                <th key={h} className={`${cell} border-b border-zinc-200 font-semibold dark:border-zinc-800`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-2 text-zinc-400">
                  아직 RSC 요청이 없습니다.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className={cell}>{r.id}</td>
                  <td className={cell}>{r.kind}</td>
                  <td className={`${cell} break-all`}>{r.path.replace(/^.*app-shell/, '…')}</td>
                  <td className={cell}>{r.prefetchHeader ?? '—'}</td>
                  <td className={`${cell} break-all`}>{r.segmentPrefetch ?? '—'}</td>
                  <td className={cell}>{r.status ?? '…'}</td>
                  <td className={cell}>{r.headersMs ?? '…'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
