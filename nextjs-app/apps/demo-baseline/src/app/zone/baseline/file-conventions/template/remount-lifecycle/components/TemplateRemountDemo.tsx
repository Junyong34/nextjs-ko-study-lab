'use client'
import React from 'react'
import Link from 'next/link'

export function TemplateRemountDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/template/remount-lifecycle'

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 text-sm dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">template.tsx vs layout.tsx 수명 주기 비교</h4>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              template.tsx 온디스크 구축 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">탭을 전환하며 상단 layout(초록색)과 template(보라색) 인풋 필드의 상태 보존 여부를 확인하세요.</p>
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
