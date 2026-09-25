import type { Dictionary } from '../dictionaries'
import type { Locale } from '../locales'

/**
 * 서버 컴포넌트. 'use client'가 없으므로 dict 객체와 이 파일 코드는 JS 청크에 들어가지 않고,
 * 번역된 문자열만 HTML(과 RSC 페이로드)에 실린다. 각 문자열은 검증 스크립트가 찾을 수 있도록
 * 다른 텍스트와 섞지 않고 단독 텍스트 노드로 렌더한다.
 */
export function ProductCard({ lang, dict, keyCount }: { lang: Locale; dict: Dictionary; keyCount: number }) {
  return (
    <article
      lang={lang}
      data-dict-lang={lang}
      className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{dict.product.title}</h3>
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{dict.product.description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dict.product.price}</span>
        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          {dict.product.cart}
        </button>
      </div>
      <ul className="space-y-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
        <li>{dict.notice.shipping}</li>
        <li>{dict.notice.returns}</li>
      </ul>
      <p className="border-t border-zinc-200 pt-2 font-mono text-[10px] text-zinc-500 dark:border-zinc-800">
        [lang]/page.tsx · getDictionary(&apos;{lang}&apos;) → dictionaries/{lang}.json · 키 {keyCount}개
      </p>
    </article>
  )
}
