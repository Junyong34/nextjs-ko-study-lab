'use client'

import { AlertTriangle, Info } from 'lucide-react'
import { useLearningProgress } from './LearningProgressProvider'

export function LearningProgressNotice() {
  const { storageStatus } = useLearningProgress()
  if (storageStatus !== 'recovered' && storageStatus !== 'unavailable') return null

  const unavailable = storageStatus === 'unavailable'
  const Icon = unavailable ? AlertTriangle : Info

  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        {unavailable
          ? '브라우저 저장소를 사용할 수 없어 이 탭에서만 기록이 유지됩니다.'
          : '저장된 학습 기록을 읽을 수 없어 빈 기록으로 복구했습니다.'}
      </span>
    </div>
  )
}
