'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { invalidateCatalogAction, invalidateCategoryAction, invalidateProductAction } from '../actions'
import { CATEGORIES, CATEGORY_IDS, PRODUCTS, PRODUCT_IDS, TAGS } from '../tags'
import type { CacheEntrySnapshot, InvalidationTarget } from '../types'
import { EntryCard, type EntryState } from './EntryCard'
import { CascadeResultPanel, type CascadeRun } from './CascadeResultPanel'

const TARGETS: InvalidationTarget[] = [
  { id: 'catalog', level: 'catalog', label: '카탈로그 전체', tag: TAGS.catalog },
  ...CATEGORY_IDS.map((id) => ({
    id,
    level: 'category' as const,
    label: `${CATEGORIES[id].name} 카테고리`,
    tag: TAGS.category(id),
  })),
  ...PRODUCT_IDS.map((id) => ({ id, level: 'product' as const, label: PRODUCTS[id].name, tag: TAGS.product(id) })),
]

const LEVEL_BUTTON: Record<InvalidationTarget['level'], string> = {
  catalog: 'bg-rose-600 hover:bg-rose-700',
  category: 'bg-violet-600 hover:bg-violet-700',
  product: 'bg-blue-600 hover:bg-blue-700',
}

const GROUPS: { level: InvalidationTarget['level']; title: string }[] = [
  { level: 'catalog', title: '상위 태그' },
  { level: 'category', title: '카테고리 태그' },
  { level: 'product', title: '상품 태그' },
]

function runAction(target: InvalidationTarget) {
  if (target.level === 'catalog') return invalidateCatalogAction()
  if (target.level === 'category') return invalidateCategoryAction(target.id)
  return invalidateProductAction(target.id)
}

export function CascadeWorkbench({ entries }: { entries: CacheEntrySnapshot[] }) {
  const [isPending, startTransition] = useTransition()
  const [run, setRun] = useState<CascadeRun | null>(null)
  const [error, setError] = useState<string | null>(null)

  const invalidate = (target: InvalidationTarget) => {
    // 비교 기준: 클릭 순간 서버가 렌더해 둔 엔트리 값
    setRun({ target, before: entries })
    setError(null)
    startTransition(async () => {
      try {
        // updateTag를 호출한 Server Action의 응답에 새 렌더 결과가 함께 담겨 entries prop이 갱신된다
        await runAction(target)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })
  }

  const beforeById = new Map(run?.before.map((e) => [e.key, e.cacheId]))
  const stateOf = (entry: CacheEntrySnapshot): EntryState => {
    if (!run || isPending) return 'idle'
    return beforeById.get(entry.key) === entry.cacheId ? 'kept' : 'recomputed'
  }
  const byLevel = (level: CacheEntrySnapshot['level']) => entries.filter((e) => e.level === level)

  return (
    <>
      <DemoPlaygroundCard title="카탈로그 캐시 엔트리 7개와 계층형 태그 무효화">
        <div className="space-y-4">
          <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            {GROUPS.map((group) => (
              <div key={group.level} className="flex flex-wrap items-center gap-1.5">
                <span className="w-20 shrink-0 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  {group.title}
                </span>
                {TARGETS.filter((t) => t.level === group.level).map((target) => (
                  <button
                    key={target.tag}
                    type="button"
                    onClick={() => invalidate(target)}
                    disabled={isPending}
                    title={`updateTag('${target.tag}')`}
                    className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50 ${LEVEL_BUTTON[target.level]}`}
                  >
                    {target.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500" aria-live="polite">
            {isPending && run
              ? `updateTag('${run.target.tag}') 실행 중...`
              : run
                ? `마지막 실행: updateTag('${run.target.tag}') — 빨간 태그를 가진 엔트리만 재계산되어야 합니다.`
                : '버튼을 누르면 Server Action이 updateTag()를 호출하고, 응답에 담긴 새 렌더 결과로 아래 cacheId가 갱신됩니다.'}
          </p>
          {error && <p className="text-[11px] text-rose-600">액션 오류: {error}</p>}

          {(['catalog', 'category', 'product'] as const).map((level) => (
            <div key={level} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {byLevel(level).map((entry) => (
                <EntryCard
                  key={entry.key}
                  entry={entry}
                  state={stateOf(entry)}
                  previousCacheId={beforeById.get(entry.key)}
                  highlightTag={run?.target.tag}
                />
              ))}
            </div>
          ))}

          <div className="flex justify-end">
            <DemoResetButton label="비교 기록 지우기" onReset={() => setRun(null)} />
          </div>
        </div>
      </DemoPlaygroundCard>

      <CascadeResultPanel run={run} entries={entries} isPending={isPending} />
    </>
  )
}
