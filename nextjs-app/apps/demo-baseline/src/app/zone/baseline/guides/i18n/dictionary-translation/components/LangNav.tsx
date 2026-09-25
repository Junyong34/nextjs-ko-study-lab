'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, UNSUPPORTED_LANG, pageHref } from '../locales'
import { CLIENT_CONTROL_TEXT } from '../probe'

const TARGETS = [
  ...LOCALES.map((lang) => ({ lang, note: `dictionaries/${lang}.json · ●` })),
  { lang: UNSUPPORTED_LANG, note: '사전 없음 → 404' },
]

/**
 * 실제 [lang] 하위 page로 이동하는 <Link>. 링크 라벨은 언어 코드뿐이다 —
 * 이 컴포넌트는 클라이언트 번들에 들어가므로 번역 문자열을 여기 두지 않는다.
 */
export function LangNav() {
  const pathname = usePathname()

  return (
    <nav aria-label={CLIENT_CONTROL_TEXT} className="space-y-1.5">
      <p className="text-[11px] font-semibold text-zinc-500">{CLIENT_CONTROL_TEXT}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TARGETS.map((t) => {
          const href = pageHref(t.lang)
          const active = pathname === href
          return (
            <Link
              key={t.lang}
              href={href}
              prefetch={t.lang === UNSUPPORTED_LANG ? false : undefined}
              aria-current={active ? 'page' : undefined}
              className={`rounded-md border px-3 py-2 text-left transition-colors ${
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
              }`}
            >
              <span className="block font-mono text-[11px] font-bold">/{t.lang}</span>
              <span className={`block text-[10px] ${active ? 'opacity-80' : 'text-zinc-500'}`}>{t.note}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
