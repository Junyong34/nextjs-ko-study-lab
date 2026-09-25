import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/i18n/dictionary-translation')

/**
 * 기본 경로. 4단 레이아웃은 layout.tsx가 그리고, 이 page는 언어를 고르기 전 안내만 표시한다.
 * 실제 앱이라면 proxy.ts가 Accept-Language를 보고 /ko 같은 경로로 리다이렉트할 자리다(이 실습 범위 밖).
 */
export default function DictionaryTranslationIndexPage() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
      위 링크로 언어 page를 열면 이 자리에 상품 카드가 그 언어의 사전으로 렌더링됩니다. 언어 코드는 URL 경로의 [lang]
      세그먼트로 전달되고, 번역은 서버에서 끝난 뒤 HTML로 도착합니다.
    </div>
  )
}
