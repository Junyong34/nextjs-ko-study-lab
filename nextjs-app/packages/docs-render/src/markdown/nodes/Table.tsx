import React from 'react'
import { renderInline } from '../parse/inline'

export interface TableProps {
  /** 파이프 표의 원본 줄들. 0번은 헤더, 1번은 구분선 */
  lines: string[]
  docPath?: string
}

function parseCells(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim())
}

export function Table({ lines, docPath }: TableProps) {
  const headers = parseCells(lines[0])
  const rows = lines.slice(2) // 구분선 제외

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            {headers.map((h, idx) => (
              <th key={idx} className="px-4 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                {renderInline(h, docPath)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((r, rIdx) => (
            <tr key={rIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
              {parseCells(r).map((c, cIdx) => (
                <td key={cIdx} className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                  {renderInline(c, docPath)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
