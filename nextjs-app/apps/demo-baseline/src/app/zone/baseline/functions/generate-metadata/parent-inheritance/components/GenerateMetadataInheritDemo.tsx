'use client'
import React from 'react'

export function GenerateMetadataInheritDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">const parentMeta = await parent;</div>
      <div className="text-zinc-500">• openGraph.images: parentMeta.openGraph?.images 상속</div>
      <div className="text-emerald-600">[확인] canonical URL: /products/101 오버라이드 완료</div>
    </div>
  )
}
