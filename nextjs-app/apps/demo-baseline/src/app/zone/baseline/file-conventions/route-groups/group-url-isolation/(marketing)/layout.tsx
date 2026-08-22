import React from 'react'

export default function MarketingGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border-2 border-purple-500/40 bg-purple-50/20 p-4 dark:border-purple-500/30 dark:bg-purple-950/20">
      <div className="flex items-center justify-between border-b border-purple-200 pb-2 dark:border-purple-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
          <span className="font-bold text-xs text-purple-900 dark:text-purple-200">
            (marketing) Route Group Layout (브랜드 마케팅 배너)
          </span>
        </div>
        <span className="rounded bg-purple-100 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          폴더: /(marketing)/about &rarr; URL: /about
        </span>
      </div>
      {children}
    </div>
  )
}
