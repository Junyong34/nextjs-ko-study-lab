'use client'
import React, { useEffect, useState } from 'react'
import type { ProbeRun, ServerSeen } from '../types'
import { ZONE_LABEL } from '../lib/zone'

interface Props {
  serverSeen: ServerSeen
  run: ProbeRun | null
  error: string | null
  isPending: boolean
  onProbe: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const ROW_LABEL = { learner: '학습자 URL', internal: '내부 URL(이 페이지)', cache: 'cache zone 페이지' } as const

/** 브라우저가 보고 있는 주소. 셸 화면의 iframe 안이면 바깥(top) 문서 주소도 같은 origin이라 읽을 수 있다. */
function useBrowserAddress() {
  const [addr, setAddr] = useState<{ self: string; top: string | null } | null>(null)
  useEffect(() => {
    let top: string | null = null
    try {
      if (window.top && window.top !== window) top = window.top.location.pathname
    } catch {
      top = '(다른 origin이라 읽을 수 없음)'
    }
    setAddr({ self: `${window.location.origin}${window.location.pathname}`, top })
  }, [])
  return addr
}

export function ProbePanel({ serverSeen, run, error, isPending, onProbe }: Props) {
  const addr = useBrowserAddress()
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onProbe} disabled={isPending} className={btn}>
          {isPending ? '요청 중...' : '같은 origin 응답 측정'}
        </button>
        <span className="text-xs text-zinc-500">현재 문서: <code>{addr?.self ?? '측정 중'}</code></span>
      </div>
      <dl className="grid gap-1 rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900/50 sm:grid-cols-2">
        <div>baseline 서버가 받은 host: <strong>{serverSeen.host ?? '없음'}</strong></div>
        <div>x-forwarded-host: <strong>{serverSeen.forwardedHost ?? '없음'}</strong></div>
        <div>바깥(top) 문서 경로: <strong>{addr ? (addr.top ?? 'iframe 아님') : '측정 중'}</strong></div>
        <div>서버 렌더 시각: {serverSeen.renderedAt}</div>
      </dl>
      {error && <p className="text-xs text-rose-600">요청 실패: {error}</p>}
      {run ? (
        <table className="w-full table-fixed border-collapse text-left font-mono text-[11px]">
          <thead className="text-zinc-500">
            <tr>
              <th className="w-1/4 py-1">요청</th>
              <th className="w-[12%]">상태</th>
              <th className="w-1/4">응답 zone</th>
              <th>근거</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {(['learner', 'internal', 'cache'] as const).map((k) => {
              const p = run.pages[k]
              return (
                <tr key={k} className="align-top">
                  <td className="py-1 pr-2">{ROW_LABEL[k]}<br /><span className="break-all text-zinc-500">{p.path}</span></td>
                  <td>{p.status}</td>
                  <td>{ZONE_LABEL[p.zone]}</td>
                  <td className="break-all">x-powered-by: {p.poweredBy ?? '없음'}<br />{p.firstScript ?? 'script 없음'}</td>
                </tr>
              )
            })}
            <tr className="align-top">
              <td className="py-1 pr-2">cache zone 자산</td>
              <td>{run.asset?.status ?? '-'}</td>
              <td>{run.asset ? ZONE_LABEL.cache : '-'}</td>
              <td className="break-all">{run.asset ? `${run.asset.contentType} · ${run.asset.path}` : 'cache 응답에 cache 자산이 없어 요청하지 않음'}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-xs text-zinc-500">[같은 origin 응답 측정]을 누르기 전입니다.</p>
      )}
      {run && (
        <p className="text-[11px] text-zinc-500">
          origin {run.origin} · 이 페이지가 받은 스크립트: /demo-static/baseline/ {run.ownAssets.baseline}개, 그 밖 {run.ownAssets.other}개 · {run.measuredAt}
        </p>
      )}
    </div>
  )
}
