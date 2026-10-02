import React from 'react'
import { SsrHydrationProviders } from './providers'

// QueryClientProvider는 zone 루트가 아니라 이 데모(page.tsx · client-only/page.tsx)를 감싸는 layout에만 둔다.
export default function SsrHydrationLayout({ children }: { children: React.ReactNode }) {
  return <SsrHydrationProviders>{children}</SsrHydrationProviders>
}
