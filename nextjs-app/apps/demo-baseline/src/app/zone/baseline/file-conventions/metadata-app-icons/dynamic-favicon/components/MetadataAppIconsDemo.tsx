'use client'
import React from 'react'

export function MetadataAppIconsDemo() {
  const ICON_PATH = '/zone/baseline/file-conventions/metadata-app-icons/dynamic-favicon/icon'
  const APPLE_ICON_PATH = '/zone/baseline/file-conventions/metadata-app-icons/dynamic-favicon/apple-icon'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">동적 메타데이터 앱 아이콘 (icon.tsx / apple-icon.tsx)</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ImageResponse 렌더링
            </span>
          </div>
          <p className="text-xs text-zinc-500">JSX 코드로 브라우저 파비콘(32x32)과 애플 터치 아이콘(180x180)을 서버에서 즉석 생성합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">1. 브라우저 파비콘 (icon.tsx)</span>
            <span className="font-mono text-[10px] text-zinc-500">32x32 PNG</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-xl text-white shadow-xs">
              🛒
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
              <div className="font-mono font-semibold text-blue-600 dark:text-blue-400">{ICON_PATH}</div>
              <div className="text-[11px] text-zinc-500">태그: &lt;link rel="icon" ... /&gt; 자동 주입</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">2. 애플 터치 아이콘 (apple-icon.tsx)</span>
            <span className="font-mono text-[10px] text-zinc-500">180x180 PNG</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-xl text-white shadow-xs">
              🛍️
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
              <div className="font-mono font-semibold text-purple-600 dark:text-purple-400">{APPLE_ICON_PATH}</div>
              <div className="text-[11px] text-zinc-500">태그: &lt;link rel="apple-touch-icon" ... /&gt; 자동 주입</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
