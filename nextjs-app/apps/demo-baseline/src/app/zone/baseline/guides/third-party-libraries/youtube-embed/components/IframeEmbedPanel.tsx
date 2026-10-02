'use client'
import React from 'react'
import { formatHosts } from '../lib/resources'
import { CONTROL_SRC, PLAY_LABEL } from '../types'
import type { IframeEmbedState } from '../hooks/useIframeEmbed'

export function IframeEmbedPanel({ control }: { control: IframeEmbedState }) {
  const { mounted, loaded, live, mount, onLoad } = control
  return (
    <section className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">B. 대조군: 일반 {'<iframe>'}</h4>
        <button type="button" disabled={mounted} onClick={mount}
          className="cursor-pointer rounded border border-zinc-300 px-3 py-1 font-bold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300">
          일반 iframe 배치
        </button>
      </div>
      <div className="min-h-24 rounded bg-zinc-100 dark:bg-zinc-900">
        {mounted ? (
          <iframe
            src={CONTROL_SRC}
            title={PLAY_LABEL}
            onLoad={onLoad}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-video w-full max-w-[720px] rounded"
          />
        ) : (
          <p className="p-3 text-zinc-500">배치하는 순간 재생을 누르지 않아도 YouTube 플레이어 문서를 요청합니다.</p>
        )}
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-zinc-500">배치 직후 iframe</dt>
        <dd>{mounted ? '1개(클릭 없이 즉시)' : '-'}</dd>
        <dt className="text-zinc-500">플레이어 문서 요청</dt>
        <dd>{live ? `${live.player}건` : '-'}</dd>
        <dt className="text-zinc-500">iframe load 이벤트</dt>
        <dd>{mounted ? (loaded ? '수신' : '대기') : '-'}</dd>
        <dt className="text-zinc-500">배치 후 외부 요청</dt>
        <dd>{live ? formatHosts(live.byHost) : '-'}</dd>
      </dl>
    </section>
  )
}
