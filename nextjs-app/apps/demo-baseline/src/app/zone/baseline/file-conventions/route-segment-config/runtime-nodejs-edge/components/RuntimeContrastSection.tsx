'use client'

import React from 'react'
import { DemoPlaygroundCard, ExpectedActualPanel } from '@study/demo-kit'
import { useRuntimeProbes } from '../hooks/useRuntimeProbes'
import { PROBE_ROWS, segmentMatches } from '../expectations'
import { PROBE_SEGMENTS, SEGMENT_DECLARATION } from '../types'
import { ProbeTable } from './ProbeTable'

const HANDLER_BODY = `import { collectRuntimeProbe } from '../probe'

export function GET() {
  return Response.json(collectRuntimeProbe(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}`

export function RuntimeContrastSection() {
  const { pathname, round, results, remeasure } = useRuntimeProbes()

  const settled = PROBE_SEGMENTS.every((s) => results[s].status !== 'loading')
  const verdicts = PROBE_SEGMENTS.map((segment) => {
    const result = results[segment]
    if (result.status === 'ok') {
      const ok = segmentMatches(segment, result.data)
      const d = result.data
      const nodeOnly = d.nodeGlobals.includes('process.version:string') ? 'Node 전용 전역 있음' : 'Node 전용 전역 없음'
      const summary = `NEXT_RUNTIME=${d.nextRuntime}, typeof EdgeRuntime=${d.edgeRuntimeGlobal}, node=${d.nodeVersion}, ${nodeOnly}`
      return { segment, ok, text: `./${segment}: ${summary} → ${ok ? '기대와 일치' : '기대와 다름'}` }
    }
    if (result.status === 'error') return { segment, ok: false, text: `./${segment}: 요청 실패 (${result.message})` }
    return { segment, ok: false, text: `./${segment}: 측정 중...` }
  })
  const isMatched = settled ? verdicts.every((v) => v.ok) : undefined

  return (
    <>
      <DemoPlaygroundCard title="같은 GET 핸들러를 runtime 설정만 바꿔 세 곳에 배치" className="min-w-0">
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {PROBE_SEGMENTS.map((segment) => (
              <div key={segment} className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="break-all font-mono text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                  runtime-nodejs-edge/{segment}/route.ts
                </div>
                <pre className="mt-2 overflow-x-auto whitespace-pre text-[10.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-blue-700 dark:text-blue-400">{SEGMENT_DECLARATION[segment]}</span>
                  {'\n\n'}
                  {HANDLER_BODY}
                </pre>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              세 경로를 브라우저에서 실제로 fetch한 JSON 응답입니다. 측정 회차: <strong>{round}</strong>
            </p>
            <button
              type="button"
              onClick={remeasure}
              disabled={!settled}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {settled ? '세 엔드포인트 다시 측정' : '측정 중...'}
            </button>
          </div>

          <ProbeTable pathname={pathname} results={results} />
          <p className="text-[11px] text-zinc-500">
            초록색은 기대와 일치, 빨간색은 불일치입니다. 셀에 마우스를 올리면 기대값이 보입니다. 헤더 링크로 원본 JSON을 직접 열 수 있습니다.
          </p>
        </div>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="runtime 설정별 실행 환경 식별값 대조"
        expected={
          <span className="whitespace-pre-line">
            {PROBE_SEGMENTS.map(
              (segment) =>
                `• ./${segment}: ${PROBE_ROWS.map((row) => `${row.label}=${row.expected[segment]}`).slice(0, 2).join(', ')}`,
            ).join('\n')}
            {'\n• edge에서만 process.versions.node와 process.version·platform이 없음'}
          </span>
        }
        actual={<span className="whitespace-pre-line">{verdicts.map((v) => `• ${v.text}`).join('\n')}</span>}
        isMatched={isMatched}
        description="세 Route Handler 본문은 동일하고 runtime 선언만 다릅니다. 표의 모든 항목이 기대와 일치해야 검증 완료로 표시됩니다."
      />
    </>
  )
}
