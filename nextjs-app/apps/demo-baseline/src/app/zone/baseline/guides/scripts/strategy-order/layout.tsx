import type { Metadata } from 'next'
import Script from 'next/script'
import { getDemoMetadata } from '@study/demos'
import { ProbeBootstrap } from './components/ProbeBootstrap'
import { probeSrc } from './types'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/scripts/strategy-order')

/**
 * 가이드의 "Layout Scripts" 패턴: 이 레이아웃에 둔 스크립트는 strategy-order 페이지와
 * 모든 하위 라우트(campaign, campaign/detail)에서 로드되며, 그 사이를 이동해도 한 번만 실행된다.
 * 서버 컴포넌트 레이아웃에서도 이벤트 핸들러 없이 <Script>를 바로 쓸 수 있다.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProbeBootstrap />
      {children}
      <Script id="strategy-order-layout-analytics" src={probeSrc('layout-analytics')} />
    </>
  )
}
