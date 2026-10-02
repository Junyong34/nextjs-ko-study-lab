import React from 'react'
import { content } from '../content'

// 적용하지 않은 설정의 예제와 직접 확인 절차. 상태 없이 콘텐츠만 렌더링한다.
export function ExplainSection() {
  return (
    <>
      <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/30">
        {content.notApplied}
      </p>
      <p>{content.scenario}</p>
      <section className="min-w-0 space-y-3" aria-label="설정 예제">
        <h3 className="font-semibold">적용할 때의 설정 예제 (이 앱에는 없음)</h3>
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
      <section className="space-y-2" aria-label="직접 확인할 절차">
        <h3 className="font-semibold">별도 앱에서 직접 확인할 절차</h3>
        <ol className="list-decimal space-y-2 pl-5 text-xs">
          {content.procedure.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="space-y-2" aria-label="주의점과 흔한 오용">
        <h3 className="font-semibold">주의점과 흔한 오용</h3>
        <ul className="list-disc space-y-2 pl-5 text-xs">
          {content.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </section>
    </>
  )
}
