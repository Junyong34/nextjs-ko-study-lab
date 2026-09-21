import React from 'react'
import Link from 'next/link'
import { getCategoryCache } from '../../cachedData'
import { HUB_PATH } from '../../paths'

// slug에 따라 내용이 전부 달라지는 leaf 페이지라 정적 셸이 없다 — instant navigation 검증 대상에서 제외한다.
export const instant = false

export default async function CategoryFeedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryCache(slug)

  return (
    <div className="space-y-2 rounded border border-purple-200 bg-purple-50/40 p-3 font-mono text-xs dark:border-purple-900/50 dark:bg-purple-950/20">
      <div className="font-sans font-bold text-purple-950 dark:text-purple-200">카테고리 피드: {category.slug}</div>
      <div>category cacheId: <span className="font-bold">#{category.cacheId}</span> · {category.generatedAt}</div>
      <Link href={HUB_PATH} className="font-sans text-purple-700 underline dark:text-purple-300">
        ← 허브로 돌아가기
      </Link>
    </div>
  )
}
