'use client'
import React, { useState } from 'react'
export function I18nSubpathDemo() {
  const [lang, setLang] = useState('ko')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setLang('ko')} className={`rounded px-3 py-1 font-bold ${lang === 'ko' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}> /ko/shop</button>
        <button type="button" onClick={() => setLang('en')} className={`rounded px-3 py-1 font-bold ${lang === 'en' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}> /en/shop</button>
        <button type="button" onClick={() => setLang('ja')} className={`rounded px-3 py-1 font-bold ${lang === 'ja' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}> /ja/shop</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        선택된 언어 세그먼트: /{lang}/products -&gt; {lang === 'ko' ? '장바구니 담기' : lang === 'en' ? 'Add to Cart' : 'カートに入れる'}
      </div>
    </div>
  )
}
