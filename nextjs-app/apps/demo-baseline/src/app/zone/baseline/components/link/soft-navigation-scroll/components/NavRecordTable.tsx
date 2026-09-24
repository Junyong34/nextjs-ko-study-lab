'use client'

import { NAV_KINDS } from '../types'
import type { NavRecord } from '../types'
import { evaluateSequence } from '../scroll-evaluate'

const labelOf = (kind: NavRecord['kind']) => NAV_KINDS.find((k) => k.kind === kind)?.label ?? kind

/** iframe 문서가 보낸 클릭별 실측값을 가공 없이 나열한다. */
export function NavRecordTable({
  records,
  baseTimeOrigin,
}: {
  records: NavRecord[]
  baseTimeOrigin: number | null
}) {
  if (records.length === 0) {
    return (
      <div className="rounded border border-dashed border-zinc-300 px-3 py-4 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        아직 기록이 없습니다. 위 창에서 스크롤한 뒤 링크를 눌러 주세요.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-left font-mono text-[11px]">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-2 py-1.5">#</th>
            <th className="px-2 py-1.5">누른 링크</th>
            <th className="px-2 py-1.5">URL</th>
            <th className="px-2 py-1.5">scrollY 전 → 후</th>
            <th className="px-2 py-1.5">Page 상단 rect.top 전 → 후</th>
            <th className="px-2 py-1.5">해시 대상 top / margin · 정렬된 섹션</th>
            <th className="px-2 py-1.5">문서</th>
            <th className="px-2 py-1.5">판정</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {evaluateSequence(records, baseTimeOrigin).map(({ record: r, verdict: v }) => {
            const sameDoc = baseTimeOrigin === null || r.timeOrigin === baseTimeOrigin
            return (
              <tr key={`${r.timeOrigin}-${r.seq}`} className="text-zinc-700 dark:text-zinc-300">
                <td className="px-2 py-1.5">{r.seq}</td>
                <td className="px-2 py-1.5 font-sans">{labelOf(r.kind)}</td>
                <td className="px-2 py-1.5">
                  {r.fromUrl} → {r.toUrl}
                </td>
                <td className="px-2 py-1.5 font-semibold">
                  {r.beforeY} → {r.afterY}
                </td>
                <td className="px-2 py-1.5">
                  {r.pageTopBefore} → {r.pageTopAfter}{' '}
                  <span className="text-zinc-400">(vh {r.viewportH})</span>
                </td>
                <td className="px-2 py-1.5">
                  {r.targetTopAfter === null ? '-' : `${r.targetTopBefore} → ${r.targetTopAfter} / ${r.scrollMarginTop}`}
                  {r.kind.startsWith('hash') && !r.hashChanged && <span className="text-zinc-400"> (해시 동일)</span>}
                  {r.landedOn && <span className="text-zinc-400"> · #{r.landedOn}</span>}
                </td>
                <td className={`px-2 py-1.5 ${sameDoc ? '' : 'text-rose-600'}`}>{sameDoc ? '유지' : '리로드됨'}</td>
                <td className="px-2 py-1.5 font-sans">
                  <span className={v.pass ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                    {v.pass ? '일치' : '불일치'}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400"> · {v.expected}</span>
                  {!v.decisive && v.pass && <span className="text-zinc-400"> (판별 불가 조건)</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
