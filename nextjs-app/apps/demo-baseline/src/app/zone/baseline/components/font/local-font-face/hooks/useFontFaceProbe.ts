'use client'

import { useEffect, useState } from 'react'
import type { FontFaceProbeResult } from '../types'

const INITIAL_RESULT: FontFaceProbeResult = {
  fontFaceRules: [],
  computedFontFamily: '',
  computedFontWeight: '',
  isFontLoaded: false,
  isReady: false,
}

/** next/font/local이 실제로 브라우저에 등록한 @font-face 규칙과 computed style을 직접 읽어 검증하는 훅. */
export function useFontFaceProbe(
  previewElement: HTMLElement | null,
  primaryFamily: string,
  weight: string,
) {
  const [result, setResult] = useState<FontFaceProbeResult>(INITIAL_RESULT)

  useEffect(() => {
    if (!previewElement || !primaryFamily) return

    let cancelled = false

    async function probe() {
      // document.fonts.ready: 브라우저가 실제로 폰트 리소스를 로드/디코딩할 때까지 대기
      await document.fonts.ready

      const fontFaceRules: string[] = []
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList
        try {
          rules = sheet.cssRules
        } catch {
          continue
        }
        for (const rule of Array.from(rules)) {
          if (
            rule instanceof CSSFontFaceRule &&
            rule.style.fontFamily.includes(primaryFamily)
          ) {
            fontFaceRules.push(rule.cssText)
          }
        }
      }

      const computedStyle = window.getComputedStyle(previewElement!)
      const isFontLoaded = document.fonts.check(`${weight} 16px "${primaryFamily}"`)

      if (!cancelled) {
        setResult({
          fontFaceRules,
          computedFontFamily: computedStyle.fontFamily,
          computedFontWeight: computedStyle.fontWeight,
          isFontLoaded,
          isReady: true,
        })
      }
    }

    probe()

    return () => {
      cancelled = true
    }
  }, [previewElement, primaryFamily, weight])

  return result
}
