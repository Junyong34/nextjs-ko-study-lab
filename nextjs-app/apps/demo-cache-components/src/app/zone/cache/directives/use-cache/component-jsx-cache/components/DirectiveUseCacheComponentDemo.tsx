import React from 'react'
import Link from 'next/link'
import { MOCK_PRODUCTS } from '@study/demo-kit'

const BASE_PATH = '/zone/cache/directives/use-cache/component-jsx-cache'

export const CATEGORIES = [
  { id: 'all', label: '종합 베스트' },
  { id: 'electronics', label: '전자기기' },
  { id: 'fashion', label: '패션/의류' },
  { id: 'books', label: '도서 베스트' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export function normalizeCategory(value: string | undefined): CategoryId {
  return CATEGORIES.some((c) => c.id === value) ? (value as CategoryId) : 'all'
}

function getRankedItems(category: CategoryId) {
  const list = category === 'all' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === category)
  return [...list].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 3)
}

export interface CachedRankingResult {
  hero: React.ReactElement
  renderId: string
  renderedAt: string
}

/**
 * 비동기 서버 컴포넌트 함수 자체에 'use cache' 선언.
 * category 인자가 같으면 이 함수가 반환한 JSX 트리(hero) 전체가 재실행 없이 그대로 재사용된다.
 * cacheTag/cacheLife를 지정하지 않아 암묵적 'default' 캐시 프로파일이 적용된다.
 */
export async function BestSellerRankingHero({ category }: { category: CategoryId }): Promise<CachedRankingResult> {
  'use cache'
  const renderId = Math.random().toString(36).slice(2, 8).toUpperCase()
  const renderedAt = new Date().toLocaleTimeString()
  const items = getRankedItems(category)

  const hero = (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 p-4 shadow-sm dark:border-indigo-950 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-purple-950/20 space-y-3">
      <div className="flex items-center justify-between border-b border-indigo-100 pb-2 dark:border-indigo-900/50">
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
            JSX CACHE
          </span>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
            {'<'}BestSellerRankingHero category="{category}" /{'>'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300">
          renderId: <strong>{renderId}</strong> · {renderedAt}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200/80 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold ${
                  index === 0
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : index === 1
                      ? 'bg-zinc-300 text-zinc-900'
                      : 'bg-amber-700 text-white'
                }`}
              >
                {index + 1}
              </span>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                <div className="text-[10px] text-zinc-500">
                  ★ {item.rating} (구매후기 {item.reviewCount}건) | {item.categoryName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                {item.price.toLocaleString()}원
              </span>
              <div className="text-[10px] text-emerald-600 font-semibold">인기 상품</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return { hero, renderId, renderedAt }
}

export function DirectiveUseCacheComponentDemo({
  category,
  hero,
}: {
  category: CategoryId
  hero: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">랭킹 카테고리:</span>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={c.id === 'all' ? BASE_PATH : `${BASE_PATH}?category=${c.id}`}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              category === c.id
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {hero}

      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40 text-xs font-mono text-zinc-600 dark:text-zinc-400">
        <div>
          • <strong>컴포넌트 루트 'use cache'</strong>: category 인자가 같으면 위 카드 전체(JSX 트리)가 함수 재실행 없이
          그대로 재사용됩니다.
        </div>
        <div className="mt-1">
          • <strong>다른 카테고리로 전환</strong>: 새 인자 조합이므로 캐시 MISS가 발생해 renderId가 새로 생성됩니다.
        </div>
      </div>
    </div>
  )
}
