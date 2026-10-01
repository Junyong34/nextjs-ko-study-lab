'use client'
import React from 'react'
import type { PresetProbeState } from '../hooks/usePresetProbe'
import { classify } from '../lib/judge'
import { PRESETS, type PresetReading, type PresetSpec, type ReadingPhase } from '../types'

const PHASE_STYLE: Record<ReadingPhase, { label: string; className: string }> = {
  first: { label: '첫 측정', className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  new: { label: '새로 계산', className: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  hit: { label: '캐시 재사용', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  stale: { label: 'revalidate 경과 후 재사용', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
}

const formatTime = (ms: number) =>
  new Date(ms).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

function PresetCard({ spec, readings }: { spec: PresetSpec; readings: PresetReading[] }) {
  const recent = readings.slice(-6).reverse()
  const last = readings.at(-1)
  return (
    <div className="space-y-2.5 rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{spec.label}</span>
        <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {last ? `#${last.cacheId}` : '측정 전'}
        </span>
      </div>
      <code className="block break-all font-mono text-[10px] text-zinc-500 dark:text-zinc-400">cacheLife(&apos;{spec.profile}&apos;)</code>
      <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
        {(['stale', 'revalidate', 'expire'] as const).map((k) => (
          <div key={k} className="rounded border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
            {k} {spec[k]}초
          </div>
        ))}
      </div>
      {recent.length === 0 ? (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">아직 측정 기록이 없습니다.</p>
      ) : (
        <ul className="space-y-1 font-mono text-[10px]">
          {recent.map((r) => {
            const idx = readings.indexOf(r)
            const phase = PHASE_STYLE[classify(readings[idx - 1], r, spec)]
            return (
              <li key={r.seq} className="flex items-center justify-between gap-2">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {r.seq}회 {formatTime(r.servedAt)} · #{r.cacheId} · {r.ageSec.toFixed(1)}초
                </span>
                <span className={`rounded px-1.5 py-0.5 ${phase.className}`}>{phase.label}</span>
              </li>
            )
          })}
        </ul>
      )}
      {last && (
        <div className="border-t border-zinc-100 pt-2 font-mono text-[10px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          HTTP {last.httpStatus} · cache-control: {last.cacheControl ?? '(없음)'}
          {last.nextHeaders.length > 0 && <div>{last.nextHeaders.join(' · ')}</div>}
        </div>
      )}
    </div>
  )
}

export function PresetProbeConsole({ state }: { state: PresetProbeState }) {
  const { readings, error, isAuto, isPending, measureOnce, toggleAuto, reset } = state
  const rounds = readings.short.length
  const buttonClass =
    'cursor-pointer rounded px-3.5 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50'
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          측정 1회 = probe Route Handler를 프리셋별로 한 번씩 호출. 자동 측정은 5초 간격으로 최대 3분 동안 반복합니다.
          {rounds > 0 && <span className="ml-1 font-mono">(누적 {rounds}회)</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleAuto}
            className={`${buttonClass} ${isAuto ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'}`}
          >
            {isAuto ? '자동 측정 정지' : '자동 측정 시작'}
          </button>
          <button
            type="button"
            onClick={() => void measureOnce()}
            disabled={isAuto || isPending}
            className={`${buttonClass} border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200`}
          >
            한 번 측정
          </button>
          <button
            type="button"
            onClick={reset}
            className={`${buttonClass} border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400`}
          >
            초기화
          </button>
        </div>
      </div>
      {error && (
        <p className="rounded border border-rose-200 bg-rose-50 p-2 text-[11px] text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          측정 실패: {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PRESETS.map((spec) => (
          <PresetCard key={spec.key} spec={spec} readings={readings[spec.key]} />
        ))}
      </div>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        시각과 엔트리 나이(초)는 모두 서버 시계 기준입니다. 나이 = 응답 시각 − 이 엔트리가 계산된 시각.
      </p>
    </div>
  )
}
