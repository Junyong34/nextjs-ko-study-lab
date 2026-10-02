import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/third-party-libraries/youtube-embed')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { YoutubeLab } from './components/YoutubeLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="@next/third-parties YouTubeEmbed가 클릭 전까지 플레이어를 늦추는지 실측"
        concept="<YouTubeEmbed />는 lite-youtube-embed로 썸네일과 재생 버튼(facade)만 먼저 그리고, 클릭한 순간에 YouTube iframe을 붙입니다. 일반 iframe은 재생하지 않아도 배치 즉시 플레이어를 불러옵니다."
        steps={[
          {
            step: 1,
            title: "[라이트 임베드 배치] 클릭",
            description: "<YouTubeEmbed videoid=\"ogfYd705cRs\" />를 렌더합니다. lite-yt-embed.js가 유휴 시점에 로드되어 썸네일과 재생 버튼이 나타납니다.",
            actionBadge: "facade 확인",
            observe: "iframe 0개, 플레이어 요청 0건이고 외부 요청은 cdn.jsdelivr.net·i.ytimg.com뿐입니다.",
            observeAt: "playground",
          },
          {
            step: 2,
            title: "썸네일(재생 버튼) 클릭",
            description: "클릭 순간의 iframe 수와 요청 수를 고정한 뒤, lite-youtube가 youtube-nocookie.com iframe을 붙입니다.",
            actionBadge: "iframe 생성",
            observe: "클릭 후 iframe 1개와 youtube-nocookie.com 요청이 생기고 검증 패널이 검증 완료로 바뀝니다. Network 탭에서 플레이어 JS가 이때부터 내려오는 것도 볼 수 있습니다.",
            observeAt: "verification",
          },
          {
            step: 3,
            title: "[일반 iframe 배치]로 대조군 비교",
            description: "같은 영상을 일반 <iframe>으로 넣어 클릭 없이도 플레이어 문서를 요청하는지 봅니다. [둘 다 제거]로 처음 상태로 돌아갑니다.",
            actionBadge: "대조군",
            observe: "배치 즉시 iframe 1개와 www.youtube.com/embed 요청이 관측됩니다. 외부 접속이 막힌 환경이면 단계 1이 판정 불가로 표시됩니다.",
            observeAt: "playground",
          },
        ]}
      />
      <YoutubeLab />
    </DemoContainer>
  )
}
