'use client'
import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const TAGS = ['무료배송', '당일발송', '쿠폰적용가능', '재고있음']

export function MultiFilterWidgetDemo() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selected = searchParams.get('tags')?.split(',').filter(Boolean) || []

  const toggle = (tag: string) => {
    const next = selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]
    const params = new URLSearchParams(searchParams.toString())
    if (next.length > 0) {
      params.set('tags', next.join(','))
    } else {
      params.delete('tags')
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">선택된 복합 필터: {selected.join(', ') || '(전체)'}</div>
      <div className="flex gap-2 text-xs">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`rounded px-2.5 py-1 font-medium cursor-pointer ${
              selected.includes(tag) ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-500">브라우저 주소창의 ?tags= 쿼리스트링이 실제로 갱신됩니다. 새로고침해도 필터가 유지됩니다.</p>
    </div>
  )
}
