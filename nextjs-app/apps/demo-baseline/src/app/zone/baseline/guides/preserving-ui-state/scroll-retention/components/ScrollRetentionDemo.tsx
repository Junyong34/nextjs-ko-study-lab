'use client'
import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const ITEMS = Array.from({ length: 40 }, (_, i) => `상품 #${i + 1}`)

export function ScrollRetentionDemo() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filter = searchParams.get('sort') || '최신순'

  const handleFilter = (f: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', f)
    // scroll: false — 필터 변경 후에도 브라우저가 페이지 상단으로 스크롤을 강제 이동시키지 않는다.
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="sticky top-0 z-10 space-y-2 bg-white pb-2 dark:bg-zinc-950">
        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">정렬 기준: {filter} (?sort={filter}, scroll: false)</div>
        <div className="flex gap-2 text-xs">
          {['최신순', '인기순', '낮은가격순'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleFilter(f)}
              className={`rounded px-3 py-1 font-bold cursor-pointer ${filter === f ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-64 space-y-1 overflow-y-auto text-xs">
        {ITEMS.map((item) => (
          <div key={item} className="rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-900">{item} ({filter})</div>
        ))}
      </div>
      <p className="text-[11px] text-zinc-500">목록을 스크롤한 뒤 필터를 바꿔보세요 — scroll: false 덕분에 스크롤 위치가 유지됩니다.</p>
    </div>
  )
}
