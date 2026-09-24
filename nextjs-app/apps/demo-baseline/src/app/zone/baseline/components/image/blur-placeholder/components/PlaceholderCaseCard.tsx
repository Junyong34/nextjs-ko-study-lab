'use client'

import React from 'react'
import type { CaseExpectation, ProbeResult } from '../types'

interface Props {
  title: string
  code: string
  expectation: CaseExpectation
  result: ProbeResult
  children: React.ReactNode
}

function describeHref(href: string | null): string {
  if (!href) return '없음'
  const kind = href.startsWith('data:') ? href.slice(0, href.indexOf(',') + 1) : href.slice(0, 40)
  return `${kind}… (${href.length.toLocaleString()}자)`
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'muted' }) {
  const color =
    tone === 'ok'
      ? 'text-emerald-700 dark:text-emerald-400'
      : tone === 'muted'
        ? 'text-zinc-500'
        : 'text-zinc-900 dark:text-zinc-100'
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className={`text-right font-mono ${color}`}>{value}</dd>
    </div>
  )
}

export function PlaceholderCaseCard({ title, code, expectation, result, children }: Props) {
  const { initial } = result
  const hrefMatches =
    initial?.innerHref != null && expectation.expectedHref != null
      ? initial.innerHref === expectation.expectedHref
      : null

  return (
    <div className="space-y-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{title}</h4>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            result.bgNow
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {result.bgNow ? '지금 background-image 있음' : '지금 background-image 없음'}
        </span>
      </div>
      <code className="block truncate text-[10px] text-zinc-500" title={code}>
        {code}
      </code>

      {/* 회색 체크 무늬 위에 올려, placeholder가 없으면 "빈 칸"이 그대로 드러나게 한다 */}
      <div className="overflow-hidden rounded bg-[repeating-conic-gradient(#e4e4e7_0_25%,#f4f4f5_0_50%)] bg-[length:16px_16px] dark:bg-[repeating-conic-gradient(#27272a_0_25%,#18181b_0_50%)]">
        {children}
      </div>

      <dl className="space-y-1 text-[11px]">
        <Row
          label="마운트 직후 style.backgroundImage"
          value={
            initial === null
              ? '측정 중…'
              : initial.cssLength > 0
                ? `있음 (${initial.cssLength.toLocaleString()}자${initial.svgWrapped ? ', SVG 블러 필터' : ''})`
                : '없음'
          }
        />
        <Row label="안에 든 blurDataURL" value={initial === null ? '측정 중…' : describeHref(initial.innerHref)} />
        <Row
          label="출처 대조"
          value={
            hrefMatches === null
              ? expectation.expectedHref === null
                ? '해당 없음'
                : '측정 중…'
              : hrefMatches
                ? `${expectation.source}과 일치`
                : `${expectation.source}과 불일치`
          }
          tone={hrefMatches ? 'ok' : 'muted'}
        />
        <Row label="서버 대기(Resource Timing)" value={result.serverWaitMs === null ? '—' : `${result.serverWaitMs} ms`} />
        <Row label="마운트 → onLoad" value={result.loadMs === null ? '로딩 중…' : `${result.loadMs} ms`} />
        <Row
          label="background-image 제거 시점"
          value={
            result.bgRemovedMs !== null
              ? `${result.bgRemovedMs} ms`
              : initial && initial.cssLength === 0
                ? '처음부터 없음'
                : '아직 남아 있음'
          }
        />
      </dl>
    </div>
  )
}
