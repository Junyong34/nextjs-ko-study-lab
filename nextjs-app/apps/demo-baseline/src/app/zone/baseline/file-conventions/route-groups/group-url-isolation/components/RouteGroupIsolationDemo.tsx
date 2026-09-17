'use client'
import React from 'react'
import Link from 'next/link'

export function RouteGroupIsolationDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/route-groups/group-url-isolation'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Route Groups ((folder)) URL 격리 탐색기</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              디스크에 (shop), (marketing) 폴더 실존
            </span>
          </div>
          <p className="text-xs text-zinc-500">두 폴더 모두 실제 파일 시스템에 존재하지만, 괄호로 감싼 이름은 URL 경로에 절대 등장하지 않습니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between rounded-lg border-2 border-blue-400 bg-blue-50/40 p-4 dark:border-blue-700 dark:bg-blue-950/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 dark:text-blue-200 text-sm">1. 스토어프론트 그룹</span>
              <span className="rounded bg-blue-200 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                (shop)
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              실제 파일 위치는 <code>(shop)/products/page.tsx</code>이지만, <code>(shop)</code>은 Route Group 폴더라 요청 URL은 <code>.../products</code>로 끝납니다.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-blue-200 dark:border-blue-900 flex justify-between items-center">
            <code className="text-[11px] font-mono text-blue-700 dark:text-blue-300">URL: /products</code>
            <Link
              href={`${BASE_PATH}/products`}
              className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              (shop)/products 페이지로 이동 →
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border-2 border-purple-400 bg-purple-50/40 p-4 dark:border-purple-700 dark:bg-purple-950/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950 dark:text-purple-200 text-sm">2. 브랜드 마케팅 그룹</span>
              <span className="rounded bg-purple-200 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-900 dark:bg-purple-900 dark:text-purple-100">
                (marketing)
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              실제 파일 위치는 <code>(marketing)/about/page.tsx</code>이지만, <code>(marketing)</code>도 Route Group 폴더라 요청 URL은 <code>.../about</code>으로 끝납니다.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-purple-200 dark:border-purple-900 flex justify-between items-center">
            <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300">URL: /about</code>
            <Link
              href={`${BASE_PATH}/about`}
              className="rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              (marketing)/about 페이지로 이동 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
