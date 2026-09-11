import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-params/client-id')

export default function ProductListPage() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        상품 목록 (기본 경로 — /client-id)
      </h3>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        위에서 상품 링크를 눌러 실제 [category]/[id] 다이나믹 세그먼트 라우트로 이동해 보세요.
        이동한 페이지 안의 Client Component가 useParams()로 category/id 값을 직접 읽어옵니다.
      </p>
    </div>
  )
}
