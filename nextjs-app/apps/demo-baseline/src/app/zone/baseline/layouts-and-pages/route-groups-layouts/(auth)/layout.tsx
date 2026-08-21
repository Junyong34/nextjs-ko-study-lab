import React from 'react'

export default function AuthRouteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
      {/* (auth) 레이아웃: GNB 없이 중앙 집중형 카드 */}
      <div className="mx-auto max-w-sm rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-3 text-center">
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            app/(auth)/layout.tsx (인증 독립 레이아웃)
          </span>
        </div>

        {children}

        <div className="mt-3 text-center font-mono text-[10px] text-zinc-400">
          SSL 보안 인증 뷰 (GNB 생략됨)
        </div>
      </div>
    </div>
  )
}
