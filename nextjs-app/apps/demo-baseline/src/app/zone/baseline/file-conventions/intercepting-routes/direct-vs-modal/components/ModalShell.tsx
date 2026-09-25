'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import type { TargetItem } from '../types'

export function ModalShell({
  item,
  children,
}: {
  item: TargetItem
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              @modal/(.)target/[id]
            </span>
            <span className="font-mono text-xs text-zinc-500">ID: {item.id}</span>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer rounded p-1 text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            닫기 (router.back)
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div
            className={`flex h-36 w-full items-center justify-center rounded-lg bg-gradient-to-br p-4 text-center text-white shadow-inner ${item.color}`}
          >
            <div>
              <div className="text-lg font-bold">{item.title}</div>
              <div className="mt-1 font-mono text-[11px] opacity-80">INTERCEPTED MODAL OVERLAY</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{item.category}</span>
              <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                {item.price.toLocaleString()}원
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{item.desc}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
