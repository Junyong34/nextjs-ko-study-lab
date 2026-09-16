'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRuleRegistry } from './Registry'
import { StyleRegistryReactContext } from './StyleRegistryContext'

/**
 * 공식 CSS-in-JS 가이드(styled-components/styled-jsx 레지스트리 패턴)를 그대로 재현한다.
 * useState 지연 초기화로 요청(렌더)당 레지스트리 인스턴스 하나를 만들고,
 * useServerInsertedHTML로 스트리밍 중 쌓인 규칙을 그때그때 flush해 <style>로 반환한다.
 *
 * Next.js는 이 콜백을 "스트림이 새 청크를 플러시할 때마다" 다시 호출한다.
 * 최초 호출 결과는 실제로 </head> 앞에 삽입되지만, Suspense 경계가 resolve된 뒤의
 * 후속 호출은 이미 head가 닫힌 뒤라 해당 청크 바로 앞 body 안에 인라인으로 삽입된다
 * (next/dist/server/stream-utils/node-web-streams-helper.js의
 * createHeadInsertionTransformStream 구현으로 직접 확인함).
 */
export function HookEnabledProvider({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => new StyleRuleRegistry())

  useServerInsertedHTML(() => {
    const css = registry.flush()
    if (!css) return null
    return <style data-demo-registry="active" dangerouslySetInnerHTML={{ __html: css }} />
  })

  return (
    <StyleRegistryReactContext.Provider value={registry}>
      {children}
    </StyleRegistryReactContext.Provider>
  )
}
