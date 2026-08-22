'use client'
import React, { useState } from 'react'

export function DefaultParallelFallbackDemo() {
  const [currentTab, setCurrentTab] = useState<'recommended' | 'unmatched'>('recommended')
  
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">쇼핑몰 메인 기획전 슬롯 (@promotions)</h4>
          <p className="text-xs text-zinc-500">라우트 미매칭 시 default.tsx가 기본 배너 슬롯을 안전하게 보존합니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('recommended')}
            className={`rounded px-3 py-1 text-xs font-semibold cursor-pointer ${
              currentTab === 'recommended'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            매칭 탭 (/shoes)
          </button>
          <button
            onClick={() => setCurrentTab('unmatched')}
            className={`rounded px-3 py-1 text-xs font-semibold cursor-pointer ${
              currentTab === 'unmatched'
                ? 'bg-amber-600 text-white'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            미매칭 라우트 (/settings)
          </button>
        </div>
      </div>

      {currentTab === 'recommended' ? (
        <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <span className="inline-block rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white mb-2">page.tsx 활성</span>
          <div className="font-semibold text-blue-900 dark:text-blue-300">신규 시즌 신발 카테고리 기획전 배너</div>
          <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">슬롯 경로가 일치하여 전용 기획전 컴포넌트가 마운트되었습니다.</div>
        </div>
      ) : (
        <div className="rounded border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <span className="inline-block rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white mb-2">default.tsx 폴백 렌더</span>
          <div className="font-semibold text-amber-900 dark:text-amber-300">전체 베스트셀러 기본 기획전 배너 (기본 폴백)</div>
          <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">하위 라우트가 미매칭되었으나 default.tsx에 의해 404 없이 기본 추천 슬롯이 유지됩니다.</div>
        </div>
      )}
    </div>
  )
}
