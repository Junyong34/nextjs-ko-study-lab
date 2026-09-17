import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/template/input-reset-animation/option-b')

import React from 'react'
import Link from 'next/link'

export default function OptionBPage() {
  const BASE_PATH = '/zone/baseline/file-conventions/template/input-reset-animation'

  return (
    <div className="space-y-3 rounded bg-white p-4 dark:bg-zinc-950">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">색상 문의 탭 (/option-b)</h5>
          <p className="text-xs text-zinc-500">
            사이즈 문의 탭으로 다시 이동해도 template.tsx가 또 재마운트되어 애니메이션이 재생되고, 입력 폼은
            매번 빈 상태로 시작합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`${BASE_PATH}/option-a`}
            className="rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700"
          >
            사이즈 문의 탭으로 →
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
