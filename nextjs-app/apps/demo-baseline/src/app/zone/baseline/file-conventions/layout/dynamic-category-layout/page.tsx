import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/layout/dynamic-category-layout')

import React from 'react'

/** 시작 화면: 아직 [category] 세그먼트 밖이므로 [category]/layout.tsx가 렌더되지 않는다. */
export default function DynamicCategoryStartPage() {
  return (
    <section
      aria-label="시작 화면"
      className="rounded border border-dashed border-zinc-300 p-4 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
    >
      <p className="font-bold text-zinc-900 dark:text-zinc-100">카테고리를 선택하세요</p>
      <p className="mt-1">
        이 경로에는 [category] 세그먼트가 없어서 <code>[category]/layout.tsx</code>가 아직 렌더되지 않습니다. 위 링크로
        이동하면 그 layout이 받은 params와 render ID가 이 자리에 나타납니다.
      </p>
    </section>
  )
}
