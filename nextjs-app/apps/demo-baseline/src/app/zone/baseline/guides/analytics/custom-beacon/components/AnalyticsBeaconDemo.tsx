'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { BEACON_ENDPOINT } from '../types'
import type { useBeaconLab } from '../hooks/useBeaconLab'

type Lab = ReturnType<typeof useBeaconLab>

const btn =
  'cursor-pointer rounded px-3.5 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50'

export function AnalyticsBeaconDemo({ lab }: { lab: Lab }) {
  const { attempt, received, phase, send, reset } = lab
  const busy = phase === 'checking'
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">에어 러너 운동화 · sku-1024</p>
          <p className="text-zinc-500">수신 엔드포인트: <code>{BEACON_ENDPOINT}</code></p>
        </div>
        <DemoResetButton onReset={reset} label="서버 기록 초기화" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => send('ok')}
          className={`${btn} bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`}>
          구매하기 클릭 (정상 엔드포인트로 비콘 전송)
        </button>
        <button type="button" disabled={busy} onClick={() => send('missing')}
          className={`${btn} border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300`}>
          잘못된 엔드포인트로 비콘 전송 (실패 사례)
        </button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-zinc-500">클라이언트</dt>
        <dd>
          {attempt
            ? <>id <code>{attempt.id}</code> · sendBeacon() 반환값 <code>{String(attempt.queued)}</code> (전송 큐 등록 여부일 뿐 수신 보증이 아님)</>
            : '아직 전송하지 않음'}
        </dd>
        <dt className="text-zinc-500">서버 수신 목록</dt>
        <dd>{received.length}건 (서버 프로세스 메모리, 최근 20건)</dd>
      </dl>
      <ul className="space-y-1 text-xs font-mono">
        {received.map((r) => (
          <li key={r.id + r.receivedAt} className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-900">
            {r.id} · {r.event} · {r.productId} · {r.method} · {r.contentType}
          </li>
        ))}
      </ul>
    </div>
  )
}
