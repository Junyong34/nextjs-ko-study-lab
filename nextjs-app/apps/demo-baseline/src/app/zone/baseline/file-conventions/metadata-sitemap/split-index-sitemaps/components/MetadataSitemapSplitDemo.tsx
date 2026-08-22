'use client'
import React from 'react'

export function MetadataSitemapSplitDemo() {
  const SITEMAP_INDEX = '/zone/baseline/file-conventions/metadata-sitemap/split-index-sitemaps/sitemap.xml'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">동적 사이트맵 분할 인덱스 (generateSitemaps)</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              generateSitemaps()
            </span>
          </div>
          <p className="text-xs text-zinc-500">대규모 상품 데이터를 5만 개 단위 또는 도메인별(0.xml, 1.xml, 2.xml)로 분할 생성합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">sitemap/0.xml</span>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">상품군</span>
          </div>
          <p className="text-[11px] text-zinc-500">전체 등록 상품 URL 인덱싱 (/products/*)</p>
          <div className="font-mono text-[10px] text-zinc-400">우선순위: 0.9 (daily)</div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">sitemap/1.xml</span>
            <span className="rounded bg-purple-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">카테고리</span>
          </div>
          <p className="text-[11px] text-zinc-500">대/중/소 분류 카테고리 URL (/category/*)</p>
          <div className="font-mono text-[10px] text-zinc-400">우선순위: 0.7 (weekly)</div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">sitemap/2.xml</span>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">프로모션</span>
          </div>
          <p className="text-[11px] text-zinc-500">타임세일 및 기획전 페이지 (/promotions/*)</p>
          <div className="font-mono text-[10px] text-zinc-400">우선순위: 1.0 (hourly)</div>
        </div>
      </div>
    </div>
  )
}
