import { cacheLife, cacheTag } from 'next/cache'

export async function getSwrFlowSnapshot() {
  'use cache'
  cacheTag('guides-how-revalidation-works-swr-flow:snapshot')
  cacheLife({ stale: 8, revalidate: 8, expire: 60 })

  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }),
  }
}
