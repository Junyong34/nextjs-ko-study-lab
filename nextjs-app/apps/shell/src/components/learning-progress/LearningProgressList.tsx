'use client'

import Link from 'next/link'
import { LearningCompletionControl } from './LearningCompletionControl'
import type { LearningDocumentItem, LearningDemoItem } from '@/lib/learning-progress/types'

export function LearningProgressList({
  items,
  isCompleted,
  compact = false,
}: {
  items: Array<LearningDocumentItem | LearningDemoItem>
  isCompleted: (key: string) => boolean
  compact?: boolean
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        조건에 맞는 학습 항목이 없습니다.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      {items.map((item) => {
        const completed = isCompleted(item.key)
        return (
          <li
            key={item.key}
            className={`flex flex-col gap-3 p-4 ${compact ? '' : 'sm:flex-row sm:items-center sm:justify-between'}`}
          >
            <div className="min-w-0">
              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                {item.category} · {completed ? '완료' : '미완료'}
              </p>
              <Link
                href={item.url}
                className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
              >
                {item.title}
              </Link>
            </div>
            <LearningCompletionControl
              kind={item.kind}
              itemKey={item.key}
              label="학습 완료로 표시"
            />
          </li>
        )
      })}
    </ul>
  )
}
