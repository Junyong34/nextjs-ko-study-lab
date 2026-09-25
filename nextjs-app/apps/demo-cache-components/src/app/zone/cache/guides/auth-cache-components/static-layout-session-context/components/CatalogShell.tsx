import type { ReactNode } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { MOCK_PRODUCTS } from '@study/demo-kit'

const CATALOG_TAG = 'guides-auth-cache-components-static-layout-session-context:catalog'

/**
 * 모든 방문자가 공유하는 상품 레이아웃 — 'use cache'로 static shell에 들어간다.
 * accountSlot·children은 pass-through 슬롯이라 캐시 키에 포함되지 않고,
 * 그 안의 세션 UI만 요청 시점에 채워진다 (use cache Interleaving).
 */
export async function CatalogShell({
  accountSlot,
  children,
}: {
  accountSlot: ReactNode
  children: ReactNode
}) {
  'use cache'
  cacheLife('days')
  cacheTag(CATALOG_TAG)

  // 캐시 항목이 만들어질 때 한 번만 생성된다 — 요청마다 바뀌면 셸이 캐시되지 않은 것.
  const shellRenderId = crypto.randomUUID().slice(0, 8)
  const renderedAt = new Date().toISOString()
  const products = MOCK_PRODUCTS.slice(0, 4)

  return (
    <div
      data-demo-marker="catalog-shell"
      data-shell-render-id={shellRenderId}
      className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">SHOPLAB 스토어</p>
          <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
            셸 렌더 ID {shellRenderId} · {renderedAt}
          </p>
        </div>
        {accountSlot}
      </header>

      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_16rem]">
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {products.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{p.categoryName}</p>
              <p className="mt-0.5 text-xs font-semibold leading-snug text-zinc-900 break-keep dark:text-zinc-100">
                {p.name}
              </p>
              <p className="mt-1.5 text-xs">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {p.price.toLocaleString('ko-KR')}원
                </span>{' '}
                <span className="text-[10px] text-zinc-400 line-through">
                  {p.originalPrice.toLocaleString('ko-KR')}원
                </span>
              </p>
            </li>
          ))}
        </ul>
        <aside>{children}</aside>
      </div>
    </div>
  )
}
