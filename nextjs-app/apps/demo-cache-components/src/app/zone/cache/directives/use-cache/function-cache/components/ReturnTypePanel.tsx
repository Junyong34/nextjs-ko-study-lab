import type { CategoryStats, ReturnTypeCheck } from '../types'

function typeName(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value !== 'object') return typeof value
  return Object.getPrototypeOf(value)?.constructor?.name ?? 'Object(null prototype)'
}

/** 캐시 함수가 반환한 값을 호출부(캐시 밖)에서 instanceof로 검사한 실제 결과 */
export function ReturnTypePanel({ check, stats }: { check: ReturnTypeCheck; stats: CategoryStats }) {
  const rows = [
    { field: 'generatedAt', made: 'new Date()', got: typeName(stats.generatedAt), ok: check.dateIsDate, testId: 'type-date' },
    { field: 'priceByProduct', made: 'new Map()', got: typeName(stats.priceByProduct), ok: check.mapIsMap, testId: 'type-map' },
    { field: 'tags', made: 'new Set()', got: typeName(stats.tags), ok: check.setIsSet, testId: 'type-set' },
  ]
  const cls = check.classInstance

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left font-mono text-[11px]">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th className="px-2 py-1.5">반환 필드</th>
            <th className="px-2 py-1.5">캐시 함수 안에서</th>
            <th className="px-2 py-1.5">호출부에서 받은 값</th>
            <th className="px-2 py-1.5">instanceof 검사</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.field} className="border-t border-zinc-100 dark:border-zinc-800">
              <td className="px-2 py-1">{r.field}</td>
              <td className="px-2 py-1 text-zinc-500">{r.made}</td>
              <td className="px-2 py-1">{r.got}</td>
              <td data-testid={r.testId} className={`px-2 py-1 font-bold ${r.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {r.ok ? '유지됨' : '타입 바뀜'}
              </td>
            </tr>
          ))}
          <tr className="border-t border-zinc-100 dark:border-zinc-800">
            <td className="px-2 py-1">getSummaryInstance()</td>
            <td className="px-2 py-1 text-zinc-500">new PriceSummary()</td>
            <td data-testid="type-class" className="px-2 py-1 break-all" colSpan={2}>
              {cls.ok ? cls.detail : `호출 실패: ${cls.error}`}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="border-t border-zinc-100 px-2 py-1.5 text-[10px] text-zinc-500 dark:border-zinc-800">
        prod(next start)에서는 오류 메시지가 일반 문구로 가려집니다. 원문은 서버 로그에서 같은 digest로 찾을 수 있습니다.
      </p>
    </div>
  )
}
