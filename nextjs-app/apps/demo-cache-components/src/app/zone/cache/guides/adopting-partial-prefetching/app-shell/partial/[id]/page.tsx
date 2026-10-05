import Link from 'next/link'
import { DEMO_PATH } from '../../lib/constants'
import { Areas } from '../../components/Areas'

/**
 * 이 세그먼트를 Partial Prefetching으로 선택한다. 전역 partialPrefetching 플래그는 켜지 않는다.
 * prefetch export는 Server Component 세그먼트에서만 쓸 수 있다.
 */
export const prefetch = 'partial'

export default function PartialPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <section className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="font-bold">도착 페이지 (partial/[id])</p>
      <Areas params={params} />
      <Link href={DEMO_PATH} prefetch={false} className="inline-block text-[11px] underline">
        ← 목록으로
      </Link>
    </section>
  )
}
