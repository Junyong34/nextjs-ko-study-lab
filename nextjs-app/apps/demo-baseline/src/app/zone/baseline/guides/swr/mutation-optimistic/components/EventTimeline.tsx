'use client'
import React from 'react'
import type { LabEvent, LabEventKind, ServerLogEntry } from '../types'

const COLOR: Record<LabEventKind, string> = {
  'fetch-start': 'text-sky-400',
  'fetch-end': 'text-sky-300',
  'patch-start': 'text-violet-400',
  'patch-ok': 'text-emerald-400',
  'patch-fail': 'text-rose-400',
  display: 'text-amber-300',
  mount: 'text-zinc-400',
}

interface Props {
  events: LabEvent[]
  serverLog: ServerLogEntry[]
  onRefreshServerLog: () => void
}

export function EventTimeline({ events, serverLog, onRefreshServerLog }: Props) {
  const recent = events.slice(-24)
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
        <div className="mb-1.5 font-sans font-bold text-zinc-400">브라우저 기록 (실습 시작 기준 ms)</div>
        {recent.length === 0 && <div className="text-zinc-500">아직 기록이 없습니다.</div>}
        <ol className="max-h-56 space-y-0.5 overflow-y-auto">
          {recent.map((e) => (
            <li key={e.seq} className="flex gap-2">
              <span className="w-12 shrink-0 text-right text-zinc-500">{e.t}</span>
              <span className={COLOR[e.kind]}>{e.detail}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
        <div className="mb-1.5 flex items-center justify-between font-sans font-bold text-zinc-400">
          서버가 받은 요청 순서 (api/log)
          <button onClick={onRefreshServerLog} className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] font-normal hover:bg-zinc-800 cursor-pointer">
            새로고침
          </button>
        </div>
        {serverLog.length === 0 && <div className="text-zinc-500">동작을 실행하면 서버 기록을 함께 읽어 옵니다.</div>}
        <ol className="max-h-56 space-y-0.5 overflow-y-auto">
          {serverLog.slice(-16).map((e) => (
            <li key={e.no} className="flex gap-2">
              <span className="w-8 shrink-0 text-right text-zinc-500">#{e.no}</span>
              <span className={e.method === 'GET' ? 'text-sky-400' : 'text-violet-400'}>{e.method}</span>
              <span>{e.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
