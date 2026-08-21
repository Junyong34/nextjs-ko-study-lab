import React from 'react'
import Link from 'next/link'
import { BookOpen, PlayCircle, ExternalLink } from 'lucide-react'
import { GitHubIcon } from '../../brand'

export interface HeaderNavProps {
  /** Next.js 공식 문서 URL */
  officialDocsUrl: string
  /** 저장소 URL */
  repoUrl: string
}

/** 헤더 우측 내비게이션 — 학습 문서 / 데모 / 공식 문서 / 저장소. */
export function HeaderNav({ officialDocsUrl, repoUrl }: HeaderNavProps) {
  return (
    <nav className="flex shrink-0 items-center gap-1 sm:gap-3">
      <Link
        href="/"
        className="flex items-center gap-1 sm:gap-1.5 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
        <span className="sm:hidden">문서</span>
        <span className="hidden sm:inline">학습 문서</span>
      </Link>

      <Link
        href="/demo"
        className="flex items-center gap-1 sm:gap-1.5 rounded-md bg-[#14161a0f] px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-200/60 transition dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/15"
      >
        <PlayCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-zinc-800 dark:text-zinc-200" />
        <span>데모</span>
        <span className="hidden md:inline-flex rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-1.5 py-0.2 text-[10px] font-bold">
          Live
        </span>
      </Link>

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5 sm:mx-1 hidden min-[480px]:block" />

      <a
        href={officialDocsUrl}
        target="_blank"
        rel="noreferrer"
        className="hidden md:flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition"
      >
        <span>공식 문서</span>
        <ExternalLink className="h-3 w-3" />
      </a>

      <a
        href={repoUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-md p-1.5 sm:p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        title="GitHub 저장소"
      >
        <GitHubIcon className="h-4 w-4 fill-current" />
      </a>
    </nav>
  )
}
