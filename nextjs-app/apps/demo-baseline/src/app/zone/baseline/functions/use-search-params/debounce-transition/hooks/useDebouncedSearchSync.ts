'use client'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DEBOUNCE_MS, MAX_LOG_ENTRIES } from '../types'
import type { KeystrokeEntry, LastCommit, TransitionEdge } from '../types'

/**
 * 검색창 입력을 로컬 상태로 즉시 반영하면서, 300ms 디바운스 후
 * startTransition으로 감싼 router.replace()를 실제로 호출해 URL 쿼리(`?q=`)를 동기화한다.
 * 모든 지연·전환 시각은 performance.now() 실측값이며 타이머로 흉내 낸 값이 아니다.
 */
export function useDebouncedSearchSync() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(queryFromUrl)
  const [isPending, startTransition] = useTransition()
  const [keystrokes, setKeystrokes] = useState<KeystrokeEntry[]>([])
  const [transitionEdges, setTransitionEdges] = useState<TransitionEdge[]>([])
  const [lastCommit, setLastCommit] = useState<LastCommit | null>(null)
  const [inputRenderLatencyMs, setInputRenderLatencyMs] = useState<number | null>(null)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastKeystrokeAtRef = useRef(0)
  const pendingRenderStartRef = useRef(0)
  const prevIsPendingRef = useRef(false)

  // 로컬 input 값이 실제로 화면에 반영되기까지 걸린 시간(트랜지션과 무관하게 즉시 반영돼야 함)
  useLayoutEffect(() => {
    if (pendingRenderStartRef.current === 0) return
    setInputRenderLatencyMs(performance.now() - pendingRenderStartRef.current)
  }, [inputValue])

  // isPending이 실제로 바뀌는 순간을 실측해 기록
  useEffect(() => {
    if (prevIsPendingRef.current === isPending) return
    prevIsPendingRef.current = isPending
    const now = performance.now()
    setTransitionEdges((prev) => [
      ...prev.slice(-(MAX_LOG_ENTRIES - 1)),
      { type: isPending ? 'start' : 'end', atMs: now, sinceLastKeystrokeMs: now - lastKeystrokeAtRef.current },
    ])
  }, [isPending])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const commitQuery = useCallback(
    (value: string, keystrokeAtMs: number) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
          params.set('q', value)
        } else {
          params.delete('q')
        }
        const query = params.toString()
        router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false })
      })
      setLastCommit({ query: value, keystrokeToCommitMs: performance.now() - keystrokeAtMs })
    },
    [pathname, router, searchParams, startTransition]
  )

  const handleChange = useCallback(
    (value: string) => {
      const now = performance.now()
      lastKeystrokeAtRef.current = now
      pendingRenderStartRef.current = now
      setInputValue(value)
      setKeystrokes((prev) => [...prev.slice(-(MAX_LOG_ENTRIES - 1)), { value, atMs: now }])

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => commitQuery(value, now), DEBOUNCE_MS)
    },
    [commitQuery]
  )

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    pendingRenderStartRef.current = 0
    setInputValue('')
    setKeystrokes([])
    setTransitionEdges([])
    setLastCommit(null)
    setInputRenderLatencyMs(null)
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }, [pathname, router, startTransition])

  return {
    inputValue,
    handleChange,
    isPending,
    keystrokes,
    transitionEdges,
    lastCommit,
    inputRenderLatencyMs,
    queryFromUrl,
    rawQueryString: searchParams.toString(),
    reset,
  }
}
