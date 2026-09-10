'use client'

import { useEffect, useState, type RefObject } from 'react'
import type { ActualState, PreloadVariant } from '../types'
import { EXPECTED_BY_VARIANT } from './variantConfig'

/**
 * 실제 브라우저 <head>와 <img> DOM을 읽어 priority/preload variant의 진짜 결과를 확인한다.
 * 하드코딩 문자열이 아니라 document.head.querySelectorAll / img 엘리먼트 속성을 직접 조회한다.
 */
export function useRealHeadCheck(
  variant: PreloadVariant,
  heroImageUrl: string,
  imgRef: RefObject<HTMLImageElement | null>,
) {
  const [actual, setActual] = useState<ActualState>({
    loading: null,
    fetchPriority: null,
    preloadLink: false,
    preloadLinkHref: null,
    imgSrc: null,
  })

  useEffect(() => {
    // <Image>가 커밋된 다음 프레임에 읽어야 React가 삽입한 <link>/속성을 놓치지 않는다.
    const raf = requestAnimationFrame(() => {
      const img = imgRef.current
      if (!img) return

      const preloadLinks = Array.from(
        document.head.querySelectorAll<HTMLLinkElement>('link[rel="preload"][as="image"]'),
      )
      const matched = preloadLinks.find(
        (link) =>
          link.getAttribute('href') === heroImageUrl ||
          (link.getAttribute('imagesrcset') ?? '').includes(heroImageUrl),
      )

      setActual({
        loading: img.hasAttribute('loading') ? img.getAttribute('loading') : null,
        fetchPriority: img.getAttribute('fetchpriority'),
        preloadLink: Boolean(matched),
        preloadLinkHref: matched
          ? matched.getAttribute('href') ?? matched.getAttribute('imagesrcset') ?? null
          : null,
        imgSrc: img.getAttribute('src'),
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [variant, heroImageUrl, imgRef])

  const expected = EXPECTED_BY_VARIANT[variant]

  const isMatched =
    actual.imgSrc === null
      ? undefined
      : actual.loading === expected.loading && actual.preloadLink === expected.preloadLink

  return { actual, expected, isMatched }
}
