import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/router-cache-back/product')

import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { NavBackButton } from '../components/NavBackButton'
import { NavTiming } from '../components/NavTiming'

export default function ProductPage() {
  return (
    <DemoContainer className="space-y-4">
      <NavTiming />
      <div className="rounded border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
        <div className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">/product</div>
        <div className="font-bold text-zinc-900 dark:text-zinc-100">프로 무선 기계식 키보드</div>
      </div>
      <div className="flex gap-2">
        <NavBackButton label="상품 목록" />
        <Link
          href="/zone/baseline/guides/instant-navigation/router-cache-back/checkout"
          className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
        >
          주문서 작성 →
        </Link>
      </div>
    </DemoContainer>
  )
}
