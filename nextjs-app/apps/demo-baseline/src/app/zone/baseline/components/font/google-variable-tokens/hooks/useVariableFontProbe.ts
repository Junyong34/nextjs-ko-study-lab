'use client'

import { useEffect, useState } from 'react'
import type { VariableFontProbeResult } from '../types'

const INITIAL_RESULT: VariableFontProbeResult = {
  cssVariableValue: '',
  fontFaceRules: [],
  fontFaceWeightDescriptors: [],
  computedFontFamily: '',
  computedFontWeight: '',
  isWeightAvailable: false,
  isReady: false,
}

/**
 * next/font/google이 실제로 브라우저에 등록한 CSS 변수·@font-face 규칙과
 * 미리보기 요소의 computed style을 직접 읽어 검증하는 훅.
 * weight가 바뀔 때마다 재실행되어, 슬라이더 조작이 실제 렌더링에 반영되는지 실측한다.
 */
export function useVariableFontProbe(
  previewElement: HTMLElement | null,
  primaryFamily: string,
  variableName: string,
  weight: number,
) {
  const [result, setResult] = useState<VariableFontProbeResult>(INITIAL_RESULT)

  useEffect(() => {
    if (!previewElement || !primaryFamily) return

    let cancelled = false

    async function probe() {
      // document.fonts.ready: 브라우저가 실제로 폰트 리소스를 로드/디코딩할 때까지 대기
      await document.fonts.ready

      const fontFaceRules: string[] = []
      const fontFaceWeightDescriptors: string[] = []
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList
        try {
          rules = sheet.cssRules
        } catch {
          continue
        }
        for (const rule of Array.from(rules)) {
          // 정확히 일치하는 family만 센다 — Next.js가 함께 생성하는 "{Family} Fallback"
          // 메트릭 보정용 로컬 폰트 규칙까지 포함하면 실측치가 부풀려진다.
          if (
            rule instanceof CSSFontFaceRule &&
            rule.style.fontFamily.replace(/^['"]|['"]$/g, '') === primaryFamily
          ) {
            fontFaceRules.push(rule.cssText)
            fontFaceWeightDescriptors.push(rule.style.fontWeight)
          }
        }
      }

      const computedStyle = window.getComputedStyle(previewElement!)
      const cssVariableValue = computedStyle.getPropertyValue(variableName).trim()
      const isWeightAvailable = document.fonts.check(`${weight} 16px "${primaryFamily}"`)

      if (!cancelled) {
        setResult({
          cssVariableValue,
          fontFaceRules,
          fontFaceWeightDescriptors,
          computedFontFamily: computedStyle.fontFamily,
          computedFontWeight: computedStyle.fontWeight,
          isWeightAvailable,
          isReady: true,
        })
      }
    }

    probe()

    return () => {
      cancelled = true
    }
  }, [previewElement, primaryFamily, variableName, weight])

  return result
}
