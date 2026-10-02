'use client'
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { isControlPlayer, isLitePlayer, tally } from '../lib/resources'
import type { EmbedMeasure, LitePhase } from '../types'

const DEFINE_TIMEOUT_MS = 10_000

function measure(root: HTMLElement | null, from: number, to: number): EmbedMeasure {
  const iframe = root?.querySelector('iframe') ?? null
  return {
    iframes: root?.querySelectorAll('iframe').length ?? 0,
    iframeSrc: iframe?.getAttribute('src') ?? null,
    tally: tally(from, to, isLitePlayer, isControlPlayer),
  }
}

export function useLiteEmbed() {
  const [phase, setPhase] = useState<LitePhase>('idle')
  const [mountedAt, setMountedAt] = useState<number | null>(null)
  const [clickedAt, setClickedAt] = useState<number | null>(null)
  // 클릭 직전에 고정한 측정값(클릭 전 iframe 0개·플레이어 요청 0건의 증거)
  const [beforeClick, setBeforeClick] = useState<EmbedMeasure | null>(null)
  // 배치~지금(클릭 전) 또는 클릭~지금(클릭 후) 구간의 실시간 측정값
  const [live, setLive] = useState<EmbedMeasure | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // lite-yt-embed.js(lazyOnload)가 <lite-youtube>를 커스텀 엘리먼트로 등록해야 facade가 동작한다.
  useEffect(() => {
    if (phase !== 'loading') return
    let cancelled = false
    const timeout = new Promise<'error'>((r) => setTimeout(() => r('error'), DEFINE_TIMEOUT_MS))
    Promise.race([customElements.whenDefined('lite-youtube').then(() => 'facade' as const), timeout]).then((next) => {
      if (!cancelled) setPhase(next)
    })
    return () => {
      cancelled = true
    }
  }, [phase])

  useEffect(() => {
    if (mountedAt === null) return
    const tick = () => setLive(measure(rootRef.current, clickedAt ?? mountedAt, performance.now() + 1))
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [mountedAt, clickedAt])

  const mount = useCallback(() => {
    setMountedAt(performance.now())
    setPhase('loading')
  }, [])

  // React의 캡처 단계 핸들러는 <lite-youtube>의 click 리스너(iframe 생성)보다 먼저 실행된다.
  const onClickCapture = useCallback((e: MouseEvent) => {
    if (phase !== 'facade' || mountedAt === null) return
    if (!(e.target as Element).closest('lite-youtube')) return
    const now = performance.now()
    setBeforeClick(measure(rootRef.current, mountedAt, now))
    setClickedAt(now)
    setPhase('activated')
  }, [phase, mountedAt])

  const reset = useCallback(() => {
    setPhase('idle')
    setMountedAt(null)
    setClickedAt(null)
    setBeforeClick(null)
    setLive(null)
  }, [])

  return { phase, mountedAt, beforeClick, live, rootRef, mount, onClickCapture, reset }
}

export type LiteEmbedState = ReturnType<typeof useLiteEmbed>
