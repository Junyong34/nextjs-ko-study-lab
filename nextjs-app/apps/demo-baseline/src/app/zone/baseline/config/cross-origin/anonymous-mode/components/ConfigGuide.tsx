import React from 'react'
import { content } from '../content'

/** 설정을 켜야만 보이는 결과를 설명하는 영역. 이 앱에서 설정을 바꾸거나 빌드를 실행하지 않는다. */
export function ConfigGuide() {
  return (
    <section className="min-w-0 space-y-4" aria-label="설정 예제와 확인 절차">
      <h3 className="font-semibold">3. next.config 설정 예제와 직접 확인할 절차</h3>
      <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        {content.notApplied}
      </p>
      {content.examples.map((example) => (
        <div key={example.file} className="min-w-0 space-y-2">
          <h4 className="break-all font-mono text-xs font-medium">{example.file}</h4>
          <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-100">
            <code>{example.code}</code>
          </pre>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{example.note}</p>
        </div>
      ))}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">확인 순서</h4>
        <ol className="list-decimal space-y-2 pl-5 text-xs">
          {content.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">주의점과 흔한 오용</h4>
        <ul className="list-disc space-y-2 pl-5 text-xs">
          {content.cautions.map((caution) => <li key={caution}>{caution}</li>)}
        </ul>
      </div>
    </section>
  )
}
