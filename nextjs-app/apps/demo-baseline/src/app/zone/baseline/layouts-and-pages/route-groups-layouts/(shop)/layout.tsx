import React from 'react'

export default function ShopRouteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded border border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* (shop) 레이아웃 헤더: 프로모션 공지 + GNB */}
      <div className="bg-zinc-800 px-4 py-1 text-center text-[11px] font-medium text-white dark:bg-zinc-900">
        [app/(shop)/layout.tsx] 쇼핑몰 상단 프로모션 공지 배너
      </div>
      <header className="flex items-center justify-between border-b border-zinc-200 bg-zinc-900 px-4 py-2.5 text-white dark:border-zinc-800">
        <span className="font-mono text-xs font-bold text-emerald-400">
          Shop GNB Header
        </span>
        <div className="flex gap-3 text-xs text-zinc-300">
          <span>신상품</span>
          <span>베스트</span>
          <span>장바구니 (3)</span>
        </div>
      </header>

      {/* 페이지 콘텐츠 영역 */}
      <main className="p-4">{children}</main>

      {/* 푸터 */}
      <footer className="border-t border-zinc-100 bg-zinc-50 px-4 py-2 text-center text-[10px] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
        (shop) 전용 푸터 영역
      </footer>
    </div>
  )
}
