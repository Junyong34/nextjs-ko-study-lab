'use client'

import React from 'react'
import type { ComparisonResult, MeasuredResponse } from '../types'

const bytes = (v: number) => `${v.toLocaleString()} B`

interface Row {
  label: string
  hint: string
  render: (m: MeasuredResponse) => React.ReactNode
}

const ROWS: Row[] = [
  { label: 'HTTP 상태', hint: 'Response.status', render: (m) => m.status },
  {
    label: '본문 크기',
    hint: 'Resource Timing decodedBodySize',
    render: (m) => (m.decodedBodySize > 0 ? bytes(m.decodedBodySize) : '브라우저 미제공'),
  },
  {
    label: '선로 위 본문',
    hint: 'encodedBodySize (압축 적용 시 더 작음)',
    render: (m) => (m.encodedBodySize > 0 ? bytes(m.encodedBodySize) : '브라우저 미제공'),
  },
  {
    label: '전송량(헤더 포함)',
    hint: 'transferSize',
    render: (m) => (m.transferSize > 0 ? bytes(m.transferSize) : '브라우저 미제공'),
  },
  { label: '최상위 키 수', hint: 'Object.keys(body)', render: (m) => m.topLevelKeys.length },
  { label: '값(리프) 개수', hint: '배열 원소 포함 원시값 수', render: (m) => m.leafCount },
  { label: '중첩 깊이', hint: '평탄한 객체 = 1', render: (m) => m.maxDepth },
  {
    label: '민감 필드',
    hint: 'SENSITIVE_KEYS 재귀 검사',
    render: (m) =>
      m.sensitivePaths.length === 0 ? (
        <span className="text-emerald-700 dark:text-emerald-400">없음</span>
      ) : (
        <span className="text-rose-700 dark:text-rose-400" title={m.sensitivePaths.join('\n')}>
          {m.sensitivePaths.length}곳 ({[...new Set(m.sensitivePaths.map((p) => p.split('.').pop()!.replace(/\[\d+\]$/, '')))].join(', ')})
        </span>
      ),
  },
  {
    label: '레거시 호출',
    hint: 'Server-Timing 헤더의 legacy 항목',
    render: (m) => (m.legacyCalled === null ? '(원본 자체)' : m.legacyCalled ? '호출함' : '호출 안 함'),
  },
]

export function ComparisonTable({ result }: { result: ComparisonResult }) {
  const { legacy, bff } = result
  const ratio =
    legacy.decodedBodySize > 0 && bff.decodedBodySize > 0
      ? Math.round((1 - bff.decodedBodySize / legacy.decodedBodySize) * 1000) / 10
      : null

  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[560px] text-left text-xs">
        <thead className="bg-zinc-50 text-[11px] text-zinc-500 dark:bg-zinc-900/60">
          <tr>
            <th className="px-3 py-2 font-semibold">측정 항목 (id={result.id})</th>
            <th className="px-3 py-2 font-semibold">레거시 원본 직접 호출</th>
            <th className="px-3 py-2 font-semibold">BFF 가공 응답</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {ROWS.map((row) => (
            <tr key={row.label}>
              <td className="px-3 py-2">
                <div className="font-semibold text-zinc-800 dark:text-zinc-200">{row.label}</div>
                <div className="text-[10px] text-zinc-500">{row.hint}</div>
              </td>
              <td className="px-3 py-2 font-mono">{row.render(legacy)}</td>
              <td className="px-3 py-2 font-mono">{row.render(bff)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ratio !== null && (
        <p className="border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          본문 크기 {bytes(legacy.decodedBodySize)} → {bytes(bff.decodedBodySize)} ({ratio}% 감소, 이번 요청의 Resource Timing 값으로 계산)
        </p>
      )}
    </div>
  )
}
