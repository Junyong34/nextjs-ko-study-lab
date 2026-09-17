'use client'
import React, { useEffect, useState } from 'react'

interface LayoutMountInfo {
  id: string
  mountedAt: string
}

function createMountInfo(): LayoutMountInfo {
  return {
    id: `LAYOUT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    mountedAt: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
  }
}

export function CheckoutSegmentLayout({ children }: { children: React.ReactNode }) {
  // 서버 렌더 결과와 클라이언트 최초 렌더 결과가 달라 hydration 불일치가 나지 않도록,
  // 랜덤 ID는 useState 초깃값이 아니라 마운트 후 useEffect에서 한 번만 생성한다.
  // checkout/page.tsx가 던진 에러를 checkout/error.tsx가 잡아도 이 값은 그대로 유지된다 —
  // error.tsx는 같은 세그먼트의 layout.tsx를 감싸지 않고, 이 컴포넌트는 리마운트되지 않기 때문이다.
  const [mountInfo, setMountInfo] = useState<LayoutMountInfo | null>(null)

  useEffect(() => {
    setMountInfo(createMountInfo())
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-[11px] dark:border-zinc-700 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <span>주문 확인</span>
          <span>→</span>
          <span className="font-semibold text-blue-700 dark:text-blue-400">결제 정보 입력</span>
          <span>→</span>
          <span>완료</span>
        </div>
        <span
          className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          title="checkout/layout.tsx 마운트 시 한 번만 생성되는 값입니다. error.tsx 활성화·reset() 이후에도 이 값이 바뀌지 않으면 layout.tsx가 리마운트되지 않았다는 뜻입니다."
        >
          checkout/layout.tsx 유지 중{mountInfo ? ` · ${mountInfo.id} · ${mountInfo.mountedAt}` : ' · 초기화 중...'}
        </span>
      </div>
      {children}
    </div>
  )
}
