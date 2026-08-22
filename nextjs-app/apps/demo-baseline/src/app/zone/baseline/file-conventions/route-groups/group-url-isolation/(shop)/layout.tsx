import React from 'react'

export default function ShopGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border-2 border-blue-500/40 bg-blue-50/20 p-4 dark:border-blue-500/30 dark:bg-blue-950/20">
      <div className="flex items-center justify-between border-b border-blue-200 pb-2 dark:border-blue-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
          <span className="font-bold text-xs text-blue-900 dark:text-blue-200">
            (shop) Route Group Layout (스토어프론트 GNB)
          </span>
        </div>
        <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          폴더: /(shop)/products &rarr; URL: /products
        </span>
      </div>
      {children}
    </div>
  )
}
