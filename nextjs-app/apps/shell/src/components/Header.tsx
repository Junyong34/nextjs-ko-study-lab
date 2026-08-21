import React from 'react'
import Link from 'next/link'
import { BookOpen, PlayCircle, ExternalLink } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 sm:h-16 max-w-[90rem] items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-1.5 sm:p-2 shadow-xs transition group-hover:border-zinc-300 group-hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-700">
              <svg
                viewBox="0 0 76 65"
                fill="currentColor"
                className="h-3.5 sm:h-4 w-auto text-zinc-950 dark:text-zinc-50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  Next.js 학습
                </span>
                <span className="inline-flex shrink-0 items-center rounded-md border border-zinc-200 bg-zinc-100/90 px-1 sm:px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  v16.3.1
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                App Router 문서 & 데모 실습
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
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
            href="https://nextjs.org/docs/app"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition"
          >
            <span>공식 문서</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <a
            href="https://github.com/Junyong34/nextjs-ko-study-lab"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-1.5 sm:p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            title="GitHub 저장소"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  )
}
