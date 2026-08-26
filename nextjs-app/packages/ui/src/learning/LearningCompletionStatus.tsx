import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

export function LearningCompletionStatus({ completed }: { completed: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
      {completed ? (
        <CheckCircle2
          className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
          aria-hidden="true"
        />
      ) : (
        <Circle className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
      )}
      <span>{completed ? '학습 완료' : '학습 미완료'}</span>
    </span>
  )
}
