'use client'
import React from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { DemoResetButton } from '@study/demo-kit'
import { DEMO_EVENT_NAME, DEMO_GA_ID, type ScriptLoad } from '../types'
import type { GaLabState } from '../hooks/useGaLab'

const btn = 'cursor-pointer rounded px-3.5 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50'

const LOAD_LABEL: Record<ScriptLoad, string> = {
  idle: '아직 요청하지 않음',
  loading: '요청 중',
  loaded: 'load 이벤트 수신(googletagmanager.com 접속 성공)',
  error: 'error 이벤트 수신(외부 접속 실패: 차단·오프라인)',
  timeout: '10초 동안 응답 없음(판정 불가)',
}

function yesNo(v: boolean) {
  return v ? '있음' : '없음'
}

export function GaPlayground({ lab }: { lab: GaLabState }) {
  const { mounted, load, loadMs, snapshot: s, push, gaRequestsAtEntry, mount, sendEvent } = lab
  const hosts = s ? Object.entries(s.externalHosts) : []
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      {/* 버튼을 누르기 전까지 GoogleAnalytics는 렌더되지 않는다: 외부 요청은 사용자 조작 이후에만 나간다. */}
      {mounted && <GoogleAnalytics gaId={DEMO_GA_ID} />}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-zinc-900 dark:text-zinc-100">에어 러너 운동화 · sku-1024 · 129,000원</p>
          <p className="text-zinc-500">
            측정 ID <code>{DEMO_GA_ID}</code>는 데모용 값입니다. 실제 GA 속성이 아니며 collect 전송도 opt-out으로 막아 측정이 일어나지 않습니다.
          </p>
        </div>
        <DemoResetButton label="새로고침으로 초기화" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={mounted} onClick={mount}
          className={`${btn} bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`}>
          {'<GoogleAnalytics gaId="G-DEMO000000" />'} 렌더
        </button>
        <button type="button" onClick={sendEvent}
          className={`${btn} border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300`}>
          장바구니 담기: sendGAEvent(&apos;event&apos;, &apos;{DEMO_EVENT_NAME}&apos;, …){mounted ? '' : ' (렌더 전 호출)'}
        </button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-zinc-500">진입 시 GA 호스트 요청</dt>
        <dd>{gaRequestsAtEntry === null ? '측정 중' : `${gaRequestsAtEntry}건`}</dd>
        <dt className="text-zinc-500">{'<script id="_next-ga-init">'}</dt>
        <dd>{s ? `${yesNo(s.initScript)} · gtag('config', '${DEMO_GA_ID}') ${s.initHasConfig ? '포함' : '미포함'}` : '-'}</dd>
        <dt className="text-zinc-500">{'<script id="_next-ga">'}</dt>
        <dd className="break-all">{s?.extScriptSrc ? <><code>{s.extScriptSrc}</code> · data-nscript=<code>{s.extStrategy}</code></> : '없음'}</dd>
        <dt className="text-zinc-500">{'<link rel="preload">'}</dt>
        <dd>{s ? yesNo(s.preloadLink) : '-'}</dd>
        <dt className="text-zinc-500">window.dataLayer</dt>
        <dd>{s?.dataLayerLength == null ? '없음' : `배열 ${s.dataLayerLength}개 · 명령 [${s.commands.join(', ')}]`}</dd>
        <dt className="text-zinc-500">typeof window.gtag</dt>
        <dd><code>{s?.gtagType ?? '-'}</code></dd>
        <dt className="text-zinc-500">gtag.js 외부 로드</dt>
        <dd>{LOAD_LABEL[load]}{loadMs !== null ? ` · ${loadMs}ms` : ''}</dd>
        <dt className="text-zinc-500">collect(측정 전송) 요청</dt>
        <dd>{s ? `${s.collectRequests}건` : '-'}</dd>
        <dt className="text-zinc-500">외부 호스트별 요청</dt>
        <dd>{hosts.length === 0 ? '0건' : hosts.map(([h, n]) => `${h} ${n}건`).join(' · ')}</dd>
      </dl>
      <div className="rounded bg-zinc-100 p-2 font-mono dark:bg-zinc-900">
        {push ? (
          <>
            <p>[{push.at}] {push.phase === 'before-mount' ? '렌더 전 호출' : '렌더 후 호출'} · dataLayer 길이 {String(push.before)} → {String(push.after)}</p>
            <p className="break-all">push된 항목: {push.pushed.length === 0 ? '없음' : JSON.stringify(push.pushed)}</p>
          </>
        ) : (
          <p className="text-zinc-500">아직 sendGAEvent를 호출하지 않았습니다.</p>
        )}
      </div>
    </div>
  )
}
