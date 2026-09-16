'use client'

import React, { useEffect, useState } from 'react'
import { StyleRuleRegistry } from './Registry'
import { StyleRegistryReactContext } from './StyleRegistryContext'

/**
 * 대조군: 레지스트리는 동일하게 두지만 useServerInsertedHTML을 호출하지 않는다.
 * 그 결과 SSR 스트림에는 <style>이 전혀 실리지 않고, 하이드레이션이 끝난 뒤
 * 브라우저에서 useEffect로 DOM에 직접 삽입한다 — 이 훅이 없을 때 CSS-in-JS
 * 라이브러리가 실제로 겪는 FOUC(스타일 미적용 첫 화면 깜빡임)를 그대로 재현한다.
 */
export function HookDisabledProvider({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => new StyleRuleRegistry())

  useEffect(() => {
    const css = registry.flush()
    if (!css) return
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-demo-registry', 'client-patched-after-hydration')
    styleEl.textContent = css
    document.head.appendChild(styleEl)
    return () => {
      styleEl.remove()
    }
  }, [registry])

  return (
    <StyleRegistryReactContext.Provider value={registry}>
      {children}
    </StyleRegistryReactContext.Provider>
  )
}
