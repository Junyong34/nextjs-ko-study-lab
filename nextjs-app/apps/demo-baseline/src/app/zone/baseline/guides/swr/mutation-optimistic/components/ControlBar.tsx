'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { LabSettings } from '../types'

interface Props {
  settings: LabSettings
  onSettings: (s: LabSettings) => void
  extraConsumers: number
  pending: boolean
  onAddConsumer: () => void
  onReset: () => Promise<void>
}

const DELAYS = [0, 800, 1500, 3000]
const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'

export function ControlBar({ settings, onSettings, extraConsumers, pending, onAddConsumer, onReset }: Props) {
  const set = (patch: Partial<LabSettings>) => onSettings({ ...settings, ...patch })
  return (
    <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex items-center gap-1.5">
          PATCH 응답 지연
          <select
            className="rounded border border-zinc-300 bg-white px-1.5 py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={settings.delayMs}
            disabled={pending}
            onChange={(e) => set({ delayMs: Number(e.target.value) })}
          >
            {DELAYS.map((d) => (
              <option key={d} value={d}>
                {d}ms
              </option>
            ))}
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input type="checkbox" checked={settings.failNext} disabled={pending} onChange={(e) => set({ failNext: e.target.checked })} />
          서버가 PATCH를 500으로 거절
        </label>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input type="checkbox" checked={settings.revalidate} disabled={pending} onChange={(e) => set({ revalidate: e.target.checked })} />
          mutate 뒤 재검증(revalidate)
        </label>
        <DemoResetButton onReset={onReset} disabled={pending} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className={btn} onClick={onAddConsumer} disabled={pending}>
          같은 키 구독 컴포넌트 추가
        </button>
        <span className="text-[11px] text-zinc-500">
          추가된 구독 {extraConsumers}개 · 마지막 GET 후 2초(dedupingInterval) 안에 누르면 요청이 생략되고, 2초가 지나면 새 구독이 재검증을 한 번 일으킵니다.
        </span>
      </div>
    </div>
  )
}
