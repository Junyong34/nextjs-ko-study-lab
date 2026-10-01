'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { ProbeSnapshot } from '../hooks/useInjectionProbe'
import { DECLARED_KEY, UNDECLARED_KEY } from '../types'

interface Props {
  snapshot: ProbeSnapshot | null
  runs: number
  error: string | null
  isPending: boolean
  onProbe: () => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const cell = 'break-all px-2 py-1 font-mono text-[11px] align-top'
const show = (v: string | null) => (v === null ? <span className="text-zinc-500">undefined</span> : v)

export function InjectionConsole({ snapshot, runs, error, isPending, onProbe, onReset }: Props) {
  const rows = snapshot
    ? [
        { key: DECLARED_KEY, note: 'env 필드에 선언', s: snapshot.server.readings[0], b: snapshot.browser[0] },
        { key: UNDECLARED_KEY, note: '선언하지 않음(대조)', s: snapshot.server.readings[1], b: snapshot.browser[1] },
      ]
    : []
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 dark:border-zinc-800">
        <button onClick={onProbe} disabled={isPending} className={btn}>
          {isPending ? '측정 중...' : '1) 서버·브라우저 값 읽기 + 청크 검색'}
        </button>
        <DemoResetButton onReset={onReset} />
        <span className="text-xs text-zinc-500">서버는 Route Handler(api/server-read), 브라우저는 이 컴포넌트가 직접 읽습니다.</span>
      </div>
      {!snapshot && !error && <p className="text-xs text-zinc-500">아직 측정하지 않았습니다.</p>}
      {error && <p className="text-xs font-bold text-rose-600">측정 실패: {error}</p>}
      {snapshot && (
        <div className="overflow-x-auto rounded border border-zinc-200 bg-zinc-950 text-zinc-300 dark:border-zinc-800">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-800 text-[11px] text-zinc-400">
              <tr>
                <th className="px-2 py-1">키</th>
                <th className="px-2 py-1">서버 .KEY</th>
                <th className="px-2 py-1">서버 [key]</th>
                <th className="px-2 py-1">브라우저 .KEY</th>
                <th className="px-2 py-1">브라우저 [key]</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ key, note, s, b }) => (
                <tr key={key} className="border-t border-zinc-800">
                  <td className={cell}>
                    <span className="font-bold">{key}</span>
                    <span className="block text-zinc-500">{note}</span>
                  </td>
                  <td className={cell}>{show(s.dot)}</td>
                  <td className={cell}>{show(s.dynamic)}</td>
                  <td className={cell}>{show(b.dot)}</td>
                  <td className={cell}>{show(b.dynamic)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-zinc-800 px-2 py-1 text-[10px] text-zinc-500">
            측정 {runs}회 · 서버 pid {snapshot.server.pid} · {snapshot.server.evaluatedAt}
          </p>
        </div>
      )}
    </div>
  )
}
