import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'

export default function ElectronicsPage() {
  return (
    <DemoPlaygroundCard title="전자기기 카테고리 (page.tsx)">
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        현재 활성화된 카테고리 본문: <strong className="text-blue-600 dark:text-blue-400">전자기기 상품 목록 페이지</strong>
      </div>
    </DemoPlaygroundCard>
  )
}
