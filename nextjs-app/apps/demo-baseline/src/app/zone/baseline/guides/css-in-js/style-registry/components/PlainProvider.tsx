'use client'

import React, { useInsertionEffect, useState } from 'react'
import { StyleRegistry } from '../lib/registry'
import { RegistryContext } from './RegistryContext'

/**
 * 대조군: registry와 클래스 생성 로직은 같지만 useServerInsertedHTML을 호출하지 않는다.
 * 서버가 보낸 첫 HTML에는 클래스명만 있고 규칙이 없다. 규칙은 JS가 로드·하이드레이션된 뒤에야
 * 주입되므로 그 사이 사용자는 스타일 없는 화면(FOUC)을 본다.
 */
export function PlainProvider({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => new StyleRegistry())

  useInsertionEffect(() => {
    registry.commit(document)
  })

  return <RegistryContext.Provider value={registry}>{children}</RegistryContext.Provider>
}
