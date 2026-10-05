import Link from 'next/link'
import { DEMO_PATH } from '../../lib/constants'
import { Areas } from '../../components/Areas'

/**
 * partial/[id]와 같은 구조에 같은 export. 다만 이 라우트로 가는 링크는 전부 prefetch={false}라
 * 클릭 전에 이 라우트의 App Shell을 가져온 링크가 하나도 없다(셸을 공유할 다른 링크가 없는 대조군).
 */
export const prefetch = 'partial'

export default function ColdPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <section className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="font-bold">도착 페이지 (cold/[id])</p>
      <Areas params={params} />
      <Link href={DEMO_PATH} prefetch={false} className="inline-block text-[11px] underline">
        ← 목록으로
      </Link>
    </section>
  )
}
