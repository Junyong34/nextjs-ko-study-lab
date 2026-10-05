'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

/** 오버레이 껍데기. 닫기는 router.back()이라 목록 히스토리 항목으로 돌아간다. */
export function ModalFrame({ id, children }: { id: string; children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative my-4 w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
          <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            @modal/(.)products/[id] · 가로챈 화면 (ID {id})
          </span>
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            닫기 (router.back)
          </button>
        </div>
        <div className="mt-4 space-y-4">{children}</div>
      </div>
    </div>
  )
}
