'use client'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { FetchRun } from '../types'

const key = (run: FetchRun) => `${run.renderedAt}|${run.ok ? run.echo.requestCount : 'error'}`

export function useFetchRuns(latest: FetchRun) {
  const router = useRouter()
  // 서버 렌더가 새로 실행될 때마다 props로 도착한 fetch 결과를 쌓는다. 화면에서 값을 만들지 않는다.
  const [runs, setRuns] = useState<FetchRun[]>([latest])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setRuns((prev) => (key(prev[0]) === key(latest) ? prev : [latest, ...prev].slice(0, 5)))
  }, [latest])

  // router.refresh()는 page.tsx를 서버에서 다시 실행하므로 fetch도 다시 나간다.
  const rerun = () => startTransition(() => router.refresh())
  const reset = () => setRuns([latest])

  return { runs, isPending, rerun, reset }
}
