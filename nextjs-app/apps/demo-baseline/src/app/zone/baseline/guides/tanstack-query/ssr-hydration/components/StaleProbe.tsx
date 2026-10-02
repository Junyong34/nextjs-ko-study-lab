'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { dealsQuery } from '../lib/deals-query'
import type { DealsVariant, StaleProbeRun } from '../types'

/** 같은 queryKey를 다른 staleTime으로 구독하는 작은 위젯. 마운트 시 데이터가 staleTime보다 오래됐으면 재요청한다. */
export function StaleProbe({ variant, run }: { variant: DealsVariant; run: StaleProbeRun }) {
  const { data, isFetching } = useQuery({ ...dealsQuery(variant), staleTime: run.staleTime })
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
      #{run.id} staleTime={run.staleTime}
      <span className={isFetching ? 'text-amber-600' : 'text-emerald-600'}>{isFetching ? '요청 중' : `읽기 #${data?.readNo ?? '-'}`}</span>
    </span>
  )
}
