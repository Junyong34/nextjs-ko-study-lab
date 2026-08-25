'use client'

import React, { useState } from 'react'

export function InterceptingDirectVsModalDemo() {
  const [navMode, setNavMode] = useState<'none' | 'modal' | 'direct'>('modal')

  return (
    <div className="space-y-4">
      {/* 1. 상단 내비게이션 진입 방식 선택 버튼 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setNavMode('modal')}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              navMode === 'modal'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            소프트 네비게이션 (모달 가로채기)
          </button>
          <button
            type="button"
            onClick={() => setNavMode('direct')}
            className={`rounded px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              navMode === 'direct'
                ? 'bg-zinc-900 text-white shadow-2xs dark:bg-zinc-100 dark:text-zinc-900'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            하드 네비게이션 (새로고침/직접 진입)
          </button>
        </div>

        <span className="font-mono text-xs text-zinc-500">
          URL: <code>/photos/101</code>
        </span>
      </div>

      {/* 2. 렌더링 결과 뷰어 */}
      <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 min-h-[160px]">
        {navMode === 'modal' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2 dark:border-blue-900">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  (..)photos/[id] Intercepted Modal
                </span>
                <span className="font-sans text-[11px] text-zinc-500">
                  피드 컨텍스트 유지 중
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNavMode('none')}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕ 닫기
              </button>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-1.5">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 font-sans text-sm">
                📸 사진 상세 모달 (ID: #101)
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 font-sans">
                클라이언트 사이드 라우팅 시 부모 피드 목록 스크롤을 잃지 않고 오버레이 모달이 열립니다.
              </p>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 pt-1">
                • 렌더 소스: <code>app/@modal/(.)photos/[id]/page.tsx</code>
              </div>
            </div>
          </div>
        )}

        {navMode === 'direct' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
              <span className="rounded bg-zinc-900 px-2 py-0.5 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                photos/[id]/page.tsx Standalone Page
              </span>
              <span className="font-sans text-[11px] text-zinc-500">
                전체 단독 페이지 렌더링
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1.5">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 font-sans text-sm">
                🖼️ 사진 상세 단독 페이지 (ID: #101)
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 font-sans">
                주소창 직접 입력 또는 새로고침(F5) 시에는 모달이 아닌 독립된 전체 페이지로 200 OK 서빙됩니다.
              </p>
              <div className="text-[11px] text-zinc-500 pt-1">
                • 렌더 소스: <code>app/photos/[id]/page.tsx</code>
              </div>
            </div>
          </div>
        )}

        {navMode === 'none' && (
          <div className="py-8 text-center text-zinc-400 font-sans">
            모달이 닫혔습니다. 상단 버튼을 클릭하여 다시 가로채기 동작을 시뮬레이션하세요.
          </div>
        )}
      </div>
    </div>
  )
}
