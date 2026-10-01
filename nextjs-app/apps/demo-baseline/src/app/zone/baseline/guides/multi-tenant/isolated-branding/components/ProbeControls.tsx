'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { useProbe } from './ProbeContext'

export function ProbeControls() {
  const { running, run, clear, probe } = useProbe()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={run}
        disabled={running}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {running ? '측정 중...' : '테넌트 실측 실행'}
      </button>
      <DemoResetButton onReset={clear} label="측정 초기화" disabled={!probe} />
      <span className="text-[11px] text-zinc-500">/acme · /globex · /initech · /umbrella 를 실제로 요청해 응답 HTML 을 비교합니다.</span>
    </div>
  )
}
