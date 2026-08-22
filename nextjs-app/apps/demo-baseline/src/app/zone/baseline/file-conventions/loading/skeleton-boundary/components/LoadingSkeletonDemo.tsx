'use client'
import React from 'react'
import Link from 'next/link'

export function LoadingSkeletonDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/loading/skeleton-boundary'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Next.js loading.tsx 스켈레톤 바운더리</h4>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              slow-catalog/loading.tsx 구축 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">지연 시간이 발생하는 비동기 서버 컴포넌트로 이동할 때의 스켈레톤 즉각 렌더링을 테스트합니다.</p>
        </div>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          스트리밍 스켈레톤 실습 진입
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          아래 버튼을 클릭하여 <code>slow-catalog</code> 서브 라우트로 이동하세요. 서버에서 1.2초간 지연 페칭이 발생하는 동안 <code>loading.tsx</code>의 스켈레톤 UI가 즉시 노출되고, 데이터 준비 즉시 본문으로 교체됩니다.
        </p>
        <div className="pt-2 flex justify-end">
          <Link
            href={`${BASE_PATH}/slow-catalog`}
            className="rounded bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors cursor-pointer"
          >
            slow-catalog 진입 (스켈레톤 관찰) →
          </Link>
        </div>
      </div>
    </div>
  )
}
