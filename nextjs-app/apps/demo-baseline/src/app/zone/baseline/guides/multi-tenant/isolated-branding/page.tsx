import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/multi-tenant/isolated-branding')

/** 테넌트를 고르기 전 화면. 이 자리에는 CSS 변수가 주입되지 않는다. */
export default function IsolatedBrandingIndexPage() {
  return (
    <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
      위 링크로 테넌트를 열면 이 자리에 해당 테넌트의 로고·색상으로 서버 렌더링된 화면이 나타납니다.
    </p>
  )
}
