'use client'

import Link from 'next/link'
import { ResetProbeButton } from './ResetProbeButton'

const BASE_PATH = '/zone/baseline/file-conventions/route-groups/shop-vs-admin-roots'

export function ShopVsAdminRootsDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          디스크 구조는 <code>(shop)/products/page.tsx</code>와 <code>(admin)/dashboard/page.tsx</code>다.
          두 그룹 모두 각자 <code>layout.tsx</code>를 갖고 있고, GNB와 배색이 서로 완전히 다르다.
          아래 버튼으로 실제 그룹을 오가며 이동 방식을 관찰한다.
        </p>
        <ResetProbeButton />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
        <div className="flex flex-col justify-between rounded-lg border-2 border-blue-400 bg-blue-50/40 p-4 dark:border-blue-700 dark:bg-blue-950/30">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 dark:text-blue-200">스토어프론트</span>
              <span className="rounded bg-blue-200 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                (shop)
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <code>(shop)/layout.tsx</code>가 상단 GNB + 장바구니 배지를 렌더링한다.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-blue-200 dark:border-blue-900 flex justify-between items-center">
            <code className="text-[11px] font-mono text-blue-700 dark:text-blue-300">URL: /products</code>
            <Link
              href={`${BASE_PATH}/products`}
              className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              (shop)/products 이동 →
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border-2 border-violet-400 bg-violet-50/40 p-4 dark:border-violet-700 dark:bg-violet-950/30">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-violet-950 dark:text-violet-200">관리자 콘솔</span>
              <span className="rounded bg-violet-200 px-2 py-0.5 font-mono text-[10px] font-bold text-violet-900 dark:bg-violet-900 dark:text-violet-100">
                (admin)
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <code>(admin)/layout.tsx</code>가 다크 사이드바 내비게이션을 렌더링한다.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-violet-200 dark:border-violet-900 flex justify-between items-center">
            <code className="text-[11px] font-mono text-violet-700 dark:text-violet-300">URL: /dashboard</code>
            <Link
              href={`${BASE_PATH}/dashboard`}
              className="rounded bg-violet-600 px-3 py-1 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              (admin)/dashboard 이동 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
