'use client'

import React from 'react'
import Link from 'next/link'
import { MOCK_PRODUCTS } from '@study/demo-kit'

interface PrefetchFalseDemoProps {
  prefetchMode: boolean
  hoverCount: number
  onSetPrefetchMode: (mode: boolean) => void
  onHover: () => void
}

export function PrefetchFalseDemo({ prefetchMode, hoverCount, onSetPrefetchMode, onHover }: PrefetchFalseDemoProps) {
  const setPrefetchMode = onSetPrefetchMode
  const handleLinkHover = onHover

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            Next.js {'<'}Link prefetch={'{'}{String(prefetchMode)}{'}'}{'>'} prefetch 제어 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            대용량 상품 목록이나 트래픽이 집중되는 페이지에서 불필요한 RSC 데이터 사전 다운로드를 방지합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">prefetch 옵션:</span>
          <button
            type="button"
            onClick={() => setPrefetchMode(false)}
            className={`rounded px-2.5 py-1 font-mono text-xs font-semibold cursor-pointer transition ${
              prefetchMode === false
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            prefetch={'{false}'}
          </button>
          <button
            type="button"
            onClick={() => setPrefetchMode(true)}
            className={`rounded px-2.5 py-1 font-mono text-xs font-semibold cursor-pointer transition ${
              prefetchMode === true
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            prefetch={'{true}'}
          </button>
        </div>
      </div>

      {/* 2. 상품 링크 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MOCK_PRODUCTS.slice(0, 2).map((p) => (
          <div
            key={p.id}
            onMouseEnter={handleLinkHover}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-zinc-400">
                  {p.id.toUpperCase()}
                </span>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </h5>
              </div>
              <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                {p.price.toLocaleString()}원
              </span>
            </div>

            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
              <Link
                href={`/zone/baseline/file-conventions/dynamic-segments/single-param/items/${p.id}`}
                prefetch={prefetchMode}
                className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>상품 상세로 이동</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  ({'<'}Link prefetch={'{'}{String(prefetchMode)}{'}'}{'>'})
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 3. 네트워크 통신 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-zinc-400">
          <span className="font-bold">Next.js Router prefetch 네트워크 감시:</span>
          <span>마우스 호버 감지: {hoverCount}회</span>
        </div>
        <div className="space-y-1 text-[11px]">
          {hoverCount > 0 ? (
            <div className="text-emerald-400 font-medium">
              [이벤트 감지] 마우스 호버 발생 ({hoverCount}회) — Link prefetch={'{'}{String(prefetchMode)}{'}'} 적용 상태
            </div>
          ) : (
            <div className="text-zinc-500">
              상단 상품 링크 위로 마우스를 올려 호버 이벤트를 발생시키세요.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
