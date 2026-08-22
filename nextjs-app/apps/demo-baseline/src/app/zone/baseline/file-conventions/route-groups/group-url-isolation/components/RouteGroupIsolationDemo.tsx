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
              (shop) 및 (marketing) 그룹 온디스크 구축 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">괄호로 감싼 폴더는 URL 경로를 오염시키지 않으면서 서로 다른 전용 layout.tsx를 적용합니다.</p>
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
              파란색 전용 스토어프론트 GNB 레이아웃(<code>(shop)/layout.tsx</code>)을 사용하며, 실제 접속 주소는 <code>.../products</code>로 깔끔하게 떨어집니다.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-blue-200 dark:border-blue-900 flex justify-between items-center">
            <code className="text-[11px] font-mono text-blue-700 dark:text-blue-300">URL: /products</code>
            <Link
              href={`${BASE_PATH}/products`}
              className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              (shop)/products 진입 →
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
              보라색 전용 프로모션 배너 레이아웃(<code>(marketing)/layout.tsx</code>)을 사용하며, 실제 접속 주소는 <code>.../about</code>으로 격리됩니다.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-purple-200 dark:border-purple-900 flex justify-between items-center">
            <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300">URL: /about</code>
            <Link
              href={`${BASE_PATH}/about`}
              className="rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              (marketing)/about 진입 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
