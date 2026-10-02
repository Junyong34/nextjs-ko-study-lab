'use client'
import React from 'react'
import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { STALE_TIME } from './lib/deals-query'

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: STALE_TIME } } })
}

// 서버 렌더에서는 매번 새로 만들고, 브라우저에서는 이 데모 모듈의 인스턴스 하나를 재사용한다.
// (서버 컴포넌트 page.tsx의 prefetch용 QueryClient와는 별개다.)
let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (environmentManager.isServer()) return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}

export function SsrHydrationProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
}
