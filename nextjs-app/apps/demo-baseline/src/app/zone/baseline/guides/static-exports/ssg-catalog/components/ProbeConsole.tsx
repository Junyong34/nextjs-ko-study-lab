'use client'
import React from 'react'
import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import type { ProbeRun } from '../types'
import { CATALOG, PROBE_IDS, isPrebuilt } from '../lib/catalog'

interface Props {
  selectedId: string
  onSelect: (id: string) => void
  runs: Record<string, ProbeRun>
  isRunning: boolean
  onRun: () => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const time = (iso: string | null) => (iso ? iso.slice(11, 23) : '-')
const nameOf = (id: string) => CATALOG.find((p) => p.id === id)?.name ?? '카탈로그에 없는 id'

export function ProbeConsole({ selectedId, onSelect, runs, isRunning, onRun, onReset }: Props) {
  const measured = PROBE_IDS.filter((id) => runs[id])
  const latest = runs[selectedId]
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 dark:border-zinc-800">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          1) 상품 id{' '}
          <select
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            className="ml-1 rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900"
          >
            {PROBE_IDS.map((id) => (
              <option key={id} value={id}>
                {id} · {nameOf(id)} · {isPrebuilt(id) ? '사전 생성 목록' : '목록 밖'}
              </option>
            ))}
          </select>
        </label>
        <button onClick={onRun} disabled={isRunning} className={btn}>
          {isRunning ? '측정 중 (약 1.2초)...' : '2) 같은 URL을 두 번 요청해 측정'}
        </button>
        <Link
          href={`products/${selectedId}`}
          prefetch={false}
          target="_blank"
          className="text-xs font-medium text-blue-600 underline dark:text-blue-400"
        >
          실제 라우트 새 탭에서 열기
        </Link>
        <DemoResetButton onReset={onReset} />
      </div>

      <div className="space-y-1.5 rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800">
        {latest ? (
          <>
            <div className="font-bold text-zinc-400">GET {latest.url}</div>
            {latest.samples.map((s, i) => (
              <div key={i}>
                요청 #{i + 1} → <span className={s.status === 200 ? 'font-bold text-emerald-400' : 'font-bold text-amber-400'}>{s.status}</span>
                {' · '}렌더 시각 <span className="text-sky-400">{time(s.renderedAt)}</span>
                {s.renderedAt && ` · 렌더 후 ${s.receivedAt - Date.parse(s.renderedAt)}ms 경과`}
              </div>
            ))}
            <div className="border-t border-zinc-800 pt-1">cache-control: {latest.samples[0].cacheControl ?? '(없음)'}</div>
            <div>x-nextjs-cache: {latest.samples[0].nextjsCache ?? '(없음)'} · x-nextjs-prerender: {latest.samples[0].nextjsPrerender ?? '(없음)'}</div>
          </>
        ) : (
          <div className="text-zinc-500">선택한 id({selectedId})는 아직 측정하지 않았습니다.</div>
        )}
      </div>

      <table className="w-full text-left text-xs">
        <thead className="border-b text-zinc-500 dark:border-zinc-800">
          <tr><th className="py-1">id</th><th>generateStaticParams</th><th>측정 상태</th><th>렌더 시각 두 번</th></tr>
        </thead>
        <tbody className="font-mono">
          {measured.length === 0 && (
            <tr><td colSpan={4} className="py-2 text-zinc-500">측정 이력이 없습니다.</td></tr>
          )}
          {measured.map((id) => {
            const [a, b] = runs[id].samples
            return (
              <tr key={id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-1">{id}</td>
                <td>{isPrebuilt(id) ? '포함' : '미포함'}</td>
                <td>{a.status}/{b.status}</td>
                <td>{a.renderedAt ? `${time(a.renderedAt)} → ${time(b.renderedAt)}${a.renderedAt === b.renderedAt ? ' (동일)' : ' (변경)'}` : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
