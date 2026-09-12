import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-selected-layout-segments/breadcrumb')

import React from 'react'
import Link from 'next/link'
import { BASE_PATH, CATEGORIES, getProductsByCategory } from './types'

export default function DemoPage() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        기본 경로 — 카테고리를 선택하면 useSelectedLayoutSegments()가 반환하는 배열이 길어집니다.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`${BASE_PATH}/category/${category.slug}`}
            className="rounded border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-center text-xs font-bold text-zinc-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            {category.name}
            <span className="mt-1 block font-mono text-[10px] font-normal text-zinc-400">
              {getProductsByCategory(category.slug).length}개 상품
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
