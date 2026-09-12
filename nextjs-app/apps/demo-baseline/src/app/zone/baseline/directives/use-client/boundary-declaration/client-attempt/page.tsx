'use client'

import React, { useState } from 'react'
import { useBoundaryState } from '../components/BoundaryContext'
import { LeafInteractiveBadge } from '../components/LeafInteractiveBadge'

export default function ClientAttemptPage() {
  const { setClientAttempt, setLeafAttempt } = useBoundaryState()
  const [count, setCount] = useState(0)

  const handleClick = () => {
    const next = count + 1
    setCount(next)
    setClientAttempt({ status: 'success', detail: `onClick이 정상 실행되어 ${next}번 클릭됨` })
  }

  return (
    <div className="space-y-3 rounded-md border border-emerald-200 bg-white p-4 text-xs dark:border-emerald-900/40 dark:bg-zinc-950">
      <p className="text-zinc-600 dark:text-zinc-400">
        이 페이지는 최상단에 <code>&apos;use client&apos;</code>가 선언된 실제 Client Component입니다. 같은 형태의{' '}
        <code>onClick</code>이 정상적으로 실행됩니다.
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="rounded bg-emerald-600 px-4 py-2 font-medium text-white"
      >
        클라이언트 컴포넌트 버튼 (클릭 {count}회)
      </button>

      <div className="space-y-1.5 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-500">
          아래 배지 컴포넌트 파일(<code>LeafInteractiveBadge.tsx</code>)에는 자체 <code>&apos;use client&apos;</code>
          가 없지만, 이미 이 페이지가 만든 클라이언트 경계 안쪽에서 import되었기 때문에 정상적으로 클릭에
          반응합니다.
        </p>
        <LeafInteractiveBadge
          onInteract={(n) =>
            setLeafAttempt({ status: 'success', detail: `하위 컴포넌트도 ${n}번 반응함 (자신은 'use client' 없음)` })
          }
        />
      </div>
    </div>
  )
}
