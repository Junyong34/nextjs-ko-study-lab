'use client'
import React, { useState } from 'react'
import type { DeclaredRuntime, RuntimeCheckState, RuntimeProbeResponse } from '../types'

const API_BASE = '/zone/baseline/functions/server-runtime/edge-vs-nodejs/api'

interface RuntimeProbePlaygroundProps {
  onResultChange?: (state: RuntimeCheckState) => void
}

function ProbeColumn({
  target,
  result,
  isLoading,
  onRun,
}: {
  target: DeclaredRuntime
  result: RuntimeProbeResponse | null
  isLoading: boolean
  onRun: () => void
}) {
  const runtimeMatches = result ? result.runtimeEnv === result.declaredRuntime : undefined

  return (
    <div className="flex-1 space-y-2.5 rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
          runtime = &apos;{target}&apos;
        </span>
        <button
          type="button"
          onClick={onRun}
          disabled={isLoading}
          className={`cursor-pointer rounded px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            target === 'edge'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isLoading ? '호출 중...' : `${target === 'edge' ? 'Edge' : 'Node.js'} 라우트 호출`}
        </button>
      </div>

      {!result ? (
        <div className="rounded border border-dashed border-zinc-300 p-3 text-xs text-zinc-400 dark:border-zinc-700">
          버튼을 눌러 /api/{target}에 실제 요청을 보내면 응답이 표시됩니다.
        </div>
      ) : (
        <div className="space-y-2 font-mono text-[11px]">
          <div
            className={`flex items-center justify-between rounded border p-2 ${
              runtimeMatches
                ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                : 'border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20'
            }`}
          >
            <span className="text-zinc-500">process.env.NEXT_RUNTIME:</span>
            <span
              className={`font-bold ${
                runtimeMatches ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
              }`}
            >
              {result.runtimeEnv ?? '(null)'}
            </span>
          </div>

          {result.nodeApiProbes.map((probe) => (
            <div
              key={probe.api}
              className={`rounded border p-2 ${
                probe.ok
                  ? 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20'
                  : 'border-rose-100 bg-rose-50/40 dark:border-rose-950 dark:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <code className="font-sans font-bold text-zinc-700 dark:text-zinc-300">{probe.api}</code>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    probe.ok
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                  }`}
                >
                  {probe.ok ? '성공' : '실패'}
                </span>
              </div>
              <div className="mt-1 break-all text-zinc-500 dark:text-zinc-400">
                {probe.ok ? probe.value : probe.errorMessage}
              </div>
            </div>
          ))}

          <div className="pt-0.5 text-[10px] text-zinc-400">응답 시각: {result.receivedAt}</div>
        </div>
      )}
    </div>
  )
}

export function RuntimeProbePlayground({ onResultChange }: RuntimeProbePlaygroundProps) {
  const [state, setState] = useState<RuntimeCheckState>({ edge: null, nodejs: null })
  const [loadingTarget, setLoadingTarget] = useState<DeclaredRuntime | null>(null)

  const runProbe = async (target: DeclaredRuntime) => {
    setLoadingTarget(target)
    try {
      const res = await fetch(`${API_BASE}/${target}`)
      const data: RuntimeProbeResponse = await res.json()
      setState((prev) => {
        const next = { ...prev, [target]: data }
        onResultChange?.(next)
        return next
      })
    } finally {
      setLoadingTarget(null)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        두 버튼은 실제로 서로 다른 route.ts 두 개(<code>api/edge</code>, <code>api/nodejs</code>)에 HTTP 요청을 보낸다. 각 라우트는
        자신이 실제로 실행 중인 <code>process.env.NEXT_RUNTIME</code> 값과, <code>node:fs</code> /{' '}
        <code>node:crypto</code>를 실제로 호출해본 성공/실패 결과를 그대로 반환한다.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ProbeColumn
          target="edge"
          result={state.edge}
          isLoading={loadingTarget === 'edge'}
          onRun={() => runProbe('edge')}
        />
        <ProbeColumn
          target="nodejs"
          result={state.nodejs}
          isLoading={loadingTarget === 'nodejs'}
          onRun={() => runProbe('nodejs')}
        />
      </div>
    </div>
  )
}
