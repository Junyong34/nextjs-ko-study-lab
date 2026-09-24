'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * 지금 이 컴포넌트가 어디서 렌더링되고 있는지 반환한다.
 * SSR(서버에서 HTML 생성) 중에는 getServerSnapshot, 브라우저(하이드레이션 이후/soft navigation)에서는 getSnapshot이 쓰인다.
 * 'use client' 컴포넌트도 첫 요청에서는 서버에서 한 번 렌더링된다는 사실을 실제로 보여준다.
 */
export function useRenderEnv(): 'server (SSR)' | 'browser' {
  return useSyncExternalStore(
    subscribe,
    () => 'browser' as const,
    () => 'server (SSR)' as const,
  )
}
