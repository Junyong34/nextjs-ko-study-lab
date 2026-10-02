import React from 'react'
import { content } from '../content'

/** trailingSlash: true는 이 앱에 적용하지 않는다. 적용 예제와 별도 앱에서의 확인 절차만 보여 준다. */
export function ConfigExplainer() {
  return (
    <div className="min-w-0 space-y-4 text-sm leading-relaxed">
      <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/40">
        <strong>이 앱에서는 trailingSlash: true를 적용하지 않았습니다.</strong> {content.notApplied}
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
      <section className="space-y-2" aria-label="주의점">
        <h4 className="text-xs font-semibold">주의점</h4>
        <ul className="list-disc space-y-1.5 pl-5 text-xs">
          {content.cautions.map((caution) => <li key={caution}>{caution}</li>)}
        </ul>
      </section>
    </div>
  )
}
