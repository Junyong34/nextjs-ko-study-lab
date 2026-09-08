import React from 'react'
import { ShareButton } from '@study/ui'

interface VisualizeHeaderProps {
  totalCount: number
}

export function VisualizeHeader({ totalCount }: VisualizeHeaderProps) {
  return (
    <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Interactive Visualizations
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Next.js & React 인터랙티브 시각화
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Streaming SSR, Selective Hydration, ISR 생명주기, Cache Components 등 Next.js와 React의
            핵심 런타임 동작과 렌더링 과정을 캔버스 다이어그램에서 확인하고 직접 조작해 보세요.
          </p>
        </div>

        <div className="shrink-0 pt-1">
          <ShareButton title="Next.js & React 인터랙티브 시각화 갤러리" url="/visualize" />
        </div>
      </div>
    </div>
  )
}
