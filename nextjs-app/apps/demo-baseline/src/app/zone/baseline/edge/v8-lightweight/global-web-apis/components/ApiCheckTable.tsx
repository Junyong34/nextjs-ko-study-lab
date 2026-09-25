'use client'

import React from 'react'
import type { ProbeResponse } from '../types'
import type { BrowserSide } from '../hooks/useEdgeLab'

function Mark({ ok }: { ok: boolean }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
        ok
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
      }`}
    >
      {ok ? 'OK' : 'FAIL'}
    </span>
  )
}

/** edge 라우트가 돌려준 API별 실행 결과 표 */
export function ApiCheckTable({ probe }: { probe: ProbeResponse }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead className="bg-zinc-50 text-[11px] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-3 py-2 font-semibold">분류</th>
            <th className="px-3 py-2 font-semibold">API · 실제 호출</th>
            <th className="px-3 py-2 font-semibold">Edge에서 반환된 값</th>
            <th className="px-3 py-2 font-semibold">결과</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {probe.checks.map((c) => (
            <tr key={c.api} className="align-top">
              <td className="whitespace-nowrap px-3 py-2 text-[11px] text-zinc-500">{c.group}</td>
              <td className="px-3 py-2">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{c.api}</div>
                <code className="break-all text-[10.5px] text-zinc-500 dark:text-zinc-400">{c.call}</code>
              </td>
              <td className="break-all px-3 py-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{c.value}</td>
              <td className="px-3 py-2">
                <Mark ok={c.ok} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 같은 입력을 edge와 브라우저가 각각 계산한 값 대조 */
export function DigestCompare({ probe, browser }: { probe: ProbeResponse; browser: BrowserSide }) {
  const rows = [
    { label: 'SHA-256 (hex)', edge: probe.sha256Hex, web: browser.sha256Hex },
    { label: 'UTF-8 바이트 수', edge: String(probe.utf8ByteLength), web: String(browser.utf8ByteLength) },
    { label: 'Base64', edge: probe.base64, web: browser.base64 },
  ]
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{r.label}</span>
            <Mark ok={r.edge === r.web} />
          </div>
          <dl className="grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1 font-mono text-[11px]">
            <dt className="text-zinc-500">Edge</dt>
            <dd className="break-all text-zinc-800 dark:text-zinc-200">{r.edge}</dd>
            <dt className="text-zinc-500">브라우저</dt>
            <dd className="break-all text-zinc-800 dark:text-zinc-200">{r.web}</dd>
          </dl>
        </div>
      ))}
    </div>
  )
}
