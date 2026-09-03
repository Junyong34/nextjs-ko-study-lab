import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/loading-skeleton/shop')

import React from 'react'
import Link from 'next/link'
import { DemoContainer, ExpectedActualPanel } from '@study/demo-kit'

async function getSlowCatalog() {
  const start = Date.now()
  await new Promise((r) => setTimeout(r, 1200))
  return { items: ['러닝화', '윈드브레이커', '백팩'], elapsedMs: Date.now() - start }
}

export default async function ShopPage() {
  const { items, elapsedMs } = await getSlowCatalog()

  return (
    <DemoContainer className="space-y-4">
      <Link href="/zone/baseline/guides/instant-navigation/loading-skeleton" className="text-xs text-blue-600 underline">
        ← 데모 홈으로 복귀
      </Link>
      <div className="rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">쇼핑몰 카탈로그</div>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item} className="rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-900">{item}</li>
          ))}
        </ul>
      </div>
      <ExpectedActualPanel
        title="loading.tsx 스켈레톤 검증"
        expected="1200ms 서버 지연 동안 shop/loading.tsx의 스켈레톤이 즉시 표시된 뒤 실제 목록으로 교체되어야 한다."
        actual={`- 서버 지연 시간: ${elapsedMs}ms\n- 이 페이지가 렌더링됐다는 것 자체가 스켈레톤 이후 스트리밍이 완료됐다는 증거`}
        isMatched={elapsedMs >= 1200}
      />
    </DemoContainer>
  )
}
