import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/router-cache-back')

/**
 * 시작 화면. 가이드·조작부·측정표·검증 영역은 공유 layout.tsx가 그리고,
 * 이 page는 layout의 children 슬롯에 들어가는 초기 안내만 담당한다(측정 대상 아님).
 */
export default function DemoPage() {
  return (
    <section className="rounded-lg border border-dashed border-zinc-300 p-4 text-xs leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">시작 화면 (router-cache-back/page.tsx)</p>
      <p className="mt-1">
        위의 [상품 목록 페이지로 이동 →]을 누르면 이 영역이 동적 page로 바뀝니다. 각 page는 요청마다 서버에서 새 렌더 ID를 만들므로,
        화면에 보이는 렌더 ID로 &quot;서버가 다시 렌더했는지&quot;를 직접 확인할 수 있습니다.
      </p>
    </section>
  )
}
