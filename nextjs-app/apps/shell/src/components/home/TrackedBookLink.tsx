'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { trackEvent } from '@/lib/analytics'

interface TrackedBookLinkProps extends ComponentProps<typeof Link> {
  bookType: 'document' | 'demo'
  chapterStep: string
  chapterTitle: string
}

export function TrackedBookLink({
  bookType,
  chapterStep,
  chapterTitle,
  onClick,
  children,
  ...linkProps
}: TrackedBookLinkProps) {
  return (
    <Link
      {...linkProps}
      onClick={(event) => {
        trackEvent({
          name: 'book_click',
          params: { book_type: bookType, chapter_step: chapterStep, chapter_title: chapterTitle },
        })
        onClick?.(event)
      }}
    >
      {children}
    </Link>
  )
}
