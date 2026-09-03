import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'linking-and-navigating/router-prefetch')

import React from 'react'

export default function RouterPrefetchHomePage() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-2">
      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        쇼핑몰 메인 대시보드 (URL: /router-prefetch)
      </h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        상단 컨트롤러에서 <strong>[1. 특가 상품 백그라운드 prefetch]</strong>를 먼저 클릭해 브라우저 Network 탭에서 <code className="font-mono text-[11px]">/deals</code> 라우트가 미리 로드되는지 확인한 뒤, <strong>[2. 특가 상품으로 이동]</strong>을 눌러 보세요.
      </p>
    </div>
  )
}
