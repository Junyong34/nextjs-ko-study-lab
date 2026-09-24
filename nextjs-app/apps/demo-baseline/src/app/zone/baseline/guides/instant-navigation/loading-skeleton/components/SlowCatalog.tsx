import React from 'react'
import { connection } from 'next/server'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { MARKER_ATTR, SERVER_DELAY_MS, SERVER_MS_ATTR, VARIANT_LABEL, type Variant } from '../types'

/**
 * 두 하위 page.tsx가 공유하는 느린 서버 컴포넌트.
 * 1) connection()으로 요청 시점 렌더링을 강제한다(빌드 시 prerender 방지 → 매 이동마다 서버 왕복).
 * 2) 서버에서 SERVER_DELAY_MS만큼 실제로 await한다(관측용 의도적 지연, 느린 DB/API 대체).
 * 3) 서버가 스스로 잰 대기 시간을 data 속성에 실어 브라우저 측정값과 대조하게 한다.
 */
export async function SlowCatalog({ variant }: { variant: Variant }) {
  await connection()
  const startedAt = Date.now()
  await new Promise((resolve) => setTimeout(resolve, SERVER_DELAY_MS))
  const serverMs = Date.now() - startedAt
  const products = MOCK_PRODUCTS.slice(0, 6)

  return (
    <section
      {...{ [MARKER_ATTR]: `content:${variant}`, [SERVER_MS_ATTR]: String(serverMs) }}
      className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          추천 상품 카탈로그 <span className="font-normal text-zinc-500">({VARIANT_LABEL[variant]})</span>
        </h4>
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          서버 대기 {serverMs}ms
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="h-20 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{p.categoryName}</p>
            <p className="mt-1 font-mono text-xs text-zinc-800 dark:text-zinc-200">{p.price.toLocaleString('ko-KR')}원</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
