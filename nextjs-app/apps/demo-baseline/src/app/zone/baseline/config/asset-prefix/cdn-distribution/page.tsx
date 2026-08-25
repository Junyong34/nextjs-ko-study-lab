import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigAssetPrefixDemo } from './components/ConfigAssetPrefixDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="assetPrefix: 'https://cdn.shop.com' CDN 자산 배포"
        concept="next.config.ts의 assetPrefix: 'https://cdn.shop.com' 설정을 통해 모든 정적 번들 JS, CSS, 이미지 URL을 전용 CDN 오리진으로 자동 분기합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "CDN 정적 자산 로딩을 확인할 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "assetPrefix가 적용된 정적 자산 및 스크립트 번들 호출을 실행합니다.",
            actionBadge: "자산 호출",
          },
          {
            step: 3,
            title: "CDN URL 프리픽스 분기 및 도메인 로그 관찰",
            description: "정적 자산 요청 경로가 CDN 호스트명으로 치환되어 전송되는지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "모든 정적 에셋 URL에 assetPrefix CDN 오리진이 정상 부여되어 로깅됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"assetPrefix: 'https://cdn.shop.com' CDN 자산 배포 실습"}>
        <ConfigAssetPrefixDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
