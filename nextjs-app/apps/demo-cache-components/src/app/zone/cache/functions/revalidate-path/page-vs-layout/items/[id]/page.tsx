import React from 'react'
import Link from 'next/link'
import { getItemCache } from '../../cachedData'
import { HUB_PATH } from '../../paths'

// id에 따라 내용이 전부 달라지는 leaf 페이지라 정적 셸이 없다 — instant navigation 검증 대상에서 제외한다.
export const instant = false

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getItemCache(id)

  return (
    <div className="space-y-2 rounded border border-blue-200 bg-blue-50/40 p-3 font-mono text-xs dark:border-blue-900/50 dark:bg-blue-950/20">
      <div className="font-sans font-bold text-blue-950 dark:text-blue-200">상품 상세: #{item.id}</div>
      <div>item cacheId: <span className="font-bold">#{item.cacheId}</span> · {item.generatedAt}</div>
      <Link href={HUB_PATH} className="font-sans text-blue-700 underline dark:text-blue-300">
        ← 허브로 돌아가기
      </Link>
    </div>
  )
}
