import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/third-party-libraries/youtube-embed')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ThirdPartyYoutubeDemo } from './components/ThirdPartyYoutubeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"@next/third-parties YouTube 라이트 임베드(0 KB 초기 다운로드)"}
        concept={"<YouTubeEmbed videoid=\"...\" />를 활용하여 무거운 iframe 대신 포스터 이미지를 먼저 노출(0 KB 초기 JS)하고, 사용자가 재생 버튼을 누를 때만 YouTube 플레이어를 로드합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "YouTube 라이트 플레이어 썸네일 포스터 확인 및 재생 버튼 클릭으로 비디오 로드 트리거",
                    "description": "무거운 500 KB+ iframe 대신 20 KB 가벼운 이미지 포스터가 렌더링된 상태를 확인합니다. 클릭 시점에 실제 YouTube iframe 청크를 온디맨드로 주입합니다.",
                    "actionBadge": "포스터 점검"
          },
          {
                    "step": 2,
                    "title": "온디맨드 iframe 주입 및 0 KB 초기 JS 절감 관찰",
                    "description": "초기 페이지 로딩 속도(LCP) 저하 없이 필요 시점에만 동영상이 스트리밍되는지 검증합니다.",
                    "actionBadge": "임베드 검증",
                    "observe": "YouTube 라이트 플레이어의 0 KB 초기 번들 유지 및 사용자 클릭 시점 온디맨드 iframe 마운트 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"@next/third-parties YouTube 최적화 임베드 실습"}>
        <ThirdPartyYoutubeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
