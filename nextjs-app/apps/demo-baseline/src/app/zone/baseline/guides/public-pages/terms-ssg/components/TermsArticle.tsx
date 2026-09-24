import React from 'react'
import type { TermsDoc } from '../types'

/** 약관 본문. 사용자 정보가 전혀 들어가지 않는 순수 콘텐츠다. */
export function TermsArticle({ doc, aside }: { doc: TermsDoc; aside?: React.ReactNode }) {
  return (
    <article lang={doc.lang} className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{doc.title}</h4>
        <span className="font-mono text-[11px] text-zinc-500">
          {doc.lang} · v{doc.version} · 시행 {doc.effectiveDate}
        </span>
      </header>
      <ol className="space-y-2">
        {doc.articles.map((a) => (
          <li key={a.heading} className="text-xs leading-relaxed">
            <strong className="text-zinc-900 dark:text-zinc-100">{a.heading}</strong>
            <p className="text-zinc-600 dark:text-zinc-400">{a.body}</p>
          </li>
        ))}
      </ol>
      {aside}
    </article>
  )
}
