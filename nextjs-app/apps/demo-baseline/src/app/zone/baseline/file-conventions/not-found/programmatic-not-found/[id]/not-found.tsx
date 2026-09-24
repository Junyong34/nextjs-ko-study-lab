import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { PNF_BASE_PATH } from '../types'
import { LastNotFoundCall } from '../components/LastNotFoundCall'

/**
 * [id] 세그먼트의 not-found 경계.
 * [id]/page.tsx·generateMetadata·Server Action, 그리고 자기 not-found.tsx가 없는
 * 하위 세그먼트 reviews/[reviewId]에서 던진 notFound()가 모두 여기로 온다.
 * data-not-found-boundary 속성은 curl/실습 화면이 "어느 경계가 렌더됐는지" 식별하는 데 쓴다.
 */
export default function ProductNotFound() {
  return (
    <DemoContainer className="space-y-4">
      <section
        data-not-found-boundary="product-[id]"
        className="space-y-3 rounded-lg border-2 border-amber-500/40 bg-amber-50/40 p-6 text-center dark:border-amber-900/50 dark:bg-amber-950/20"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
          404
        </div>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          상품 또는 리뷰를 찾을 수 없습니다 ([id]/not-found.tsx)
        </h4>
        <p className="text-xs text-zinc-500">
          존재하지 않거나, 비공개이거나, 볼 권한이 없는 리소스는 모두 같은 404로 응답합니다.
        </p>
        <Link
          href={PNF_BASE_PATH}
          className="inline-block rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
        >
          ← 실습으로 돌아가기
        </Link>
      </section>
      <LastNotFoundCall />
    </DemoContainer>
  )
}
