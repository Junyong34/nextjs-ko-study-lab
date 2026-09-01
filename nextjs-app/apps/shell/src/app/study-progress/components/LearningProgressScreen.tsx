'use client'

import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import {
  LearningProgressChecklist,
  type LearningProgressTab,
} from '@/components/learning-progress/LearningProgressChecklist'
import { useLearningProgress } from '@/components/learning-progress/LearningProgressProvider'

export function LearningProgressScreen({ tab }: { tab: LearningProgressTab }) {
  const router = useRouter()
  const { reset } = useLearningProgress()

  const changeTab = (nextTab: LearningProgressTab) => {
    router.replace(`/study-progress?tab=${nextTab}`, { scroll: false })
  }

  const handleReset = () => {
    if (window.confirm('문서와 예제의 모든 완료 표시를 해제할까요?')) reset()
  }

  return (
    <section className="space-y-6" aria-labelledby="learning-progress-title">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Learning Records</p>
          <h1 id="learning-progress-title" className="mt-2 text-3xl font-bold tracking-tight">
            학습 기록
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            완료로 표시한 문서와 예제를 한곳에서 확인하고 관리합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          학습 기록 초기화
        </button>
      </header>

      <LearningProgressChecklist tab={tab} onTabChange={changeTab} />
    </section>
  )
}
