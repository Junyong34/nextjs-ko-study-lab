import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/template/input-reset-animation/option-a')

import React from 'react'
import Link from 'next/link'

export default function OptionAPage() {
  const BASE_PATH = '/zone/baseline/file-conventions/template/input-reset-animation'

  return (
    <div className="space-y-3 rounded bg-white p-4 dark:bg-zinc-950">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">사이즈 문의 탭 (/option-a)</h5>
          <p className="text-xs text-zinc-500">
            색상 문의 탭으로 이동하면 template.tsx가 재마운트되어 애니메이션이 다시 재생되고, 위 입력 폼이
            비워집니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`${BASE_PATH}/option-b`}
            className="rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700"
          >
            색상 문의 탭으로 →
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
