import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PermanentRedirectSeoDemo } from './components/PermanentRedirectSeoDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="permanentRedirect() 영구 URL 변경 (308 Permanent)"
        concept="permanentRedirect() 함수를 호출하여 구형 상품 URL을 신규 표준 경로로 영구 이전하고 검색엔진(SEO)에 HTTP 308 Permanent Redirect 상태를 반환합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "구형 URL 구조를 가진 레거시 상품 경로를 선택합니다.",
            actionBadge: "구형 URL 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "permanentRedirect(/shop/items/[id])를 호출하여 영구 리다이렉트를 발동합니다.",
            actionBadge: "308 실행",
          },
          {
            step: 3,
            title: "HTTP 308 영구 이동 및 검색엔진 캐싱 관찰",
            description: "브라우저와 검색엔진 봇에 308 상태 코드가 전달되어 신규 URL로 영구 매핑되는지 확인합니다.",
            actionBadge: "영구 이동 검증",
            observe: "permanentRedirect() 호출로 HTTP 308 영구 리다이렉트 헤더가 실시간 로그에 정상 기록됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"permanentRedirect() 영구 URL 변경 (308 Permanent) 실습"}>
        <PermanentRedirectSeoDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
