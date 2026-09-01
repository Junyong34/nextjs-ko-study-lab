'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getDemoListContext } from '../../lib/demo-storage'

export interface DemoBackButtonProps {
  fallbackUrl?: string
  fallbackLabel?: string
  className?: string
}

export function DemoBackButton({
  fallbackUrl = '/demo',
  fallbackLabel = '예제 목록',
  className = 'inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-700 shadow-2xs hover:bg-zinc-100 hover:text-zinc-950 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
}: DemoBackButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const context = getDemoListContext()
    if (context && context.listUrl) {
      router.back()
      return
    }

    if (
      typeof window !== 'undefined' &&
      window.history.length > 1 &&
      document.referrer &&
      document.referrer.includes(window.location.host)
    ) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={fallbackLabel}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>{fallbackLabel}</span>
    </button>
  )
}
