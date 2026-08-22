'use client'
import React, { useState } from 'react'
export function I18nDictionaryDemo() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko')
  const dict = {
    ko: { welcome: '환영합니다', checkout: '결제하기', freeShipping: '무료 배송' },
    en: { welcome: 'Welcome', checkout: 'Checkout', freeShipping: 'Free Shipping' }
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex gap-2">
        <button type="button" onClick={() => setLang('ko')} className="rounded bg-blue-600 px-3 py-1 text-white font-bold cursor-pointer">한국어 사전</button>
        <button type="button" onClick={() => setLang('en')} className="rounded bg-purple-600 px-3 py-1 text-white font-bold cursor-pointer">English Dict</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 font-mono space-y-1">
        <div>• {dict[lang].welcome}</div>
        <div>• {dict[lang].freeShipping}</div>
        <div>• {dict[lang].checkout}</div>
      </div>
    </div>
  )
}
