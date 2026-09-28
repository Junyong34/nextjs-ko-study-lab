import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/powered-by-header/hide-x-powered')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PoweredByPlayground } from './components/PoweredByPlayground'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="poweredByHeader: false 서버 정보 은닉 보안"
        concept="next.config.ts에 poweredByHeader: false를 설정하면(이 앱에 실제로 적용되어 있음) HTTP 응답에서 x-powered-by 헤더가 빠집니다. 기본값(설정하지 않았을 때)은 Next.js가 이 헤더를 자동으로 붙입니다."
        steps={[
          {
            step: 1,
            title: "[응답 헤더 실제로 확인하기] 클릭",
            description: "이 페이지 자신의 URL을 fetch()로 다시 요청해 실제 HTTP 응답 헤더를 읽습니다.",
            actionBadge: "실제 요청",
          },
          {
            step: 2,
            title: "x-powered-by 헤더 부재 관찰",
            description: "응답에 x-powered-by 헤더가 없는지(null) 확인합니다. next.config.ts의 poweredByHeader: false 때문입니다.",
            actionBadge: "헤더 관찰",
            observe: "x-powered-by 값이 null로 표시됨",
            observeAt: "playground",
          },
        ]}
      />
      <PoweredByPlayground />
    </DemoContainer>
  )
}
