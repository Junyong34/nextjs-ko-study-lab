import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/default/hard-reload-restore')

export default function Page() {
  return (
    <section
      data-slot="children"
      data-screen="home"
      className="rounded border border-zinc-200 p-3.5 text-sm dark:border-zinc-800"
    >
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">메인 화면 (children 슬롯)</h3>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        주문 현황 요약: 결제 대기 3건. 이 영역은 이 라우트 세그먼트의 <code>page.tsx</code>가 렌더링하며,
        암시적 <code>children</code> 슬롯에 해당한다.
      </p>
    </section>
  )
}
