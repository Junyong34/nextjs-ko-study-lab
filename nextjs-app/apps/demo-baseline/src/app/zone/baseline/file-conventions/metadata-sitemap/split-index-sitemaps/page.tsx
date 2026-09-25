import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/metadata-sitemap/split-index-sitemaps')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import {
  DEMO_PATH,
  SEARCH_ENGINE_URL_LIMIT,
  TOTAL_PRODUCTS,
  URLS_PER_SITEMAP,
  getSitemapCount,
} from './catalog'
import { SitemapProbeConsole } from './components/SitemapProbeConsole'
import type { SitemapPlan } from './types'

export default function DemoPage() {
  // sitemap.ts의 generateSitemaps()와 같은 계산으로 기대값을 만든다. 실제값은 브라우저가 XML을 받아 센다.
  const plan: SitemapPlan = {
    demoPath: DEMO_PATH,
    totalProducts: TOTAL_PRODUCTS,
    urlsPerSitemap: URLS_PER_SITEMAP,
    searchEngineLimit: SEARCH_ENGINE_URL_LIMIT,
    sitemapCount: getSitemapCount(),
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="generateSitemaps 대규모 인덱스 분할"
        concept="이 세그먼트의 sitemap.ts가 generateSitemaps()로 id 목록을 반환하면 Next.js가 id마다 sitemap/[id].xml을 만든다. 상품 3,500개가 파일당 1,000개씩 4개 XML로 나뉘는지, 그리고 인덱스(<sitemapindex>)는 자동으로 생기지 않는다는 점을 실제 응답으로 확인한다."
        steps={[
          {
            step: 1,
            title: '[실제 sitemap XML 요청] 클릭',
            description:
              'sitemap/0.xml ~ sitemap/3.xml을 실제로 요청하고 DOMParser로 <url> 개수와 첫/끝 <loc>를 셉니다. 마지막 파일만 500개인지, SKU가 파일 경계에서 끊김 없이 이어지는지 봅니다.',
            actionBadge: '분할 파일',
          },
          {
            step: 2,
            title: '대조 요청 3건 확인',
            description:
              '없는 id(sitemap/4.xml), 세그먼트의 sitemap.xml, 직접 작성한 sitemap-index.xml Route Handler 응답을 함께 비교합니다.',
            actionBadge: '404 / 인덱스',
            observe: '3단 검증 패널에서 파일별 기대 개수·SKU 범위와 실측값 대조',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="sitemap.ts + generateSitemaps() → 실제 sitemap/[id].xml 응답">
        <SitemapProbeConsole plan={plan} />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
