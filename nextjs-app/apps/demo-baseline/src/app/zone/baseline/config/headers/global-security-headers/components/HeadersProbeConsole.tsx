'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { PROBE_PATHS, type MeasureResult } from '../types'
import { EXPECTED_HEADERS, isInScope } from '../lib/scope'

interface Props {
  targetPath: string
  controlPath: string
  onTargetChange: (path: string) => void
  onControlChange: (path: string) => void
  result: MeasureResult | null
  runs: number
  isPending: boolean
  onMeasure: () => void
  onReset: () => void
}

const select = 'mt-1 block w-full rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900'
const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const cell = 'break-all px-2 py-1 font-mono text-[11px] align-top'
const show = (v: string | null) => (v === null ? <span className="text-zinc-500">(없음)</span> : v)

function PathSelect({ label, value, onChange }: { label: string; value: string; onChange: (p: string) => void }) {
  return (
    <label className="block flex-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={select}>
        {PROBE_PATHS.map((p) => (
          <option key={p.path} value={p.path}>
            {p.label}
          </option>
        ))}
      </select>
      <span className="mt-1 block font-mono text-[10px] font-normal text-zinc-500">
        {value} — headers() source 범위 {isInScope(value) ? '안' : '밖'}
      </span>
    </label>
  )
}

export function HeadersProbeConsole(p: Props) {
  const r = p.result
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-end gap-3 border-b pb-3 dark:border-zinc-800">
        <PathSelect label="1) 대상 경로 (헤더가 있어야 함)" value={p.targetPath} onChange={p.onTargetChange} />
        <PathSelect label="2) 대조 경로 (헤더가 없어야 함)" value={p.controlPath} onChange={p.onControlChange} />
        <button onClick={p.onMeasure} disabled={p.isPending} className={btn}>
          {p.isPending ? '측정 중...' : '3) 응답 헤더 측정 (Server Action)'}
        </button>
        <DemoResetButton onReset={p.onReset} />
      </div>

      {!r && <p className="text-xs text-zinc-500">아직 측정하지 않았습니다. 서버가 두 경로를 fetch해 응답 헤더를 읽어 옵니다.</p>}
      {r && !r.ok && <p className="text-xs font-bold text-rose-600">측정 실패: {r.error}</p>}
      {r?.ok && (
        <div className="overflow-x-auto rounded border border-zinc-200 bg-zinc-950 text-zinc-300 dark:border-zinc-800">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-800 text-[11px] text-zinc-400">
              <tr>
                <th className="px-2 py-1">헤더</th>
                <th className="px-2 py-1">대상 HTTP {r.target.status}</th>
                <th className="px-2 py-1">대조 HTTP {r.control.status}</th>
              </tr>
            </thead>
            <tbody>
              {[...EXPECTED_HEADERS.map((h) => h.key), 'X-Frame-Options'].map((key) => (
                <tr key={key} className="border-t border-zinc-800">
                  <td className={`${cell} font-bold`}>{key}</td>
                  <td className={cell}>{show(r.target.headers[key.toLowerCase()])}</td>
                  <td className={cell}>{show(r.control.headers[key.toLowerCase()])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-zinc-800 px-2 py-1 text-[10px] text-zinc-500">
            측정 {p.runs}회 · 마지막 {r.target.measuredAt}
          </p>
        </div>
      )}
    </div>
  )
}
