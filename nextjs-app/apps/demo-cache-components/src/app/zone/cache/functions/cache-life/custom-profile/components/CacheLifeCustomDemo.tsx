'use client'

import React, { useEffect, useState } from 'react'
import type { CachedProfileSnapshot } from '../cachedData'
import type { ProfileSpec } from '../profileSpecs'
import { CUSTOM_PROFILE_SPEC, BUILTIN_COMPARE_SPEC } from '../profileSpecs'

interface CacheLifeCustomDemoProps {
  custom: CachedProfileSnapshot
  compare: CachedProfileSnapshot
}

function useElapsedSeconds(): number {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return elapsed
}

const PHASE_TONE_CLASS: Record<'emerald' | 'amber' | 'rose', string> = {
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
}

function ProfileCard({
  spec,
  snapshot,
  origin,
}: {
  spec: ProfileSpec
  snapshot: CachedProfileSnapshot
  origin: 'custom' | 'builtin'
}) {
  const elapsed = useElapsedSeconds()

  const phase =
    elapsed < spec.revalidate
      ? { label: 'FRESH (캐시 재사용)', tone: 'emerald' as const }
      : elapsed < spec.expire
      ? { label: '백그라운드 재계산 구간', tone: 'amber' as const }
      : { label: '완전 만료 구간', tone: 'rose' as const }

  const originBadge =
    origin === 'custom'
      ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'

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

      <span className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${originBadge}`}>
        {origin === 'custom' ? 'next.config.ts에 새로 정의한 값' : "next.config.ts 미수정 · 내장 프리셋 그대로"}
      </span>

      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          stale {spec.stale}초
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          revalidate {spec.revalidate}초
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          expire {spec.expire}초
        </div>
      </div>

      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
        생성 시각: <span className="font-mono">{snapshot.generatedAt}</span>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-zinc-500 dark:text-zinc-400">경과 {elapsed}초 (진입 후)</span>
        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${PHASE_TONE_CLASS[phase.tone]}`}>
          {phase.label}
        </span>
      </div>
    </div>
  )
}

export function CacheLifeCustomDemo({ custom, compare }: CacheLifeCustomDemoProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          아래 두 카드는 next.config.ts의 <code>cacheLife</code>에 바인딩된, 서로 다른 실제{' '}
          <code>'use cache'</code> 함수 2개가 이번 요청에서 반환한 값입니다.
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          전체 새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ProfileCard spec={CUSTOM_PROFILE_SPEC} snapshot={custom} origin="custom" />
        <ProfileCard spec={BUILTIN_COMPARE_SPEC} snapshot={compare} origin="builtin" />
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-[11px] text-zinc-300 dark:border-zinc-800 space-y-1">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1 mb-1">
          이 데모의 next.config.ts (실제 파일 내용):
        </div>
        <div className="text-blue-300">cacheLife: {'{'}</div>
        <div className="pl-4 text-amber-300">'functions-cache-life-custom-profile:restock-alert': {'{'} stale: 20, revalidate: 45, expire: 240 {'}'},</div>
        <div className="text-blue-300">{'}'}</div>
        <div className="mt-2 text-zinc-500">// cachedData.ts</div>
        <div className="text-emerald-400">cacheLife('functions-cache-life-custom-profile:restock-alert')</div>
        <div className="text-emerald-400">cacheLife('minutes') <span className="text-zinc-500">// next.config.ts 수정 없이 바로 사용</span></div>
      </div>

      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        custom-profile 카드는 revalidate가 45초라 새로고침 간격이 45초를 넘으면 캐시 ID가
        바뀝니다. minutes 카드는 revalidate가 60초로 더 길어서 같은 시점에 아직 안 바뀔 수
        있습니다 — 두 카드의 재계산 시점이 서로 다른 것 자체가 "내장 프리셋만으로는 부족해서
        커스텀 프로필을 정의했다"는 학습 포인트입니다.
      </p>
    </div>
  )
}
