import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { SlowCatalog } from '../components/SlowCatalog'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/loading-skeleton/without-loading')

// 이 폴더에는 loading.tsx가 없다 — 서버 대기가 끝날 때까지 이전 화면이 그대로 유지된다.
export default function WithoutLoadingPage() {
  return <SlowCatalog variant="without-loading" />
}
