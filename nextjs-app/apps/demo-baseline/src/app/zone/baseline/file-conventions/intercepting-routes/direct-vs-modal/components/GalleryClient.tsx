'use client'

import React from 'react'
import Link from 'next/link'
import { TARGET_ITEMS } from '../target-items'

const BASE_PATH = '/zone/baseline/file-conventions/intercepting-routes/direct-vs-modal'

export function GalleryClient() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">아웃도어 장비 갤러리</h4>
        <p className="text-xs text-zinc-500">
          같은 상세 경로(<code>target/[id]</code>)를 두 가지 실제 방식으로 열어 렌더링 결과를 대조합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TARGET_ITEMS.map((item) => {
          const href = `${BASE_PATH}/target/${item.id}`
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="space-y-2">
                <div
                  className={`flex h-24 w-full items-center justify-center rounded-md bg-gradient-to-br p-2 text-center text-xs font-bold text-white ${item.color}`}
                >
                  {item.title}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h5>
                  <p className="text-[11px] text-zinc-500">{item.category}</p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 border-t border-zinc-200 pt-2.5 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {item.price.toLocaleString()}원
                  </span>
                </div>
                <Link
                  href={href}
                  className="block rounded bg-indigo-600 px-2.5 py-1.5 text-center text-[11px] font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  소프트 내비게이션 (&lt;Link&gt;) → 모달
                </Link>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-center text-[11px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  새 탭에서 직접 진입 (하드 내비게이션)
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <p className="rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] leading-relaxed text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
        같은 URL을 모달로 연 뒤 그 화면에서 새로고침(F5)하면, 동일한 주소가 이번에는 전체 페이지로 다시
        렌더링되는 것도 함께 확인할 수 있습니다.
      </p>
    </div>
  )
}
