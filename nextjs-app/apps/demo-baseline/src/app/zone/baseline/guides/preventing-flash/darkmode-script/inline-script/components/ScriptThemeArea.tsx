'use client'

import { useEffect } from 'react'
import { InlineScript } from '../../components/InlineScript'
import { ThemedArea } from '../../components/ThemedArea'
import { AREA_ID, DEFAULT_THEME, STORAGE_KEY, THEME_SCRIPT, markHydrated } from '../../lib/theme'

/**
 * 가이드의 Themes 예제를 데모 영역 요소에 적용한 버전:
 * 1) JSX는 항상 기본값 data-theme="light"를 렌더한다 (가이드의 <html data-theme="light">).
 * 2) 요소 안의 인라인 스크립트가 HTML 파싱 중에 저장된 값을 data-theme에 넣는다.
 * 3) React는 하이드레이션 때 JSX(light)와 DOM(dark)의 속성 차이를 보게 되므로
 *    suppressHydrationWarning으로 경고를 끄고 DOM 값을 유지시킨다.
 * 4) 전환은 가이드의 ThemeToggle처럼 DOM 속성과 저장소를 직접 바꾼다 (React state 없음).
 */
export function ScriptThemeArea() {
  useEffect(() => {
    markHydrated()
  }, [])

  const toggle = () => {
    const el = document.getElementById(AREA_ID)
    const next = el?.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    el?.setAttribute('data-theme', next)
  }

  return (
    <ThemedArea
      theme={DEFAULT_THEME}
      label="인라인 스크립트 방식"
      suppressHydrationWarning
      script={<InlineScript html={THEME_SCRIPT} />}
      onToggle={toggle}
    />
  )
}
