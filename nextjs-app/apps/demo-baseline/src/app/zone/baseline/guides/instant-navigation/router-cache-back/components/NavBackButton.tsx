'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const TIMER_KEY = 'rcb_nav_start'

export function NavBackButton({ label }: { label: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => {
        sessionStorage.setItem(TIMER_KEY, String(performance.now()))
        router.back()
      }}
      className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
    >
      ← {label} (router.back())
    </button>
  )
}
