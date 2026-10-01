'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { BURST_SIZE } from '../lib/probe'
import type { BurstResult, FailProbe, Prediction, ProbeRuntime } from '../types'

interface Props {
  prediction: Prediction | null
  onPredict: (p: Prediction) => void
  bursts: Partial<Record<ProbeRuntime, BurstResult>>
  fail: FailProbe | null
  error: string | null
  isPending: boolean
  onBurst: (r: ProbeRuntime) => void
  onFail: () => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const time = (ms: number) => new Date(ms).toLocaleTimeString('ko-KR')

function BurstTable({ b }: { b: BurstResult }) {
  return (
    <div className="overflow-x-auto">
      <div className="mb-1 font-sans text-[11px] font-bold text-zinc-400">
        api/{b.runtime === 'nodejs' ? 'node' : 'edge'} · runtime={b.runtime} · {b.measuredAt}
      </div>
      <table className="w-full text-left text-[11px]">
        <thead className="text-zinc-500">
          <tr><th>#</th><th>bootedAt</th><th>pid</th><th>registerCallCount</th><th>handlerRequestCount(대조)</th><th>핸들러 모듈 로드</th></tr>
        </thead>
        <tbody>
          {b.probes.map((p, i) => (
            <tr key={`${p.receivedAt}-${i}`}>
              <td>{i + 1}</td>
              <td className="text-amber-400">{p.snapshot ? time(p.snapshot.bootedAtMs) : '없음'}</td>
              <td className="text-amber-400">{p.snapshot?.pid ?? '-'}</td>
              <td className="font-bold text-emerald-400">{p.snapshot?.registerCallCount ?? '-'}</td>
              <td className="font-bold text-sky-400">{p.handlerRequestCount}</td>
              <td className="text-zinc-500">{time(p.handlerLoadedAtMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProbePanel(p: Props) {
  const hasData = p.bursts.nodejs || p.bursts.edge || p.fail
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 dark:border-zinc-800">
        <fieldset className="flex flex-wrap items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
          <legend className="sr-only">예측</legend>
          <span className="font-bold">1) {BURST_SIZE}번 요청하면 registerCallCount는?</span>
          {(['unchanged', 'increases'] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-1">
              <input type="radio" name="register-hook-prediction" checked={p.prediction === v} onChange={() => p.onPredict(v)} />
              {v === 'unchanged' ? '그대로다' : '요청마다 늘어난다'}
            </label>
          ))}
        </fieldset>
        <DemoResetButton onReset={p.onReset} />
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="font-bold text-zinc-700 dark:text-zinc-300">2) 요청 보내기</div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => p.onBurst('nodejs')} disabled={p.isPending} className={btn}>Node.js 핸들러 {BURST_SIZE}회</button>
          <button onClick={() => p.onBurst('edge')} disabled={p.isPending} className={btn}>Edge 핸들러 {BURST_SIZE}회</button>
          <button onClick={p.onFail} disabled={p.isPending} className={btn}>오류 발생(onRequestError)</button>
          {p.isPending && <span className="text-zinc-500">요청 중...</span>}
        </div>
        <p className="text-[11px] text-zinc-500">
          각 버튼은 이 데모 아래 실제 Route Handler(api/node, api/edge, api/fail)에 fetch를 보냅니다. Edge 핸들러를 처음 부르면 Edge isolate가 그때 만들어지며 register()가 그 안에서 따로 실행됩니다.
        </p>
      </div>

      <div className="space-y-3 rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800">
        {p.error && <div className="text-rose-400">요청 실패: {p.error}</div>}
        {!hasData && <div className="text-zinc-500">[요청 보내기] 버튼을 누르기 전입니다.</div>}
        {p.bursts.nodejs && <BurstTable b={p.bursts.nodejs} />}
        {p.bursts.edge && <BurstTable b={p.bursts.edge} />}
        {p.fail && (
          <div className="space-y-0.5">
            <div className="font-sans text-[11px] font-bold text-zinc-400">POST api/fail</div>
            <div>응답 상태 <span className="font-bold text-rose-400">{p.fail.status}</span> · registerCallCount {p.fail.registerCountBefore ?? '-'} → {p.fail.registerCountAfter ?? '-'}</div>
            {p.fail.captured.map((e) => (
              <div key={e.capturedAt}>
                onRequestError ← routeType=<span className="text-amber-400">{e.routeType}</span> path={e.path} message=&quot;{e.message}&quot;
              </div>
            ))}
            {p.fail.captured.length === 0 && <div className="text-zinc-500">새로 기록된 onRequestError 호출이 없습니다.</div>}
          </div>
        )}
      </div>
    </div>
  )
}
