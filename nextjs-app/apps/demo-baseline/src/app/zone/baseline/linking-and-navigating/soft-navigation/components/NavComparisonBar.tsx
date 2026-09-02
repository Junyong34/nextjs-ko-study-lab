'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSoftNav } from './SoftNavContext'

const BASE_URL = '/zone/baseline/linking-and-navigating/soft-navigation'

export function NavComparisonBar() {
  const pathname = usePathname()
  const softNav = useSoftNav()

  const isRoot = pathname === BASE_URL
  const isBest = pathname === `${BASE_URL}/best`
  const isNew = pathname === `${BASE_URL}/new`

  const handleScrollDown = () => {
    const container = document.getElementById('product-scroll-container')
    if (container) {
      container.scrollTo({ top: 350, behavior: 'smooth' })
    }
    window.scrollTo({ top: 450, behavior: 'smooth' })
  }

  const handleScrollTop = () => {
    const container = document.getElementById('product-scroll-container')
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-2.5 dark:border-zinc-800">
        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          네비게이션 & 스크롤 제어 비교 탭
        </div>
        
        {/* 원클릭 스크롤 조작 도우미 버튼 */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleScrollDown}
            className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200 transition cursor-pointer"
          >
            <span>⬇️ 스크롤 아래로 내리기 (Y=350px)</span>
          </button>
          <button
            type="button"
            onClick={handleScrollTop}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition cursor-pointer"
          >
            <span>⬆️ 맨 위로</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. Link (scroll={false}) - 베스트 상품 */}
        <Link
          href={`${BASE_URL}/best`}
          scroll={false}
          onClick={() => softNav?.recordNav('soft-scroll-false')}
          className={`flex flex-col justify-between rounded-xl p-3 text-xs font-medium transition cursor-pointer border ${
            isBest
              ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
              : 'border-zinc-300 bg-white text-zinc-800 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-700'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold">베스트 상품</span>
            <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
              isBest ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              scroll={'{'}false{'}'}
            </span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isBest ? 'text-emerald-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
            현재 스크롤 위치 유지
          </p>
        </Link>

        {/* 2. Link (기본값 scroll={true}) - 신상품 */}
        <Link
          href={`${BASE_URL}/new`}
          onClick={() => softNav?.recordNav('soft-scroll-top')}
          className={`flex flex-col justify-between rounded-xl p-3 text-xs font-medium transition cursor-pointer border ${
            isNew
              ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
              : 'border-zinc-300 bg-white text-zinc-800 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-700'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold">신상품</span>
            <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
              isNew ? 'bg-emerald-800 text-white' : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
            }`}>
              기본 Link
            </span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isNew ? 'text-emerald-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
            페이지 최상단으로 자동 스크롤
          </p>
        </Link>

        {/* 3. Link (scroll={false}) - 추천 상품 (홈) */}
        <Link
          href={BASE_URL}
          scroll={false}
          onClick={() => softNav?.recordNav('soft-scroll-false')}
          className={`flex flex-col justify-between rounded-xl p-3 text-xs font-medium transition cursor-pointer border ${
            isRoot
              ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
              : 'border-zinc-300 bg-white text-zinc-800 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-700'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold">추천 상품 (홈)</span>
            <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
              isRoot ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              scroll={'{'}false{'}'}
            </span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isRoot ? 'text-emerald-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
            현재 스크롤 위치 유지
          </p>
        </Link>

        {/* 4. a href (Hard Navigation) */}
        <a
          href={`${BASE_URL}/best`}
          className="flex flex-col justify-between rounded-xl border border-rose-300 bg-rose-50/90 p-3 text-xs font-medium text-rose-900 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200 transition cursor-pointer"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold">베스트 (a 태그)</span>
            <span className="rounded bg-rose-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200">
              Hard Reload
            </span>
          </div>
          <p className="text-[11px] text-rose-700 dark:text-rose-300/80 mt-1.5">
            브라우저 새로고침 (상태 초기화)
          </p>
        </a>
      </div>
    </div>
  )
}
