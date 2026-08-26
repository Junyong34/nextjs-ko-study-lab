'use client'

import { CheckCircle2 } from 'lucide-react'
import { useLearningProgress } from './LearningProgressProvider'
import type { LearningItemKind } from '@/lib/learning-progress/types'

export function LearningCompletionControl({
  kind,
  itemKey,
  label,
}: {
  kind: LearningItemKind
  itemKey: string
  label: string
}) {
  const { isCompleted, isTrackable, toggle } = useLearningProgress()
  if (!isTrackable(kind, itemKey)) return null

  const completed = isCompleted(kind, itemKey)

  return (
    <button
      type="button"
      aria-pressed={completed}
      onClick={() => toggle(kind, itemKey)}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-xs transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-100"
    >
      <CheckCircle2
        className={`h-4 w-4 ${completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`}
        aria-hidden="true"
      />
      <span>{completed ? '학습 완료 표시 해제' : label}</span>
    </button>
  )
}
