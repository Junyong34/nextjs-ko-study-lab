import { connection } from 'next/server'
import { HydrationLab } from '../components/HydrationLab'
import type { ServerRenderInfo } from '../types'

// 대조군: prefetch도 HydrationBoundary도 없다. 같은 HydrationLab이 하이드레이션 뒤 브라우저에서 api/deals를 요청한다.
export default async function ClientOnlyPage() {
  await connection()
  const info: ServerRenderInfo = {
    variant: 'client-only',
    renderId: crypto.randomUUID(),
    renderedAt: Date.now(),
    cacheSizeAtCreate: null,
    prefetchedReadNo: null,
  }
  return <HydrationLab info={info} />
}
