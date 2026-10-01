import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { CacheLifePresetsLab } from './components/CacheLifePresetsLab'

export const metadata: Metadata = getDemoMetadata('cache', 'config/cache-life/custom-presets')

// 페이지 자체는 정적 셸이다. 캐시 수명 측정은 브라우저가 probe Route Handler를 호출해 수행한다.
export default function DemoPage() {
  return <CacheLifePresetsLab />
}
