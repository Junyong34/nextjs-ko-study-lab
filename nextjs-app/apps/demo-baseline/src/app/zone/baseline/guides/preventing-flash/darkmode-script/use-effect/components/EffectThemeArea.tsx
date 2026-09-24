'use client'

import { useEffect, useState } from 'react'
import { ThemedArea } from '../../components/ThemedArea'
import { DEFAULT_THEME, STORAGE_KEY, markHydrated, readStoredTheme } from '../../lib/theme'
import type { Theme } from '../../types'

/**
 * 흔한 첫 시도: 서버와 같은 기본값으로 시작하고 useEffect에서 저장된 테마를 적용한다.
 * 하이드레이션 경고는 없지만, useEffect는 하이드레이션과 페인트가 끝난 뒤 실행되므로
 * 그 전까지 서버 HTML의 기본 테마(light)가 화면에 그려진다.
 */
export function EffectThemeArea() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  useEffect(() => {
    markHydrated()
    setTheme(readStoredTheme())
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    setTheme(next)
  }

  return <ThemedArea theme={theme} label="useEffect 방식" onToggle={toggle} />
}
