import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/template/remount-lifecycle/tab-a')

import React from 'react'
import Link from 'next/link'

export default function TabAPage() {
  const BASE_PATH = '/zone/baseline/file-conventions/template/remount-lifecycle'

  return (
    <div className="space-y-3 rounded bg-white p-4 dark:bg-zinc-950">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">탭 A: 상품 상세 사양 (/tab-a)</h5>
          <p className="text-xs text-zinc-500">탭 B로 전환할 때 template.tsx의 인풋과 애니메이션이 재실행됩니다.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`${BASE_PATH}/tab-b`}
            className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            탭 B로 이동 →
          </Link>
          <Link
            href={BASE_PATH}
            className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}
