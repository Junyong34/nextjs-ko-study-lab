'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { RUN_MODE } from '../probe'
import { useProbe } from './ProbeContext'

const cell = 'px-2 py-1 align-top'
const dash = (v: string | number | null) => (v === null ? '—' : String(v))
const list = (xs: string[]) => (xs.length === 0 ? '0건' : `${xs.length}건 (${xs.join(', ')})`)

/** 언어별 page·사전 원본·JS 청크를 브라우저가 실제로 받아 와 대조한 결과 표. */
export function DictionaryProbe() {
  const { report, running, error, run, clear } = useProbe()

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {running ? '요청·스캔 중…' : '사전·번들 실측 실행'}
          </button>
          <span className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            실행 모드: {RUN_MODE === 'production' ? 'production (next start)' : 'development (next dev)'}
          </span>
        </div>
        <DemoResetButton label="실측 결과 초기화" onReset={clear} />
      </div>
      {error && <p className="text-xs text-rose-600">실측 실패: {error}</p>}
      {report && (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[760px] font-mono text-[10px] text-zinc-700 dark:text-zinc-300">
              <thead className="bg-zinc-50 text-left text-zinc-500 dark:bg-zinc-900">
                <tr>
                  {['page', 'status', 'data-dict-lang', 'SSR HTML ↔ 사전 원본', '청크', '다른 언어 사전 문자열', '자기 언어 사전 문자열', 'x-nextjs-cache'].map(
                    (h) => (
                      <th key={h} className={`${cell} font-semibold`}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {report.pages.map((p) => (
                  <tr key={p.lang} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className={`${cell} font-bold text-zinc-900 dark:text-zinc-100`}>/{p.lang}</td>
                    <td className={cell}>{p.status}</td>
                    <td className={cell}>{dash(p.renderedLang)}</td>
                    <td className={cell}>
                      {p.leafCount - p.missingKeys.length}/{p.leafCount} 일치
                      {p.missingKeys.length > 0 && <span className="text-rose-600"> 누락 {p.missingKeys.join(', ')}</span>}
                    </td>
                    <td className={cell}>{p.chunkUrls.length}개</td>
                    <td className={cell}>{list(p.otherHits)}</td>
                    <td className={cell}>{list(p.ownHits)}</td>
                    <td className={cell}>{dash(p.xNextjsCache)}</td>
                  </tr>
                ))}
                <tr className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className={`${cell} font-bold text-zinc-900 dark:text-zinc-100`}>/{report.unsupported.lang}</td>
                  <td className={cell}>{report.unsupported.status}</td>
                  <td className={cell} colSpan={6}>
                    사전이 없는 언어 — hasLocale() 검사에서 notFound()
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] leading-relaxed text-zinc-500">
            스캔한 고유 JS 청크 {report.chunkCount}개 · {(report.chunkBytes / 1024).toFixed(0)} KB (현재 문서가 실제 로드한 스크립트{' '}
            {report.loadedScriptCount}개 포함) · 대조군 문자열 발견 청크 {report.controlHits}개
          </p>
        </div>
      )}
    </div>
  )
}
