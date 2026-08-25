import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataSitemapSplitDemo } from './components/MetadataSitemapSplitDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"sitemap.ts 대규모 분할 사이트맵 인덱스"}
        concept={"50,000건 이상의 대규모 상품 URL을 generateSitemaps()를 통해 sitemap/0.xml, sitemap/1.xml 등 청크 단위로 분할 생성합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "generateSitemaps() 분할 ID 목록 확인 및 청크별 sitemap({ id }) URL 목록 생성",
                    "description": "대규모 데이터셋을 50,000개 단위 청크 ID 배열로 반환하는 분할 구조를 확인합니다. 전달받은 id에 해당하는 상품 URL, lastModified, changeFrequency 객체 배열을 생성합니다.",
                    "actionBadge": "ID 분할"
          },
          {
                    "step": 2,
                    "title": "사이트맵 인덱스 XML 응답 검증",
                    "description": "각 분할 사이트맵이 /sitemap/0.xml 경로로 표준 XML 스키마에 맞춰 렌더링되는지 검증합니다.",
                    "actionBadge": "XML 검증",
                    "observe": "3단 검증 패널에서 대규모 분할 사이트맵 인덱스 사양 및 URL 매핑 상태 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"generateSitemaps 대규모 인덱스 분할 실습"}>
        <MetadataSitemapSplitDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
