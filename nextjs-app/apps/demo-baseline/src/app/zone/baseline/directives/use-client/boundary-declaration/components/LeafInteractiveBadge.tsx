import React, { useState } from 'react'

/**
 * 이 파일 최상단에는 'use client'가 없다.
 * client-attempt/page.tsx('use client')가 이 컴포넌트를 import하는 순간
 * 이미 클라이언트 경계 안쪽이라 자체 지시어 없이도 useState/onClick이 그대로 동작한다.
 */
export function LeafInteractiveBadge({ onInteract }: { onInteract: (count: number) => void }) {
  const [clicks, setClicks] = useState(0)

  return (
    <button
      type="button"
      onClick={() => {
        const next = clicks + 1
        setClicks(next)
        onInteract(next)
      }}
      className="rounded border border-dashed border-zinc-400 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer"
    >
      'use client' 없는 하위 컴포넌트 (클릭 {clicks}회)
    </button>
  )
}
