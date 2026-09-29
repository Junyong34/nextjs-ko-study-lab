'use client'

import React, { useEffect, useState } from 'react'
import type { CachedPresetSnapshot } from '../cachedData'
import { PRESET_SPECS } from '../presetSpecs'

interface CacheLifePresetsDemoProps {
  seconds: CachedPresetSnapshot
  hours: CachedPresetSnapshot
  max: CachedPresetSnapshot
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}초`
  if (totalSeconds < 3600) return `${Math.round(totalSeconds / 60)}분`
  if (totalSeconds < 86400) return `${Math.round(totalSeconds / 3600)}시간`
  if (totalSeconds < 31_536_000) return `${Math.round(totalSeconds / 86400)}일`
  return `${Math.round(totalSeconds / 31_536_000)}년`
}

function useElapsedSeconds(enabled: boolean): number {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000)
    return () => clearInterval(id)
  }, [enabled])
  return elapsed
}

const PHASE_TONE_CLASS: Record<'emerald' | 'amber' | 'rose', string> = {
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
}

function PresetCard({
  profileKey,
  snapshot,
  showLiveClock,
}: {
  profileKey: 'seconds' | 'hours' | 'max'
  snapshot: CachedPresetSnapshot
  showLiveClock?: boolean
}) {
  const spec = PRESET_SPECS[profileKey]
  const elapsed = useElapsedSeconds(Boolean(showLiveClock))

  const phase = !showLiveClock
    ? null
    : elapsed < spec.revalidate
    ? { label: 'FRESH (캐시 재사용)', tone: 'emerald' as const }
    : elapsed < spec.expire
    ? { label: '백그라운드 재계산 구간', tone: 'amber' as const }
    : { label: '완전 만료 구간', tone: 'rose' as const }

  return (
    <div className="space-y-2.5 rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2">
        <code className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {spec.label}
        </code>
        <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          #{snapshot.cacheId}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          stale {formatDuration(spec.stale)}
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          revalidate {formatDuration(spec.revalidate)}
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          expire {formatDuration(spec.expire)}
        </div>
      </div>

      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
        생성 시각: <span className="font-mono">{snapshot.generatedAt}</span>
      </div>

      {phase && (
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-500 dark:text-zinc-400">경과 {elapsed}초 (진입 후)</span>
          <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${PHASE_TONE_CLASS[phase.tone]}`}>
            {phase.label}
          </span>
        </div>
      )}
    </div>
  )
}

export function CacheLifePresetsDemo({ seconds, hours, max }: CacheLifePresetsDemoProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          아래 세 카드는 서로 다른 <code>cacheLife()</code> 프리셋을 선언한 서버의 실제{' '}
          <code>'use cache'</code> 함수 3개가 이번 요청에서 반환한 값입니다.
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          전체 새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <PresetCard profileKey="seconds" snapshot={seconds} showLiveClock />
        <PresetCard profileKey="hours" snapshot={hours} />
        <PresetCard profileKey="max" snapshot={max} />
      </div>

      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        seconds 카드는 revalidate가 1초라 새로고침 간격이 1초만 넘어도 캐시 ID·생성 시각이 거의
        매번 바뀝니다. hours/max 카드는 revalidate가 1시간/30일이므로 이 실습 세션 동안은 캐시
        ID가 바뀌지 않는 것이 정상입니다 — "변화가 없다"는 관찰 결과 자체가 학습 포인트입니다.
      </p>
    </div>
  )
}
