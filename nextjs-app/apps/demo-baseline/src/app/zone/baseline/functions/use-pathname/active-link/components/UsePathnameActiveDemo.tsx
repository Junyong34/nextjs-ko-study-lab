'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

export function UsePathnameActiveDemo() {
  const currentActualPathname = usePathname()
  const [activeTab, setActiveTab] = useState('/shop/deals')
  const navigationItems = [
    { path: '/shop/new', label: '신상품 (New)' },
    { path: '/shop/deals', label: '타임특가 (Deals)' },
    { path: '/shop/best', label: '베스트 (Best 100)' },
    { path: '/shop/events', label: '기획전 (Events)' },
  ]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 헤더 */}
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
          usePathname() 글로벌 네비게이션(GNB) 활성 탭 인디케이터 콘솔
        </h4>
        <p className="text-xs text-zinc-500">
          현재 브라우저 URL 경로(pathname)를 읽어 일치하는 메뉴 탭에 활성 스타일(Underline / Badge)을 동적으로 부여합니다.
        </p>
      </div>

      {/* 2. 쇼핑몰 네비게이션 바 프리뷰 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 dark:border-zinc-800">
          <div className="flex gap-2">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.path
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => setActiveTab(item.path)}
                  className={`relative rounded-md px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded bg-white p-3 text-xs dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 flex justify-between items-center">
          <span className="text-zinc-500">선택된 GNB 탭: <strong className="text-zinc-900 dark:text-zinc-100">{navigationItems.find((n) => n.path === activeTab)?.label}</strong></span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">isActive = true</span>
        </div>
      </div>

      {/* 3. usePathname() 리턴값 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          Next.js next/navigation usePathname() 감지 결과:
        </div>
        <div className="space-y-1 text-[11px]">
          <div>• 실측 App Router pathname: <span className="text-blue-300">"{currentActualPathname}"</span></div>
          <div>• 시뮬레이션 활성 경로: <span className="text-emerald-400 font-bold">"{activeTab}"</span></div>
          <div>• 활성 조건식: <span className="text-amber-300">pathname.startsWith('{activeTab}')</span></div>
        </div>
      </div>
    </div>
  )
}
