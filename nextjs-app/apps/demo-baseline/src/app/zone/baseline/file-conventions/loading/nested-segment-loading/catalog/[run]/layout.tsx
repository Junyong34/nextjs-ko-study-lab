import React from 'react'
import { ParentActionControl } from '../../components/ParentActionControl'

/**
 * GNB 역할의 상시 레이아웃. 의도적으로 아무것도 await하지 않는다 — 만약 여기서
 * 직접 데이터를 await한다면 catalog/loading.tsx만으로는 그 지연이 감싸이지 않아
 * (같은 폴더의 loading.tsx는 같은 폴더의 layout.tsx 자체를 감싸지 않는다) 내비게이션이
 * 블로킹된다. 지연은 반드시 하위 page.tsx 안에 둔다.
 */
export default async function CatalogRunLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ run: string }>
}) {
  const { run } = await params

  return (
    <div className="min-w-0 space-y-3">
      <div className="min-w-0 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
            GNB / 카테고리 사이드바 (catalog/[run]/layout.tsx — 상시 인터랙션 가능)
          </span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            run: {run}
          </span>
        </div>
        <ParentActionControl runId={run} />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
