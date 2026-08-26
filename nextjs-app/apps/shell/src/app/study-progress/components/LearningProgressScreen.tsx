'use client'

import { useRouter } from 'next/navigation'
import {
  LearningProgressChecklist,
  type LearningProgressTab,
} from '@/components/learning-progress/LearningProgressChecklist'

export function LearningProgressScreen({ tab }: { tab: LearningProgressTab }) {
  const router = useRouter()

  const changeTab = (nextTab: LearningProgressTab) => {
    router.replace(`/study-progress?tab=${nextTab}`, { scroll: false })
  }

  return (
    <section className="space-y-6" aria-labelledby="learning-progress-title">
      <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Learning Records</p>
        <h1 id="learning-progress-title" className="mt-2 text-3xl font-bold tracking-tight">
          학습 기록
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          직접 완료로 표시한 문서와 데모를 한곳에서 확인하고 변경합니다.
        </p>
      </header>

      <LearningProgressChecklist tab={tab} onTabChange={changeTab} showReset />
    </section>
  )
}
