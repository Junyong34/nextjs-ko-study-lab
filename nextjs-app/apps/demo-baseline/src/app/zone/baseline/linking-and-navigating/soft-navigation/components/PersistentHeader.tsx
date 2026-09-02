'use client'

import React from 'react'
import { useSoftNav } from './SoftNavContext'

export function PersistentHeader() {
  const softNav = useSoftNav()

  const memo = softNav?.memo ?? ''
  const setMemo = softNav?.setMemo ?? (() => {})
  const seconds = softNav?.seconds ?? 0
  const navCount = softNav?.navCount ?? 0
  const scrollY = softNav?.scrollY ?? 0
  const mountedAt = softNav?.mountedAt ?? '--:--:--'

  return (
    <div className="space-y-3.5 rounded-2xl border border-zinc-200 bg-zinc-900 p-4 sm:p-5 text-white shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      {/* 실시간 모니터 상태 뱃지 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-mono text-xs font-bold text-emerald-400">
            Client Navigation Monitor
          </span>
          <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
            최초 마운트: {mountedAt}
          </span>
          <span className="rounded-md bg-emerald-950 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300 border border-emerald-800">
            클라이언트 유지: {seconds}초
          </span>
          <span className="rounded-md bg-indigo-950 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-300 border border-indigo-800">
            이동 횟수: {Math.max(0, navCount - 1)}회
          </span>
        </div>

        {/* 실시간 스크롤 위치 */}
        <div className="flex items-center gap-1.5 rounded-lg bg-zinc-800/80 px-2.5 py-1 text-xs font-mono">
          <span className="text-zinc-400">스크롤 Y:</span>
          <strong className={scrollY > 50 ? 'text-amber-400 font-bold' : 'text-zinc-300 font-bold'}>
            {scrollY}px
          </strong>
          {scrollY > 50 && (
            <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800">
              스크롤됨
            </span>
          )}
        </div>
      </div>

      {/* 클라이언트 메모 입력창 */}
      <div className="space-y-1.5 pt-1">
        <label htmlFor="softnav-memo" className="block text-xs font-semibold text-zinc-300">
          클라이언트 상태 보존용 메모 (이곳에 테스트 메모를 직접 입력해 보세요):
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            id="softnav-memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 장바구니 담을 상품 검토 중 (Soft Nav 메모)"
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-hidden"
          />
          <span className="inline-flex items-center justify-center rounded-xl bg-zinc-800 px-3 py-2 font-mono text-[11px] text-zinc-400 border border-zinc-700 shrink-0">
            Soft Nav 시 상태 100% 보존
          </span>
        </div>
      </div>
    </div>
  )
}
