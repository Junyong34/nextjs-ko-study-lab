import React from 'react'
import Link from 'next/link'
import { DemoPlaygroundCard } from '@study/demo-kit'

export default function CategoryAPage() {
  return (
    <DemoPlaygroundCard title="카테고리 A">
      <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="font-mono text-[10px] text-zinc-500">/drawer-open (카테고리 A)</div>
        <Link
          href="/zone/baseline/guides/preserving-ui-state/drawer-open/category-b"
          className="inline-block rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
        >
          카테고리 B로 이동 →
        </Link>
      </div>
    </DemoPlaygroundCard>
  )
}
