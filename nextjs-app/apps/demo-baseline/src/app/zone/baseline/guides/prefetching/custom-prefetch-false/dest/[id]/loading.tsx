'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { markLoading } from '../../lib/navTiming'

// loading 경계. 기본 prefetch가 미리 받아오는 범위는 여기까지다.
export default function DestLoading() {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    markLoading(id)
  }, [id])

  return (
    <div className="animate-pulse rounded border border-zinc-200 bg-zinc-100 px-4 py-6 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
      재고·가격 정보를 불러오는 중... (<code>dest/[id]/loading.tsx</code>)
    </div>
  )
}
