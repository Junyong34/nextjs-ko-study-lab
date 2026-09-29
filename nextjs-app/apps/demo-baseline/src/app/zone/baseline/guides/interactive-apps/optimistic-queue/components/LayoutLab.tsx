'use client'

import { useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { getSavedLayout, resetSavedLayout } from '../actions'
import { INITIAL_LAYOUT, SAVE_DELAY_MS } from '../constants'
import { useNaiveLayout } from '../hooks/use-naive-layout'
import { useQueuedLayout } from '../hooks/use-queued-layout'
import type { LayoutGroup, LayoutMode } from '../types'
import { LayoutBoard } from './LayoutBoard'
import { LayoutVerification } from './LayoutVerification'

/** 모드나 초기화가 바뀔 때 key로 통째로 다시 마운트해 두 방식의 상태를 섞지 않는다. */
export function LayoutLab() {
  const [mode, setMode] = useState<LayoutMode>('queued')
  const [runKey, setRunKey] = useState(0)

  async function restart(nextMode: LayoutMode) {
    await resetSavedLayout()
    setMode(nextMode)
    setRunKey((k) => k + 1)
  }

  return (
    <LayoutLabRun
      key={`${mode}-${runKey}`}
      mode={mode}
      onMode={restart}
      onReset={() => restart(mode)}
    />
  )
}

type RunProps = {
  mode: LayoutMode
  onMode: (mode: LayoutMode) => void
  onReset: () => Promise<void>
}

function LayoutLabRun({ mode, onMode, onReset }: RunProps) {
  const queued = useQueuedLayout(INITIAL_LAYOUT)
  const naive = useNaiveLayout(INITIAL_LAYOUT)
  const model = mode === 'queued' ? queued : naive
  const [injectFail, setInjectFail] = useState(false)
  const [serverRead, setServerRead] = useState<LayoutGroup[] | null>(null)

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="채널 이동 저장 방식 비교">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <fieldset className="flex items-center gap-3">
              <legend className="sr-only">저장 방식</legend>
              {(['naive', 'queued'] as const).map((value) => (
                <label key={value} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="layout-mode"
                    checked={mode === value}
                    onChange={() => onMode(value)}
                  />
                  {value === 'naive' ? 'naive (확정 상태 기준 스냅샷)' : 'queued (useActionState 큐)'}
                </label>
              ))}
            </fieldset>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={injectFail}
                onChange={(e) => setInjectFail(e.target.checked)}
              />
              다음 이동 저장을 서버에서 실패시키기
            </label>
            <span className="text-zinc-500">
              서버 Action에 관찰용 지연 {SAVE_DELAY_MS}ms를 넣었습니다.
            </span>
          </div>

          <LayoutBoard
            shown={model.shown}
            confirmed={model.confirmed}
            onMove={(change) => {
              setServerRead(null)
              model.move(change, injectFail)
            }}
          />

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              {model.isPending ? '저장 진행 중 (isPending = true)' : '대기 (isPending = false)'}
            </span>
            <button
              type="button"
              onClick={async () => setServerRead(await getSavedLayout())}
              className="rounded-md border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              서버 저장본 다시 읽기
            </button>
            <DemoResetButton onReset={onReset} />
          </div>
          <p className="text-[11px] text-zinc-500">
            서버 저장소는 모듈 메모리라 모든 방문자가 공유하며 재시작하면 사라집니다.
          </p>
        </div>
      </DemoPlaygroundCard>
      <LayoutVerification mode={mode} model={model} serverRead={serverRead} />
    </div>
  )
}
