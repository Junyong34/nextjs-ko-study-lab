'use client'

import { useCallback, useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react'
import type { BackgroundInfo, ProbeResult } from '../types'

const EMPTY: ProbeResult = {
  initial: null,
  loadMs: null,
  bgRemovedMs: null,
  bgAfterLoad: null,
  bgNow: false,
  serverWaitMs: null,
}

/**
 * next/image가 렌더한 <img>의 inline style.backgroundImage를 해석한다.
 * placeholder="blur"면 Next.js(get-img-props.js)가 blurDataURL을
 * url("data:image/svg+xml;...<image href='{blurDataURL}'/>...") 형태의 SVG 블러 필터로 감싼다.
 */
export function readBackground(img: HTMLImageElement): BackgroundInfo {
  const css = img.style.backgroundImage
  if (!css || css === 'none') return { cssLength: 0, svgWrapped: false, innerHref: null }
  const svgWrapped = css.includes('data:image/svg+xml')
  let decoded = css
  try {
    decoded = decodeURIComponent(css)
  } catch {
    // 퍼센트 인코딩이 깨진 경우 원문 그대로 해석한다.
  }
  const href = svgWrapped
    ? /href=['"]([^'"]*)['"]/.exec(decoded)?.[1]
    : /url\(["']?([^"')]*)["']?\)/.exec(css)?.[1]
  return { cssLength: css.length, svgWrapped, innerHref: href ?? null }
}

function serverWaitFor(src: string): number | null {
  const entries = performance.getEntriesByName(src, 'resource') as PerformanceResourceTiming[]
  const last = entries[entries.length - 1]
  if (!last || !last.responseStart || !last.requestStart) return null
  return Math.round(last.responseStart - last.requestStart)
}

/**
 * runKey가 바뀔 때마다(= <Image key>가 바뀌어 새로 마운트될 때마다) 실제 DOM을 다시 측정한다.
 * - 마운트 직후 useLayoutEffect(첫 페인트 전)에서 background-image를 읽는다.
 * - MutationObserver로 style 속성 변화를 감시해 background-image가 빠지는 순간을 기록한다.
 * - onLoad(next/image가 decode 후 호출) 시점까지의 경과 ms를 performance.now()로 잰다.
 */
export function usePlaceholderProbe(runKey: number) {
  const imgRef = useRef<HTMLImageElement>(null)
  const t0Ref = useRef(0)
  const [result, setResult] = useState<ProbeResult>(EMPTY)

  useLayoutEffect(() => {
    const img = imgRef.current
    if (!img) return
    const t0 = performance.now()
    t0Ref.current = t0
    const initial = readBackground(img)
    let hadBg = initial.cssLength > 0
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setResult({ ...EMPTY, initial, bgNow: hadBg })
    })

    const observer = new MutationObserver(() => {
      const hasBg = readBackground(img).cssLength > 0
      const elapsed = Math.round(performance.now() - t0)
      if (hadBg && !hasBg) {
        setResult((prev) => ({ ...prev, bgNow: false, bgRemovedMs: prev.bgRemovedMs ?? elapsed }))
      } else {
        setResult((prev) => ({ ...prev, bgNow: hasBg }))
      }
      hadBg = hasBg
    })
    observer.observe(img, { attributes: true, attributeFilter: ['style'] })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [runKey])

  const onLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    const loadMs = Math.round(performance.now() - t0Ref.current)
    setResult((prev) => ({ ...prev, loadMs }))
    // onLoad 직후 React가 blurComplete=true로 다시 렌더한 뒤의 style을 다음 프레임에서 읽는다.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const bgAfterLoad = readBackground(img).cssLength > 0
        setResult((prev) => ({ ...prev, bgAfterLoad, serverWaitMs: serverWaitFor(img.currentSrc) }))
      }),
    )
  }, [])

  return { imgRef, onLoad, result }
}
