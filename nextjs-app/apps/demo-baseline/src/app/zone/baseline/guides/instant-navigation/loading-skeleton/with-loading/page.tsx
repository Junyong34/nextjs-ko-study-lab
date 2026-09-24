import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { SlowCatalog } from '../components/SlowCatalog'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/loading-skeleton/with-loading')

// 같은 폴더의 loading.tsx가 이 page를 <Suspense fallback={<Loading />}>로 자동 감싼다.
export default function WithLoadingPage() {
  return <SlowCatalog variant="with-loading" />
}
