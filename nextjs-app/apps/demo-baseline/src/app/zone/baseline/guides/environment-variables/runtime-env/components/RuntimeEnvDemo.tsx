'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { ENV_NAMES, type EnvName, type EnvReadResult, type EnvSnapshot, type Prediction } from '../types'

interface RuntimeEnvDemoProps {
  name: EnvName
  onNameChange: (name: EnvName) => void
  prediction: Prediction | null
  onPredict: (p: Prediction) => void
  reads: EnvReadResult[]
  serverSnapshot: EnvSnapshot
  renderTimes: string[]
  isPending: boolean
  onRead: () => void
  onRerender: () => void
  onReset: () => void
}

const show = (v: string | null) => (v === null ? 'undefined(값 없음)' : `"${v}"`)
const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'

export function RuntimeEnvDemo(p: RuntimeEnvDemoProps) {
  const latest = p.reads[0]
  const prev = p.reads[1]
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 dark:border-zinc-800">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          1) 변수{' '}
          <select
            value={p.name}
            onChange={(e) => p.onNameChange(e.target.value as EnvName)}
            className="ml-1 rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900"
          >
            {ENV_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <fieldset className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
          <legend className="sr-only">예측</legend>
          <span className="font-bold">2) 브라우저에서도 서버와 같은 값이 보일까?</span>
          {(['same', 'different'] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-1">
              <input type="radio" name="prediction" checked={p.prediction === v} onChange={() => p.onPredict(v)} />
              {v === 'same' ? '같다' : '다르다'}
            </label>
          ))}
        </fieldset>
        <button onClick={p.onRead} disabled={p.isPending} className={btn}>
          {p.isPending ? '처리 중...' : '3) 변수 읽기 (api/status 호출)'}
        </button>
        <button onClick={p.onRerender} disabled={p.isPending} className={btn}>
          4) 서버 렌더 다시 실행 (router.refresh)
        </button>
        <DemoResetButton onReset={p.onReset} />
      </div>

      <div className="space-y-1.5 rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800">
        {latest ? (
          <>
            <div>서버(Route Handler) process.env[&quot;{latest.name}&quot;]: <span className="font-bold text-emerald-400">{show(latest.server.values[latest.name])}</span></div>
            <div>브라우저 리터럴 process.env.{latest.name}: <span className="font-bold text-sky-400">{show(latest.browserLiteral)}</span></div>
            <div>브라우저 동적 process.env[&quot;{latest.name}&quot;]: <span className="font-bold text-amber-400">{show(latest.browserDynamic)}</span></div>
            <div className="border-t border-zinc-800 pt-1">
              pid {latest.server.pid} · 요청 #{latest.server.requestCount} · evaluatedAt {latest.server.evaluatedAt}
              {prev && ` · 직전 요청 #${prev.server.requestCount} (${prev.server.evaluatedAt})`}
            </div>
          </>
        ) : (
          <div className="text-zinc-500">[변수 읽기]를 누르기 전입니다.</div>
        )}
        <div className="border-t border-zinc-800 pt-1">
          서버 렌더(page.tsx, connection() 이후) 실행 이력 {p.renderTimes.length}회 · 최신 {p.serverSnapshot.evaluatedAt}
          {' · '}값 {show(p.serverSnapshot.values[p.name])}
        </div>
      </div>
    </div>
  )
}
