'use client'

import { AREAS } from '../types'
import { useProbe } from './ProbeContext'

const cell = 'px-2 py-1 align-top'
const LINK_LABEL = { default: '기본', prefetch: 'prefetch', false: 'prefetch={false}' } as const

/** 링크를 클릭한 뒤 각 영역이 화면에 마운트된 시각(ms). 클릭하지 않은 영역은 '—'. */
export function ArrivalTable() {
  const { runs } = useProbe()
  return (
    <section className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
        링크를 클릭해 도착 페이지로 이동하면, <strong>클릭한 순간부터 각 영역이 화면에 나타난 시각(ms)</strong>이 여기에 쌓입니다. 도착 페이지의
        [← 목록으로]로 돌아와 다른 링크도 눌러 비교하세요.
      </p>
      <div className="w-0 min-w-full overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-mono text-[10px] text-zinc-700 dark:text-zinc-300">
          <thead>
            <tr className="text-left text-zinc-500">
              {['#', '라우트', '링크', '상품', ...AREAS.map((a) => `${a} (ms)`)].map((h) => (
                <th key={h} className={`${cell} border-b border-zinc-200 font-semibold dark:border-zinc-800`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={4 + AREAS.length} className="py-2 text-zinc-400">
                  아직 클릭하지 않았습니다.
                </td>
              </tr>
            ) : (
              runs.map((r) => (
                <tr key={r.runNo} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className={cell}>{r.runNo}</td>
                  <td className={cell}>{r.route}</td>
                  <td className={cell}>{LINK_LABEL[r.link]}</td>
                  <td className={cell}>{r.id}</td>
                  {AREAS.map((a) => (
                    <td key={a} className={cell}>
                      {r.arrivals[a] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
