'use client'
import React from 'react'
import { YouTubeEmbed } from '@next/third-parties/google'
import { formatHosts } from '../lib/resources'
import { PLAY_LABEL, VIDEO_ID, type LitePhase } from '../types'
import type { LiteEmbedState } from '../hooks/useLiteEmbed'

const PHASE_LABEL: Record<LitePhase, string> = {
  idle: '배치 전',
  loading: 'lite-yt-embed.js 로드 대기(lazyOnload)',
  facade: 'facade 준비 완료: 포스터를 클릭해 보세요',
  activated: '클릭됨: iframe 생성 단계',
  error: '10초 안에 <lite-youtube>가 등록되지 않음(cdn.jsdelivr.net 접속 실패 가능성)',
}

export function LiteEmbedPanel({ lite }: { lite: LiteEmbedState }) {
  const { phase, beforeClick, live, rootRef, mount, onClickCapture } = lite
  const clicked = phase === 'activated'
  return (
    <section className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">A. {'<YouTubeEmbed>'} (lite-youtube-embed)</h4>
        <button type="button" disabled={phase !== 'idle'} onClick={mount}
          className="cursor-pointer rounded bg-zinc-900 px-3 py-1 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
          라이트 임베드 배치
        </button>
      </div>
      <div ref={rootRef} onClickCapture={onClickCapture} className="min-h-24 rounded bg-zinc-100 dark:bg-zinc-900">
        {phase === 'idle'
          ? <p className="p-3 text-zinc-500">아직 배치하지 않았습니다. 배치 전에는 외부 요청이 없습니다.</p>
          : <YouTubeEmbed videoid={VIDEO_ID} playlabel={PLAY_LABEL} params="rel=0" />}
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-zinc-500">상태</dt>
        <dd>{PHASE_LABEL[phase]}</dd>
        <dt className="text-zinc-500">클릭 전 iframe</dt>
        <dd>{clicked ? `${beforeClick?.iframes}개(클릭 직전 고정)` : live ? `${live.iframes}개` : '-'}</dd>
        <dt className="text-zinc-500">클릭 전 플레이어 요청</dt>
        <dd>{clicked ? `${beforeClick?.tally.player}건` : live ? `${live.tally.player}건` : '-'}</dd>
        <dt className="text-zinc-500">클릭 전 외부 요청</dt>
        <dd>{formatHosts((clicked ? beforeClick : live)?.tally.byHost ?? {})}</dd>
        <dt className="text-zinc-500">클릭 후 iframe</dt>
        <dd className="break-all">{clicked && live ? `${live.iframes}개${live.iframeSrc ? ` · ${live.iframeSrc}` : ''}` : '-'}</dd>
        <dt className="text-zinc-500">클릭 후 외부 요청</dt>
        <dd>{clicked && live ? `${formatHosts(live.tally.byHost)} (플레이어 ${live.tally.player}건)` : '-'}</dd>
      </dl>
    </section>
  )
}
