'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { VideoEvent } from '../types'

const TRACKED_EVENTS = ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'playing', 'error'] as const

function newRunId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * IntersectionObserver로 스크롤 박스 안에 영상이 25% 이상 보이면 처음으로 src를 부여한다.
 * run id는 마운트 후(effect)에 만들어 서버 렌더 HTML에는 영상 URL이 전혀 실리지 않게 한다.
 * 진입 이후에는 muted autoplay를 시도하고, <video> 이벤트가 진입 후 몇 ms에 일어났는지 기록한다.
 */
export function useLazyVideo(rootRef: RefObject<HTMLElement | null>, videoRef: RefObject<HTMLVideoElement | null>) {
  const [run, setRun] = useState<string | null>(null)
  const [entered, setEntered] = useState(false)
  const [events, setEvents] = useState<VideoEvent[]>([])
  const enteredAt = useRef(0)

  useEffect(() => {
    setRun(newRunId('lazy'))
  }, [])

  // 대상 요소는 run이 정해진 뒤 key로 새로 만들어지므로, run마다 관찰을 다시 시작한다.
  useEffect(() => {
    const video = videoRef.current
    if (!run || !video) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        enteredAt.current = performance.now()
        setEntered(true)
        observer.disconnect()
      },
      { root: rootRef.current, threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [run, rootRef, videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!entered || !video) return
    const listeners = TRACKED_EVENTS.map((name) => {
      const handler = () => setEvents((prev) => [...prev, { name, at: Math.round(performance.now() - enteredAt.current) }])
      video.addEventListener(name, handler)
      return [name, handler] as const
    })
    video.play().catch(() => setEvents((prev) => [...prev, { name: 'play() 거부됨', at: Math.round(performance.now() - enteredAt.current) }]))
    return () => listeners.forEach(([name, handler]) => video.removeEventListener(name, handler))
  }, [entered, videoRef])

  const reset = useCallback(() => {
    setEntered(false)
    setEvents([])
    if (rootRef.current) rootRef.current.scrollTop = 0
    setRun(newRunId('lazy'))
  }, [rootRef])

  return { run, entered, events, reset }
}
