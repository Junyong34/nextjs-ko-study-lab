import React from 'react'
import { content } from '../content'

/** output: 'export'는 이 앱에 적용하지 않는다. 적용 예제, 별도 앱 확인 절차, 서버 전용 API 대조표만 보여 준다. */
export function ExportExplainer() {
  return (
    <div className="min-w-0 space-y-4 text-sm leading-relaxed">
      <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/40">
        <strong>이 앱에서는 output: &apos;export&apos;를 적용하지 않았습니다.</strong> {content.notApplied}
      </p>
      <section className="min-w-0 space-y-3" aria-label="설정 예제">
        {content.examples.map((example) => (
          <div key={example.file} className="min-w-0 space-y-2">
            <h4 className="break-all font-mono text-xs font-medium">{example.file}</h4>
            <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-100">
              <code>{example.code}</code>
            </pre>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{example.note}</p>
          </div>
        ))}
      </section>
      <section className="space-y-2" aria-label="직접 확인하는 절차">
        <h4 className="text-xs font-semibold">별도 앱에서 직접 확인하는 절차</h4>
        <ol className="list-decimal space-y-1.5 pl-5 text-xs">
          {content.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
      <section className="space-y-2" aria-label="서버 전용 기능 대조">
        <h4 className="text-xs font-semibold">이 앱(서버 실행)과 정적 export의 기능 대조</h4>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-xs">
            <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="py-1.5 pr-2 font-medium">기능</th>
                <th className="py-1.5 pr-2 font-medium">이 앱</th>
                <th className="py-1.5 font-medium">output: &apos;export&apos; (문서 기준)</th>
              </tr>
            </thead>
            <tbody>
              {content.serverOnly.map((row) => (
                <tr key={row.api} className="border-b border-zinc-100 align-top dark:border-zinc-900">
                  <td className="py-1.5 pr-2">{row.api}</td>
                  <td className="py-1.5 pr-2">{row.app}</td>
                  <td className="py-1.5">{row.exported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
