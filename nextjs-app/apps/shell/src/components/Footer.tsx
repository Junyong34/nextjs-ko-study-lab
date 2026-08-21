'use client'

import React, { useState } from 'react'
import { ExternalLink, MessageSquare, Sparkles } from 'lucide-react'
import { FeedbackModal } from './FeedbackModal'

export function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <>
      <footer className="w-full border-t border-zinc-200/80 bg-zinc-50/60 transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 bg-white p-1.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <svg
                  viewBox="0 0 76 65"
                  fill="currentColor"
                  className="h-3.5 w-auto text-zinc-950 dark:text-zinc-50"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Next.js 학습
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  App Router 공식 문서 한국어 가이드 & 실습 데모
                </span>
              </div>
            </div>

            {/* Links & Action */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
              {/* Next.js 16.3.1 Version Link */}
              <a
                href="https://github.com/vercel/next.js/releases/tag/v16.3.1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                <span>Next.js v16.3.1</span>
                <ExternalLink className="h-3 w-3 text-zinc-400" />
              </a>

              {/* GitHub Repo */}
              <a
                href="https://github.com/Junyong34/nextjs-ko-study-lab"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <svg
                  className="h-3.5 w-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub 저장소</span>
                <ExternalLink className="h-3 w-3 text-zinc-400" />
              </a>

              {/* Feedback Button */}
              <button
                type="button"
                onClick={() => setFeedbackOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-xs hover:border-zinc-300 hover:bg-zinc-100 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>피드백 보내기</span>
              </button>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-200/60 pt-6 text-xs text-zinc-400 dark:border-zinc-800/60 dark:text-zinc-500 sm:flex-row">
            <span>© 2026 Next.js Study Lab. Open Source Curriculum.</span>
            <span>Next.js is a trademark of Vercel, Inc.</span>
          </div>
        </div>
      </footer>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  )
}
