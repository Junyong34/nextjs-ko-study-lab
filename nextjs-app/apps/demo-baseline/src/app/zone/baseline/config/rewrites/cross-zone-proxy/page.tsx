import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { CROSS_ZONE_UPSTREAM } from '@/config/demo-next-config/rewrites-cross-zone'
import { CrossZoneLab } from './components/CrossZoneLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/rewrites/cross-zone-proxy')

// /via-cache/*, /api/og 는 이 폴더가 아니라 next.config의 rewrites()가 cache zone으로 프록시한다.
// 업스트림 주소는 설정 조각과 같은 값을 그대로 보여 준다(ZONE_CACHE_URL / Related Projects).
export default function DemoPage() {
  return <CrossZoneLab upstream={CROSS_ZONE_UPSTREAM} />
}
