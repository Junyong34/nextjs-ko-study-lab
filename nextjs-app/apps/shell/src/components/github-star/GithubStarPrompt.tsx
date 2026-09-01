'use client'

import React, { useEffect, useState } from 'react'
import { ExternalLink, Star, X } from 'lucide-react'
import { cn, IconButton } from '@study/ui'
import type { PromptPosition } from '@/lib/github-star/types'
import { useGithubStar } from './GithubStarProvider'

const POSITION_CLASSES: Record<PromptPosition, string> = {
  'bottom-right': 'bottom-36 right-4 sm:right-6 lg:bottom-24',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  'top-right': 'top-20 right-4 sm:right-6',
  'center-right': 'top-1/2 right-4 sm:right-6 -translate-y-1/2',
}

export function GithubStarPrompt() {
  const { config, isPromptVisible, dismiss, dismissForever, clickThrough } =
    useGithubStar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isPromptVisible) {
    return null
  }

  const positionClass =
    POSITION_CLASSES[config.position] || POSITION_CLASSES['bottom-right']

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="GitHub Star 요청 안내"
      className={cn(
        'fixed z-40 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-xl backdrop-blur-xs transition-all duration-300 motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900/95 sm:w-88 sm:p-5',
        positionClass,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#14161a0f] dark:bg-white/10">
            <Star
              className="h-4 w-4 fill-amber-400 text-amber-400 dark:fill-amber-300 dark:text-amber-300"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              학습에 도움이 되셨나요?
            </h3>
            <p className="text-[11px] leading-tight text-zinc-500 dark:text-zinc-400">
              Next.js 학습 랩이 유용했다면 Star를 부탁드려요!
            </p>
          </div>
        </div>
        <IconButton density="tight" onClick={dismiss} aria-label="닫기">
          <X className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="mt-3.5 flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={dismissForever}
          className="text-[11px] text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          다시 보지 않기
        </button>
        <a
          href={config.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={clickThrough}
          aria-label="GitHub 저장소에서 Star 남기기 (새 창으로 열림)"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          <span>Star 남기기</span>
          <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
        </a>
      </div>
    </aside>
  )
}
