import React from 'react'
import Link from 'next/link'

export default function ProductNotFound() {
  const BASE_PATH = '/zone/baseline/file-conventions/not-found/missing-product-404'

  return (
    <div className="space-y-4 rounded-lg border-2 border-amber-500/40 bg-amber-50/40 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300 font-bold text-lg">
        404
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          존재하지 않거나 단종된 상품입니다 (not-found.tsx)
        </h4>
        <p className="text-xs text-zinc-500">
          Next.js의 <code>notFound()</code> 함수가 호출되어 동일 세그먼트의 <code>not-found.tsx</code> 바운더리가 활성화되었습니다.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href={BASE_PATH}
          className="rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
        >
          ← 상품 목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
