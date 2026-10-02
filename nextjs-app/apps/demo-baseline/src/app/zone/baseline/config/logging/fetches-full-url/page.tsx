import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { fetchCatalog } from './lib/fetchCatalog'
import { FetchLoggingLab } from './components/FetchLoggingLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/logging/fetches-full-url')

export default async function DemoPage() {
  // 서버 컴포넌트 렌더 중의 fetch가 logging.fetches의 대상이다. headers()를 읽으므로 요청마다 렌더된다.
  const latest = await fetchCatalog()
  return <FetchLoggingLab latest={latest} />
}
