'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { PNF_BASE_PATH, type ProbeSnapshot } from '../types'
import { useTriggerRunner } from '../hooks/useTriggerRunner'
import { TriggerLinks } from './TriggerLinks'
import { ResultTable } from './ResultTable'
import { ProbeTable } from './ProbeTable'
import { VerificationFooter } from './VerificationFooter'

export function ProgrammaticNotFoundLab() {
  const { frameRef, results, runningKey, run, clear } = useTriggerRunner()
  const [probe, setProbe] = useState<ProbeSnapshot | null>(null)

  const refresh = useCallback(async () => {
    const res = await fetch(`${PNF_BASE_PATH}/api/probe`, { cache: 'no-store' })
    setProbe(await res.json())
  }, [])

  useEffect(() => {
    refresh().catch(() => {})
  }, [refresh])

  const runAll = async () => {
    await run()
    await refresh()
  }

  const reset = async () => {
    const res = await fetch(`${PNF_BASE_PATH}/api/probe`, { method: 'DELETE', cache: 'no-store' })
    setProbe(await res.json())
    clear()
  }

  return (
    <>
      <DemoPlaygroundCard title="notFound() 호출 위치·조건별 트리거 실측">
        <div className="space-y-5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">상품 카탈로그 (P-100 공개 · P-200 비공개 · P-300 초안)</h4>
              <p className="text-xs text-zinc-500">
                같은 [id] 라우트 안의 서로 다른 지점에서 서로 다른 조건으로 notFound()를 호출합니다.
              </p>
            </div>
            <DemoResetButton onReset={reset} label="카운터 초기화" disabled={runningKey !== null} />
          </div>

          <TriggerLinks />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">7개 트리거 한 번에 실측</h5>
              <button
                type="button"
                onClick={runAll}
                disabled={runningKey !== null}
                className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {runningKey ? `실측 중... (${runningKey})` : '전체 트리거 실측 실행'}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              숨은 iframe에 각 URL을 실제로 띄우거나(문서 요청), P-100 화면 안의 Link·Server Action 버튼을 실제로 클릭한 뒤,
              DOM의 경계 식별자와 서버 카운터 증감을 읽습니다.
            </p>
            <ResultTable results={results} runningKey={runningKey} />
            <iframe ref={frameRef} title="notFound 트리거 실측용 프레임" className="hidden" />
          </div>

          <ProbeTable probe={probe} onRefresh={() => refresh().catch(() => {})} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter results={results} isRunning={runningKey !== null} />
    </>
  )
}
