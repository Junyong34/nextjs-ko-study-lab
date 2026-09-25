import Script from 'next/script'
import { probeSrc } from '../types'

/**
 * "특정 라우트에만 로드" 패턴: 캠페인 전환 픽셀은 campaign 세그먼트 레이아웃에만 둔다.
 * strategy-order 루트 페이지에서는 요청조차 발생하지 않고, campaign 이하로 들어올 때 처음 로드된다.
 */
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script id="strategy-order-campaign-pixel" src={probeSrc('campaign-pixel')} />
    </>
  )
}
