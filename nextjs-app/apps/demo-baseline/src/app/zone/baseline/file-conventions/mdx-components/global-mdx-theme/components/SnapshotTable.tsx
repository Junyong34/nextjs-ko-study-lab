import type { PaneSnapshot } from '../types'

const cell = (size: string, weight: string, color: string) => `${size} · ${weight} · ${color}`

export function SnapshotTable({ snapshot }: { snapshot: PaneSnapshot }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-[11px]">
        <caption className="mb-1 text-left text-xs text-zinc-500">
          테마 {snapshot.themeOn ? '켬' : '끔'} · {snapshot.measuredAt} · font-size · font-weight · color
        </caption>
        <thead>
          <tr className="text-left text-zinc-500">
            <th className="py-1 pr-2">#</th><th className="pr-2">매핑 되돌림</th><th>전역 매핑 (class mdx-g)</th>
          </tr>
        </thead>
        <tbody>
          {snapshot.raw.map((r, i) => {
            const m = snapshot.mapped[i]
            return (
              <tr key={i} className="border-t border-zinc-200 align-top dark:border-zinc-800">
                <td className="py-0.5 pr-2">{i + 1}</td>
                <td className="pr-2">&lt;{r.tag}&gt; {cell(r.fontSize, r.fontWeight, r.color)}</td>
                <td>{m ? <>&lt;{m.tag}&gt;{m.globalClass ? '✓' : '✗'} {cell(m.fontSize, m.fontWeight, m.color)}</> : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
