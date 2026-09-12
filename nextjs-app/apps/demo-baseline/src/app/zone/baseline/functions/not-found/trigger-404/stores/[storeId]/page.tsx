import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/not-found/trigger-404/stores/[storeId]',
)

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DemoContainer } from '@study/demo-kit'
import { STORE_CATALOG, TRIGGER_404_BASE_PATH } from '../../types'

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = STORE_CATALOG[storeId]

  // 상위 layout.tsx가 이미 같은 검사를 했지만, Next.js는 같은 세그먼트의 layout과 page를
  // 독립적으로 렌더링하므로 page.tsx도 스스로 방어해야 한다 — 실제로 이 가드를 지우면
  // layout이 notFound()를 던지는 동안 page 쪽에서 별도의 TypeError가 함께 발생한다.
  if (!store) {
    notFound()
  }

  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100">{store.name}</h5>
            <p className="text-xs text-zinc-500">{store.address}</p>
          </div>
          <Link
            href={TRIGGER_404_BASE_PATH}
            className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          >
            ← 데모로 돌아가기
          </Link>
        </div>
        <p className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          layout.tsx 통과 → 200 OK
        </p>
      </div>
    </DemoContainer>
  )
}
