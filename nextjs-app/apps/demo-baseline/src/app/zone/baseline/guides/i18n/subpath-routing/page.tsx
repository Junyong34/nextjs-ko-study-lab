import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/i18n/subpath-routing')

/** 기본 경로. 언어를 고르기 전 안내만 표시한다. 실제 앱이라면 proxy.ts가 Accept-Language를 보고 /ko 등으로 redirect할 자리다. */
export default function SubpathRoutingIndexPage() {
  return (
    <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
      위 링크로 /[lang]/products를 열면 이 자리에 그 언어로 서버 렌더링된 상품 목록이 나타납니다.
    </p>
  )
}
