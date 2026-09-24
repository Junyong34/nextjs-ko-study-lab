'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PARAM, SORT_OPTIONS } from '../lib/filters'
import type { CategoryOption } from '../types'
import { ChipGroup } from './ChipGroup'

const STOCK_ITEMS = [{ value: 'in', label: '재고 있는 상품만' }]

/**
 * 가이드의 LabelFilter 역할: 어디로 이동할지(URL)만 결정하고 대기 상태는 갖지 않는다.
 * 현재 선택값도 컴포넌트 상태가 아니라 useSearchParams()에서 읽는다.
 */
export function FilterBar({ categories, onNavigate }: { categories: CategoryOption[]; onNavigate: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function pushWith(key: string, values: string[]) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    values.forEach((v) => params.append(key, v))
    const query = params.toString()
    onNavigate()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const sort = searchParams.get(PARAM.sort)
  const stock = searchParams.get(PARAM.stock)

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
      <ChipGroup
        label="카테고리"
        multiple
        items={categories}
        value={searchParams.getAll(PARAM.category)}
        changeAction={(next) => pushWith(PARAM.category, next)}
      />
      <ChipGroup
        label="정렬"
        items={SORT_OPTIONS}
        value={sort ? [sort] : []}
        changeAction={(next) => pushWith(PARAM.sort, next)}
      />
      <ChipGroup
        label="재고"
        items={STOCK_ITEMS}
        value={stock ? [stock] : []}
        changeAction={(next) => pushWith(PARAM.stock, next)}
      />
    </div>
  )
}
