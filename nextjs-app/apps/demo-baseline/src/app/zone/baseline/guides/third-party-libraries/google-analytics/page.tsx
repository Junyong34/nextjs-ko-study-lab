import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/third-party-libraries/google-analytics')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { GaLab } from './components/GaLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="@next/third-parties GoogleAnalytics가 만드는 스크립트와 sendGAEvent의 dataLayer push 실측"
        concept="<GoogleAnalytics gaId />는 하이드레이션 뒤(afterInteractive) gtag.js를 붙이고 dataLayer·gtag를 초기화합니다. sendGAEvent는 그 dataLayer에 push만 하므로, 외부 스크립트가 실패해도 push 자체는 확인할 수 있습니다."
        steps={[
          {
            step: 1,
            title: "[장바구니 담기: sendGAEvent(…) (렌더 전 호출)] 먼저 클릭",
            description: "GoogleAnalytics가 아직 렌더되지 않은 상태에서 호출합니다. 진입 시 GA 호스트 요청이 0건인 것도 함께 확인합니다.",
            actionBadge: "실패 사례",
            observe: "dataLayer가 없고 push 0건, 검증 패널은 불일치, 콘솔에 'GA has not been initialized' 경고가 남습니다.",
            observeAt: "verification",
          },
          {
            step: 2,
            title: '[<GoogleAnalytics gaId="G-DEMO000000" /> 렌더] 클릭',
            description: "데모용 측정 ID로 컴포넌트를 렌더합니다. 이때부터 googletagmanager.com 요청이 나갑니다(collect 전송은 opt-out으로 차단).",
            actionBadge: "렌더",
            observe: "_next-ga-init·_next-ga 스크립트 태그, data-nscript=afterInteractive, typeof window.gtag가 function, dataLayer 명령 [js, config]가 표시됩니다. Network 탭에서 gtag/js 요청도 볼 수 있습니다.",
            observeAt: "playground",
          },
          {
            step: 3,
            title: "[장바구니 담기: sendGAEvent(…)] 다시 클릭",
            description: "렌더 후 같은 함수를 호출해 dataLayer 길이 증가분과 push된 항목을 확인합니다. 처음부터 다시 하려면 [새로고침으로 초기화]를 누릅니다.",
            actionBadge: "push 검증",
            observe: "dataLayer 길이 +1, ['event', 'demo_add_to_cart', {…}] 항목, collect 요청 0건으로 검증 패널이 검증 완료로 바뀝니다.",
            observeAt: "verification",
          },
        ]}
      />
      <GaLab />
    </DemoContainer>
  )
}
