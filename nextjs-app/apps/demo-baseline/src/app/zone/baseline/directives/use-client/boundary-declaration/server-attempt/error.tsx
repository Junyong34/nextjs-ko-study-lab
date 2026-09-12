'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useBoundaryState } from '../components/BoundaryContext'

export default function ServerAttemptError({ error }: { error: Error & { digest?: string } }) {
  const { setServerAttempt } = useBoundaryState()

  useEffect(() => {
    setServerAttempt({
      status: 'error',
      detail: error.message || 'Server Component에서 이벤트 핸들러를 직렬화할 수 없어 렌더링이 거부되었습니다.',
    })
    // 실무: Sentry, Datadog 등 에러 모니터링 시스템으로 전송
    console.error('server-attempt render error:', error)
  }, [error, setServerAttempt])

  return (
    <div className="space-y-3 rounded-md border border-rose-300 bg-rose-50/60 p-4 text-xs dark:border-rose-900/60 dark:bg-rose-950/20">
      <div className="flex items-center gap-2">
        <span className="font-bold text-rose-900 dark:text-rose-200">[실제 런타임 에러] server-attempt/error.tsx 포착</span>
        <span className="rounded bg-rose-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200">
          시뮬레이션 아님
        </span>
      </div>
      <p className="font-mono text-rose-800 dark:text-rose-300">{error.message}</p>
      <p className="text-zinc-600 dark:text-zinc-400">
        Server Component가 렌더링한 <code>onClick</code>은 브라우저로 직렬화할 수 없는 함수라서, Next.js가 이
        페이지의 렌더링 자체를 거부했습니다. 이것이 &apos;use client&apos; 경계 반대편에서 실제로 벌어지는 일입니다.
      </p>
      <div className="flex gap-2 pt-1">
        <Link
          href="/zone/baseline/directives/use-client/boundary-declaration"
          className="rounded border border-rose-300 bg-white px-3 py-1.5 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-zinc-900 dark:text-rose-300"
        >
          허브로 돌아가기
        </Link>
      </div>
    </div>
  )
}
