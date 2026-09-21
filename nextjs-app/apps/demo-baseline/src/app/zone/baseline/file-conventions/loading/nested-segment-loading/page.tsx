import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/loading/nested-segment-loading')

import React from 'react'

export default function NestedSegmentLoadingHomePage() {
  return (
    <div className="min-w-0 space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
      <p>
        아직 실행을 시작하지 않았습니다. 위 콘솔의 [새 실행 시작]을 누르면{' '}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">catalog/[run]</code> 경로가 새로
        만들어지고, 카탈로그 → 상품 상세 순서로 실제 loading.tsx 경계를 관찰합니다.
      </p>
      <pre className="min-w-0 overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed dark:border-zinc-800 dark:bg-zinc-900">
{`catalog/
├─ loading.tsx        상위 fallback
└─ [run]/
   ├─ layout.tsx       상위 GNB
   ├─ page.tsx         카탈로그 목록
   └─ [product]/
      ├─ loading.tsx   하위 fallback
      └─ page.tsx      상품 상세`}
      </pre>
    </div>
  )
}
