'use client'
import React from 'react'
export function MetadataSitemapSplitDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">생성된 사이트맵 인덱스:</div>
      <div className="text-zinc-500">• /sitemap/0.xml (상품 #1 ~ #50,000)</div>
      <div className="text-zinc-500">• /sitemap/1.xml (상품 #50,001 ~ #100,000)</div>
    </div>
  )
}
