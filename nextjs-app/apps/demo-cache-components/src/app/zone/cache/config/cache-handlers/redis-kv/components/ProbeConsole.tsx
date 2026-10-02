'use client'
import React from 'react'
import type { HandlerProbeState } from '../hooks/useHandlerProbe'
import type { ProbeRecord } from '../types'

const PHASE_LABEL = {
  first: '첫 읽기',
  hit: '재사용 (같은 cacheId)',
  recomputed: '다시 계산 (새 cacheId)',
} as const

const time = (ms: number) => new Date(ms).toLocaleTimeString('ko-KR', { hour12: false })

function RecordRow({ record }: { record: ProbeRecord }) {
  if (record.kind === 'invalidate') {
    return (
      <tr className="bg-amber-50/60 dark:bg-amber-950/20">
        <td className="px-2 py-1">{record.seq}</td>
        <td className="px-2 py-1" colSpan={3}>
          무효화 <code className="break-all">revalidateTag(&apos;{record.tag}&apos;, {'{ expire: 0 }'})</code>
        </td>
        <td className="px-2 py-1 font-mono">{record.instance.pid}</td>
      </tr>
    )
  }
  return (
    <tr>
      <td className="px-2 py-1">{record.seq}</td>
      <td className="px-2 py-1 font-mono">{record.snapshot.cacheId}</td>
      <td className="px-2 py-1 font-mono">{time(record.snapshot.generatedAt)}</td>
      <td className="px-2 py-1">{PHASE_LABEL[record.phase]}</td>
      <td className="px-2 py-1 font-mono">{record.instance.pid}</td>
    </tr>
  )
}

export function ProbeConsole({ probe }: { probe: HandlerProbeState }) {
  const { records, error, isPending, read, invalidate, clear } = probe
  const latest = records.at(-1)?.instance

  return (
    <section className="min-w-0 space-y-3" aria-label="기본 캐시 핸들러 실측">
      <h3 className="font-semibold">기본 캐시 핸들러 실측 (cacheHandlers 미설정 상태)</h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        [캐시 읽기]는 probe Route Handler가 <code>&apos;use cache&apos;</code> 함수를 호출한 결과를 받아 옵니다. cacheId는 함수 본문이
        실제로 실행될 때만 새로 만들어집니다. 응답마다 그 요청을 처리한 Node.js 프로세스의 PID와 시작 시각도 함께 측정합니다.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={read}
          disabled={isPending}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          캐시 읽기
        </button>
        <button
          type="button"
          onClick={invalidate}
          disabled={isPending}
          className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-40 dark:border-zinc-700"
        >
          캐시 무효화
        </button>
        <button type="button" onClick={clear} disabled={isPending} className="rounded px-3 py-1.5 text-xs text-zinc-600 underline underline-offset-4 disabled:opacity-40 dark:text-zinc-400">
          기록 지우기
        </button>
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">요청 실패: {error}</p>}
      {latest && (
        <p className="text-xs">
          응답한 프로세스: PID <span className="font-mono">{latest.pid}</span> · 시작 {time(latest.startedAt)} · NODE_ENV{' '}
          <span className="font-mono">{latest.nodeEnv}</span>
        </p>
      )}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[30rem] text-left text-xs">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-2 py-1 font-medium">회차</th>
              <th className="px-2 py-1 font-medium">cacheId</th>
              <th className="px-2 py-1 font-medium">계산 시각</th>
              <th className="px-2 py-1 font-medium">판정</th>
              <th className="px-2 py-1 font-medium">PID</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td className="px-2 py-2 text-zinc-500" colSpan={5}>
                  아직 측정 기록이 없습니다. [캐시 읽기]를 두 번 누르세요.
                </td>
              </tr>
            ) : (
              records.map((record) => <RecordRow key={record.seq} record={record} />)
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500">
        [기록 지우기]는 화면 기록만 지웁니다. 서버 메모리의 엔트리는 남아 있으므로 지운 뒤 첫 읽기는 기존 cacheId를 다시 받을 수 있습니다.
        이 앱은 프로세스 하나로 실행되므로 다른 인스턴스와 캐시를 공유하지 않는 현상은 여기서 재현하지 않습니다.
      </p>
    </section>
  )
}
