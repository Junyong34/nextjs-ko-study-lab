import React from 'react'
import type { PromiseInspection, ProbeReport } from '../types'

interface ProbeCardProps {
  title: string
  /** 이 예제가 실제로 사용하는 언래핑 코드 한 줄 */
  code: string
  /** 아직 측정 전이면 undefined (예: SSR HTML 단계의 Client Component) */
  report?: ProbeReport
  /** useRenderEnv() 등으로 측정한 "지금 이 카드가 렌더링된 환경" */
  renderEnv?: string
}

function unwrapLabel(report: ProbeReport, prop: 'params' | 'searchParams') {
  return report.unwrapApi === 'await' ? `await ${prop}` : `use(${prop})`
}

function InspectionRow({ name, info }: { name: string; info: PromiseInspection }) {
  return (
    <tr className="border-t border-zinc-800">
      <td className="py-1 pr-3 text-zinc-400">{name}</td>
      <td className={`py-1 pr-3 ${info.isPromise ? 'text-emerald-300' : 'text-rose-300'}`}>{String(info.isPromise)}</td>
      <td className="py-1 pr-3">{info.thenType}</td>
      <td className="py-1 pr-3">{info.tag}</td>
      <td className="py-1">{info.ctorName}</td>
    </tr>
  )
}

/**
 * 서버/클라이언트 어디서든 렌더링 가능한 표시 전용 컴포넌트 (훅 없음).
 * 모든 값은 호출 측이 실제 런타임에서 측정한 ProbeReport에서 온다.
 */
export function ProbeCard({ title, code, report, renderEnv }: ProbeCardProps) {
  return (
    <div className="rounded border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{title}</span>
        {renderEnv && (
          <span className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            이 카드 렌더 환경: {renderEnv}
          </span>
        )}
      </div>
      <div className="space-y-2 bg-zinc-950 px-3.5 py-2.5 font-mono text-[11px] text-zinc-300">
        <div className="text-blue-300">{code}</div>
        {!report ? (
          <div className="text-amber-300">브라우저 마운트 후 실제 props를 검사합니다… (SSR HTML 단계에서는 측정 전)</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="pr-3 font-normal">prop</th>
                    <th className="pr-3 font-normal">instanceof Promise</th>
                    <th className="pr-3 font-normal">typeof .then</th>
                    <th className="pr-3 font-normal">toString tag</th>
                    <th className="font-normal">constructor</th>
                  </tr>
                </thead>
                <tbody>
                  <InspectionRow name="params" info={report.params} />
                  <InspectionRow name="searchParams" info={report.searchParams} />
                </tbody>
              </table>
            </div>
            <div className="break-all">
              <span className="text-zinc-500">{unwrapLabel(report, 'params')} → </span>
              <span className="text-emerald-300">{JSON.stringify(report.resolvedParams)}</span>
            </div>
            <div className="break-all">
              <span className="text-zinc-500">{unwrapLabel(report, 'searchParams')} → </span>
              <span className="text-emerald-300">{JSON.stringify(report.resolvedSearchParams)}</span>
            </div>
            <div className="text-zinc-500">
              검사 실행 환경: <span className="text-zinc-200">{report.inspectedIn}</span> (runtime: {report.runtime}) · {report.observedAt}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
