import React from 'react'
import { getLayoutBannerCache } from './cachedData'

export default async function PageVsLayoutLayout({ children }: { children: React.ReactNode }) {
  const banner = await getLayoutBannerCache()

  return (
    <div className="space-y-3">
      <div className="rounded border border-amber-200 bg-amber-50/60 p-2.5 font-mono text-[11px] dark:border-amber-900/50 dark:bg-amber-950/20">
        <span className="font-sans font-bold text-amber-900 dark:text-amber-200">공유 layout.tsx 배너</span>
        {' '}— layout cacheId: <span className="font-bold">#{banner.cacheId}</span> · {banner.generatedAt}
      </div>
      {children}
    </div>
  )
}
