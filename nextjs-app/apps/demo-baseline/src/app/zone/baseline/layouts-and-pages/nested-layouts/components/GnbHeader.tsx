'use client'

import React, { useState, useEffect } from 'react'
import { useSearch } from './SearchContext'

export function GnbHeader() {
  const { searchQuery, setSearchQuery } = useSearch()
  const [mountSeconds, setMountSeconds] = useState(0)
  const [mountedAt, setMountedAt] = useState<string>('')

  useEffect(() => {
    setMountedAt(new Date().toLocaleTimeString('ko-KR'))
    const timer = setInterval(() => {
      setMountSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="rounded-t-lg border-b border-zinc-200 bg-zinc-900 px-4 py-3 text-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 루트 레이아웃 브랜드 및 타이머 */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400">
              RootLayout
            </span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
              마운트: {mountedAt || '--:--:--'}
            </span>
            <span className="rounded bg-emerald-950 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 border border-emerald-800">
              유지 시간: {mountSeconds}초 (라우팅 시 리셋 안 됨)
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Next.js layout.tsx: 아래 카테고리 링크를 눌러 URL을 이동해도 GNB 컴포넌트와 검색어는 그대로 유지됩니다.
          </p>
        </div>

        {/* 상단 검색 입력창 (SearchContext 연동으로 실시간 필터링) */}
        <div className="flex items-center gap-2">
          <input
            id="gnb-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="실시간 검색 (예: 러닝화, 스니커즈, 맨투맨)"
            className="w-68 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-hidden"
          />
          <span className="rounded bg-emerald-950 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 border border-emerald-800">
            실시간 필터링
          </span>
        </div>
      </div>
    </header>
  )
}
