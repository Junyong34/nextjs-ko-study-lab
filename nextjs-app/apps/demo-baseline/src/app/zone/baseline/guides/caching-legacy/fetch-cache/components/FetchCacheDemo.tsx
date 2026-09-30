'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { FETCH_MODES, type FetchMode, type FetchProbeResult } from '../types'

interface Props {
  calls: FetchProbeResult[]
  pending: boolean
  onProbe: (mode: FetchMode) => void
  onInvalidate: () => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'

export function FetchCacheDemo({ calls, pending, onProbe, onInvalidate, onReset }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">
        버튼은 서버 액션에서 같은 원본 Route Handler(<code>api/source</code>)를 fetch합니다. 원본이 실제로 실행되면
        <code> sourceCount</code>가 1 오르고, Data Cache에서 응답이 나오면 오르지 않습니다.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FETCH_MODES.map((m) => (
          <div key={m.mode} className="space-y-1 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <code className="block break-all text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{m.code}</code>
            <p className="text-[11px] text-zinc-500">기대: {m.expect}</p>
            <button className={btn} disabled={pending} onClick={() => onProbe(m.mode)}>
              {m.label} 요청
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={btn} disabled={pending} onClick={onInvalidate}>
          revalidateTag로 캐시 무효화
        </button>
        <DemoResetButton onReset={onReset} label="기록 초기화" />
      </div>
      <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
            <tr><th className="p-2">#</th><th className="p-2">모드</th><th className="p-2">sourceCount</th><th className="p-2">원본 생성 시각</th><th className="p-2">소요</th><th className="p-2">구간</th></tr>
          </thead>
          <tbody>
            {calls.length === 0 && (
              <tr><td colSpan={6} className="p-3 text-zinc-400">아직 요청 기록이 없습니다.</td></tr>
            )}
            {calls.map((c, i) => (
              <tr key={c.calledAt} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{c.mode}</td>
                <td className="p-2 font-bold">{c.sourceCount}</td>
                <td className="p-2">{c.generatedAt.slice(11, 23)}</td>
                <td className="p-2">{c.elapsedMs}ms</td>
                <td className="p-2">무효화 {c.epoch}회 뒤</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
