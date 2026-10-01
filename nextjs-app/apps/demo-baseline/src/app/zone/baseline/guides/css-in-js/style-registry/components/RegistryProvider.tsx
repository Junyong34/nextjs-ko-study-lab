'use client'

import React, { useInsertionEffect, useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { SSR_STYLE_ATTR, StyleRegistry } from '../lib/registry'
import { RegistryContext } from './RegistryContext'

/**
 * 공식 CSS-in-JS 가이드의 registry 패턴.
 * 1) useState 지연 초기화로 요청(렌더)마다 registry 인스턴스 하나를 만든다.
 * 2) 렌더 중 컴포넌트가 registry.insert()로 규칙을 수집한다.
 * 3) 서버: useServerInsertedHTML이 스트림을 flush할 때 수집된 규칙을 <style>로 끼워 넣는다.
 * 4) 클라이언트: useInsertionEffect에서 commit()이 SSR 규칙은 재사용하고 새 규칙만 주입한다.
 */
export function RegistryProvider({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => new StyleRegistry())

  useServerInsertedHTML(() => {
    const css = registry.flush()
    return css ? <style data-registry={SSR_STYLE_ATTR} dangerouslySetInnerHTML={{ __html: css }} /> : null
  })

  useInsertionEffect(() => {
    registry.commit(document)
  })

  return <RegistryContext.Provider value={registry}>{children}</RegistryContext.Provider>
}
