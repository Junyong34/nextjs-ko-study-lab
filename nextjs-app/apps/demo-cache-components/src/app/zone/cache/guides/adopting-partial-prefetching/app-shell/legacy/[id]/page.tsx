import { Suspense } from 'react'
import Link from 'next/link'
import { DEMO_PATH } from '../../lib/constants'
import { Detail } from '../../components/Detail'

/** prefetch export가 없는 대조 세그먼트. 구조는 partial/[id]와 같고 export 한 줄만 다르다. */
export default function LegacyPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <section className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
      <p data-demo-marker="shell">App Shell 영역 — URL(params)에 의존하지 않는 마크업 (legacy)</p>
      <Suspense fallback={<p>URL별 영역 대기 중 (Suspense fallback)</p>}>
        <Detail params={params} kind="legacy" />
      </Suspense>
      <Link href={DEMO_PATH} prefetch={false} className="inline-block text-[11px] underline">
        ← 목록으로
      </Link>
    </section>
  )
}
