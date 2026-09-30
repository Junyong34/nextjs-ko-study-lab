'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, UNSUPPORTED_LANG, langFromPathname, productsHref } from '../locales'

const TARGETS = [
  ...LOCALES.map((lang) => ({ lang, note: 'generateStaticParams ●' })),
  { lang: UNSUPPORTED_LANG, note: '미지원 → 404' },
]

/** 실제 [lang] 경로로 이동하는 <Link>. 상태로 언어를 흉내 내지 않고 URL 자체가 바뀐다. */
export function LocaleNav() {
  const pathname = usePathname()
  const current = langFromPathname(pathname)

  return (
    <nav aria-label="언어 경로 이동" className="space-y-1.5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TARGETS.map((t) => {
          const active = current === t.lang
          return (
            <Link
              key={t.lang}
              href={productsHref(t.lang)}
              prefetch={t.lang === UNSUPPORTED_LANG ? false : undefined}
              aria-current={active ? 'page' : undefined}
              className={`rounded-md border px-3 py-2 transition-colors ${
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
              }`}
            >
              <span className="block font-mono text-[11px] font-bold">/{t.lang}/products</span>
              <span className={`block text-[10px] ${active ? 'opacity-80' : 'text-zinc-500'}`}>{t.note}</span>
            </Link>
          )
        })}
      </div>
      <p className="font-mono text-[10px] text-zinc-500">
        현재 URL 경로: {pathname} · [lang] 세그먼트: {current ?? '(없음)'}
      </p>
    </nav>
  )
}
