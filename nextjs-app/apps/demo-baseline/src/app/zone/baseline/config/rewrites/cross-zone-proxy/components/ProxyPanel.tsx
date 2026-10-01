'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { SCENARIOS } from '../expectations'
import type { Measurement, ScenarioId, ZoneId } from '../types'

interface Props {
  upstream: string
  title: string
  onTitleChange: (v: string) => void
  prediction: ZoneId | null
  onPredict: (z: ZoneId) => void
  results: Measurement[]
  error: string | null
  isPending: boolean
  onSend: (id: ScenarioId) => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const zoneText = (z: ZoneId | null) => (z === 'cache' ? 'cache zone' : z === 'baseline' ? 'baseline zone' : '판정 불가')

export function ProxyPanel(p: Props) {
  const latest = p.results[0]
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs text-zinc-600 dark:text-zinc-400">
        업스트림(cache zone, <code>ZONE_CACHE_URL</code>에서 결정): <code className="font-bold">{p.upstream}</code>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 dark:border-zinc-800">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          1) OG 제목(title 쿼리){' '}
          <input
            value={p.title}
            onChange={(e) => p.onTitleChange(e.target.value.slice(0, 40))}
            className="ml-1 w-40 rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <fieldset className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
          <legend className="sr-only">예측</legend>
          <span className="font-bold">2) 어느 zone이 응답할까?</span>
          {(['cache', 'baseline'] as const).map((z) => (
            <label key={z} className="flex cursor-pointer items-center gap-1">
              <input type="radio" name="cross-zone-prediction" checked={p.prediction === z} onChange={() => p.onPredict(z)} />
              {zoneText(z)}
            </label>
          ))}
        </fieldset>
        <DemoResetButton onReset={p.onReset} />
      </div>

      <div className="space-y-1.5">
        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">3) 요청 보내기</div>
        <ul className="space-y-1.5">
          {SCENARIOS.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2">
              <button onClick={() => p.onSend(s.id)} disabled={p.isPending || p.title.trim() === ''} className={btn}>
                {s.label}
              </button>
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] dark:bg-zinc-800">…{s.buildPath(p.title)}</code>
              <span className="text-[11px] text-zinc-500">{s.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1.5 rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800">
        {p.error && <div className="text-rose-400">요청 실패: {p.error}</div>}
        {latest ? (
          <>
            <div>요청 URL: <span className="font-bold text-sky-400">{latest.requestedPath}</span></div>
            <div>응답 URL: <span className="font-bold text-sky-400">{latest.responsePath}</span> · redirected {String(latest.redirected)}</div>
            <div>
              상태 <span className={`font-bold ${latest.status >= 500 ? 'text-rose-400' : 'text-emerald-400'}`}>{latest.status}</span> · content-type {latest.contentType || '-'} · x-powered-by {latest.poweredBy ?? '없음'}
            </div>
            <div>응답한 zone: <span className="font-bold text-amber-400">{zoneText(latest.evidence.zone)}</span> <span className="text-zinc-500">({latest.evidence.basis})</span></div>
            {latest.errorBody !== null && (
              <div className="text-rose-400">응답 본문: {latest.errorBody || '(비어 있음)'} — 업스트림 연결 실패 시 Next.js가 돌려주는 실제 오류입니다.</div>
            )}
            <div className="border-t border-zinc-800 pt-1 text-zinc-500">
              {p.results.map((r, i) => (
                <div key={`${r.measuredAt}-${i}`}>{r.measuredAt} {r.requestedPath} → {r.status} {zoneText(r.evidence.zone)}</div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-zinc-500">{p.isPending ? '요청 중...' : '[요청 보내기] 버튼을 누르기 전입니다.'}</div>
        )}
      </div>

      {latest?.imageUrl && latest.baselineImageUrl && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { src: latest.imageUrl, caption: `프록시 응답 (…/api/og → cache zone)` },
            { src: latest.baselineImageUrl, caption: 'baseline 자체 /og (비교용, 같은 title)' },
          ].map((img) => (
            <figure key={img.caption} className="space-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element -- fetch로 받은 PNG blob(object URL)을 그대로 보여준다 */}
              <img src={img.src} alt={img.caption} className="w-full rounded border border-zinc-200 dark:border-zinc-800" />
              <figcaption className="text-[11px] text-zinc-500">{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
