import { ShareButton } from '@study/ui'

export function VisualizeHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Next.js & React 시각화</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">렌더링·캐시·런타임 동작을 찾아보고 직접 조작해 보세요.</p>
      </div>
      <ShareButton title="Next.js & React 시각화" url="/visualize" />
    </header>
  )
}
