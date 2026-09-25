'use client'

import { NAV_METHODS } from '../types'
import type { NavRecord } from '../types'
import { evaluateRecord } from '../evaluate'

const labelOf = (m: NavRecord['method']) => NAV_METHODS.find((c) => c.method === m)?.label ?? m
const mark = (ok: boolean) => (ok ? 'O' : 'X')

/** iframe 문서가 보낸 필터 변경별 실측값을 가공 없이 나열한다. */
export function RecordTable({ records, baseTimeOrigin }: { records: NavRecord[]; baseTimeOrigin: number | null }) {
  if (records.length === 0) {
    return (
      <div className="rounded border border-dashed border-zinc-300 px-3 py-4 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        아직 기록이 없습니다. 위 창에서 스크롤한 뒤 필터 버튼을 눌러 주세요.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[720px] text-left font-mono text-[11px]">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-2 py-1.5">#</th>
            <th className="px-2 py-1.5">방법</th>
            <th className="px-2 py-1.5">search 전 → 후 · 서버가 받은 값</th>
            <th className="px-2 py-1.5">scrollY 전 → 후 (Page top)</th>
            <th className="px-2 py-1.5">패널 A scrollTop</th>
            <th className="px-2 py-1.5">패널 B scrollTop</th>
            <th className="px-2 py-1.5">렌더 ID · 문서</th>
            <th className="px-2 py-1.5">판정</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {records.map((r, i) => {
            const v = evaluateRecord(r, baseTimeOrigin)
            return (
              <tr key={`${r.timeOrigin}-${r.seq}-${i}`} className="align-top">
                <td className="px-2 py-1.5">{r.seq}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">{labelOf(r.method)}</td>
                <td className="px-2 py-1.5">
                  {r.fromSearch} → {r.toSearch}
                  <div className="text-zinc-500">서버: {r.receivedSearch || '(없음)'}</div>
                </td>
                <td className="px-2 py-1.5">
                  {r.beforeY} → {r.afterY}
                  <div className="text-zinc-500">
                    top {r.pageTopBefore} → {r.pageTopAfter} / vh {r.viewportH}
                  </div>
                </td>
                <td className="px-2 py-1.5">
                  {r.keptBefore} → {r.keptAfter}
                  <div className="text-zinc-500">{r.keptReplaced ? '새 DOM' : '같은 DOM'}</div>
                </td>
                <td className="px-2 py-1.5">
                  {r.keyedBefore} → {r.keyedAfter}
                  <div className="text-zinc-500">{r.keyedReplaced ? '새 DOM' : '같은 DOM'}</div>
                </td>
                <td className="px-2 py-1.5">
                  {r.renderIdBefore} → {r.renderIdAfter}
                  <div className="text-zinc-500">
                    {v.sameDocument ? '리로드 없음' : '리로드됨'} · {r.elapsedMs}ms
                  </div>
                </td>
                <td className="px-2 py-1.5 whitespace-nowrap">
                  <span className={v.pass ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                    {r.timedOut ? '시간 초과' : v.pass ? '일치' : '불일치'}
                  </span>
                  <div className="text-zinc-500">
                    스크롤 {mark(v.scroll.pass)} 패널 {mark(v.panes.pass)} 서버 {mark(v.server.pass)}
                  </div>
                  {!v.decisive && <div className="text-amber-700 dark:text-amber-400">판별 불가 조건</div>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
