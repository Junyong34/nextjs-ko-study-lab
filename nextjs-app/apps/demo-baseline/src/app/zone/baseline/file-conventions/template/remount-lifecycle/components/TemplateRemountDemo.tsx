'use client'
import React from 'react'
import Link from 'next/link'

export function TemplateRemountDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/template/remount-lifecycle'

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 text-sm dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">template.tsx vs layout.tsx 수명 주기 비교</h4>
          <p className="text-xs text-zinc-500">
            탭을 전환하며 상단 layout(초록색)의 마운트 횟수·인풋과 template(보라색)의 마운트 횟수·인풋이 각각
            유지되는지, 초기화되는지 확인하세요.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`${BASE_PATH}/tab-a`}
          className="rounded bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          탭 A 진입 (/tab-a) →
        </Link>
        <Link
          href={`${BASE_PATH}/tab-b`}
          className="rounded bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          탭 B 진입 (/tab-b) →
        </Link>
      </div>
    </div>
  )
}
