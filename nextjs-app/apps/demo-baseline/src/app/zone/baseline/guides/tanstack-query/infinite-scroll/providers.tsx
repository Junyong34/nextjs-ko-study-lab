'use client'
import React from 'react'
import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 서버 렌더마다 새 QueryClient, 브라우저에서는 이 데모 모듈 안의 하나를 재사용한다.
// 브라우저 쪽을 재사용해야 목록에서 다른 화면으로 갔다 와도 캐시가 남는다.
let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (environmentManager.isServer()) return new QueryClient()
  browserQueryClient ??= new QueryClient()
  return browserQueryClient
}

export function InfiniteScrollProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
}
