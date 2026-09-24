'use client'

import { useEffect, useState, type RefObject } from 'react'
import type { ImgProbe } from '../types'
import { evaluateSizes, parseSrcset } from '../lib/srcset'

/** currentSrc를 srcset·sizes 없이 새 Image로 다시 받아 파일 자체의 intrinsic 폭을 잰다. */
async function measureFileWidth(url: string): Promise<number | null> {
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img.naturalWidth
  } catch {
    return null
  }
}

function readImg(img: HTMLImageElement, tag: string): ImgProbe {
  const rect = img.getBoundingClientRect()
  const parentRect = img.parentElement?.getBoundingClientRect()
  const srcsetAttr = img.getAttribute('srcset')
  const sizesAttr = img.getAttribute('sizes')
  const candidates = parseSrcset(srcsetAttr)
  const chosen =
    candidates.find((c) => new URL(c.url, window.location.href).href === img.currentSrc) ?? null
  return {
    tag,
    srcsetAttr,
    sizesAttr,
    currentSrc: img.currentSrc,
    naturalWidth: img.naturalWidth,
    fileWidth: null,
    position: getComputedStyle(img).position,
    boxWidth: Math.round(rect.width * 100) / 100,
    boxHeight: Math.round(rect.height * 100) / 100,
    parentWidth: Math.round((parentRect?.width ?? 0) * 100) / 100,
    parentHeight: Math.round((parentRect?.height ?? 0) * 100) / 100,
    viewportWidth: window.innerWidth,
    dpr: window.devicePixelRatio,
    // w 서술자인데 sizes 속성이 없으면 HTML 규칙상 기본값 100vw로 평가된다(x 서술자는 슬롯 폭을 쓰지 않음).
    slotWidth: sizesAttr
      ? evaluateSizes(sizesAttr)
      : candidates[0]?.kind === 'w'
        ? evaluateSizes('100vw')
        : null,
    candidates,
    chosen,
  }
}

/**
 * 렌더된 <img>를 load 이벤트와 창 크기 변경 때마다 다시 읽는다.
 * tag가 바뀌면(프리셋 변경·재요청) 이전 측정은 버린다.
 */
export function useImgProbe(ref: RefObject<HTMLImageElement | null>, tag: string): ImgProbe | null {
  const [probe, setProbe] = useState<ImgProbe | null>(null)

  useEffect(() => {
    const img = ref.current
    if (!img) return
    let cancelled = false
    let frame = 0

    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (cancelled || !img.complete || !img.currentSrc || img.naturalWidth === 0) return
        const base = readImg(img, tag)
        setProbe(base)
        void measureFileWidth(base.currentSrc).then((fileWidth) => {
          if (cancelled) return
          setProbe((prev) =>
            prev && prev.tag === tag && prev.currentSrc === base.currentSrc ? { ...prev, fileWidth } : prev,
          )
        })
      })
    }

    img.addEventListener('load', measure)
    window.addEventListener('resize', measure)
    // SSR된 <img>는 hydration 전에 이미 로드됐을 수 있어 마운트 직후에도 한 번 읽는다.
    measure()
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      img.removeEventListener('load', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ref, tag])

  return probe && probe.tag === tag ? probe : null
}
