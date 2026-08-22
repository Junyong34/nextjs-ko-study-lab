'use client'

import React, { useState } from 'react'

interface WishlistButtonClientProps {
  productId: string
  initialLikes?: number
}

/**
 * Client Component (RCC):
 * 인터랙션(onClick)과 상태 관리(useState)가 필요할 때
 * "use client" 경계를 선언하여 해당 컴포넌트만 클라이언트에서 Hydrate됩니다.
 */
export function WishlistButtonClient({
  initialLikes = 142,
}: WishlistButtonClientProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)

  const handleToggle = () => {
    setLiked((prev) => {
      const next = !prev
      setLikes((c) => (next ? c + 1 : c - 1))
      return next
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            liked
              ? 'bg-rose-500 text-white shadow-xs'
              : 'border border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
          }`}
        >
          <span>{liked ? ' 찜 완료' : ' 위시리스트 담기'}</span>
          <span className="font-mono text-[11px]">{likes}</span>
        </button>

        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          {liked
            ? '클라이언트 로컬 상태가 즉시 갱신되었습니다.'
            : '버튼을 클릭하여 클라이언트 인터랙션을 확인하세요.'}
        </span>
      </div>

      <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        "use client" (RCC)
      </span>
    </div>
  )
}
