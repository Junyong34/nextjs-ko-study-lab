'use client'
import React, { useEffect, useState } from 'react'

interface HydrationBoundaryDemoProps {
  onMountedChange: (mounted: boolean, clientOnlyValue: string | null) => void
}

export function HydrationBoundaryDemo({ onMountedChange }: HydrationBoundaryDemoProps) {
  const [mounted, setMounted] = useState(false)

  // 서버 렌더링 시점에는 실행되지 않고, 브라우저에서 하이드레이션이 완료된 뒤에만 실행된다.
  // 이것이 실제 Next.js/React의 "마운트 게이트" 패턴이다 — 버튼 클릭이 아니라 하이드레이션 자체가 트리거다.
  useEffect(() => {
    const clientOnlyValue = `${window.innerWidth}x${window.innerHeight} @ ${new Date().toLocaleTimeString()}`
    setMounted(true)
    onMountedChange(true, clientOnlyValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        하이드레이션 상태: {mounted ? '[확인] 클라이언트 하이드레이션 완료 (자동 감지됨)' : '서버 HTML 렌더 (브라우저 전용 값 표시 불가)'}
      </div>
      <p className="text-xs text-zinc-500">
        이 상태는 버튼 클릭이 아니라 <code>useEffect(() =&gt; setMounted(true), [])</code>가 하이드레이션 직후 자동 실행되어 전환됩니다.
        서버는 <code>window</code>에 접근할 수 없으므로, 마운트 전에는 브라우저 전용 값(뷰포트 크기 등)을 절대 렌더링하지 않아야 하이드레이션 불일치를 피할 수 있습니다.
      </p>
    </div>
  )
}
