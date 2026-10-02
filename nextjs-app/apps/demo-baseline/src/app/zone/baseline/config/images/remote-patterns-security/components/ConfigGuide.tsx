import React from 'react'
import { content } from '../content'

/** 적용 시 설정 예제, 별도 앱에서의 확인 절차, 주의점. 이 앱의 설정을 바꾸지 않는 설명 영역이다. */
export function ConfigGuide() {
  return (
    <div className="min-w-0 space-y-4 text-sm leading-relaxed">
      <section className="min-w-0 space-y-3" aria-label="적용 시 설정 예제">
        <h3 className="font-semibold">적용 시 설정 예제</h3>
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
      <section className="space-y-2" aria-label="로컬에서 직접 확인하는 절차">
        <h3 className="font-semibold">로컬에서 직접 확인하는 절차</h3>
        <ol className="list-decimal space-y-2 pl-5 text-xs">
          {content.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
      <section className="space-y-2" aria-label="주의점과 흔한 오용">
        <h3 className="font-semibold">주의점과 흔한 오용</h3>
        <ul className="list-disc space-y-2 pl-5 text-xs">
          {content.cautions.map((caution) => <li key={caution}>{caution}</li>)}
        </ul>
      </section>
    </div>
  )
}
