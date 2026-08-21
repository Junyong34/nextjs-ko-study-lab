import React from 'react'
import { SITE } from '../../site'
import { FeedbackTrigger } from '../../feedback'
import { FooterBrand } from './FooterBrand'
import { FooterLinks } from './FooterLinks'

/**
 * 하단 푸터. **서버 컴포넌트입니다.**
 * 클라이언트 경계는 `FeedbackTrigger` 하나로 좁혀져 있습니다.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-zinc-50/60 transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <FooterBrand />

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
            <FooterLinks
              version={SITE.version}
              releaseUrl={SITE.releaseUrl}
              repoUrl={SITE.repoUrl}
            />
            <FeedbackTrigger to={SITE.feedbackTo} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-200/60 pt-6 text-xs text-zinc-400 dark:border-zinc-800/60 dark:text-zinc-500 sm:flex-row">
          <span>© 2026 Next.js Study Lab. Open Source Curriculum.</span>
          <span>Next.js is a trademark of Vercel, Inc.</span>
        </div>
      </div>
    </footer>
  )
}
