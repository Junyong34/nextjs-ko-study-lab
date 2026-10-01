import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getDemoMetadata } from '@study/demos'
import { CrossZoneLab } from './components/CrossZoneLab'
import type { ServerSeen } from './types'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/multi-zones/cross-zone-routing')

export default async function DemoPage() {
  // 셸 rewrites를 거쳐 들어왔다면 baseline 서버가 받는 host는 zone 자신의 주소이고,
  // 학습자가 보던 셸 주소는 x-forwarded-host에 남는다.
  const h = await headers()
  const serverSeen: ServerSeen = {
    host: h.get('host'),
    forwardedHost: h.get('x-forwarded-host'),
    renderedAt: new Date().toISOString(),
  }
  return <CrossZoneLab serverSeen={serverSeen} />
}
