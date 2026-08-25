import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigImagesFormatsDemo } from './components/ConfigImagesFormatsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="images.formats: ['image/avif', 'image/webp'] 차세대 포맷"
        concept="next.config.ts images.formats에 ['image/avif', 'image/webp']를 지정하여 브라우저 지원 여부에 따라 용량을 최대 50% 절감하는 차세대 이미지로 자동 변환 서빙합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "차세대 이미지 포맷 변환 대상 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "AVIF 및 WebP 자동 변환 파이프라인을 트리거합니다.",
            actionBadge: "포맷 변환",
          },
          {
            step: 3,
            title: "AVIF/WebP 압축률 및 이미지 용량 절감 관찰",
            description: "동일 해상도 대비 용량이 대폭 절감된 차세대 이미지 변환 결과가 실시간 로그에 반영되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "images.formats 설정에 따라 원본 이미지가 AVIF/WebP 고효율 포맷으로 자동 변환됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"images.formats: ['image/avif', 'image/webp'] 차세대 포맷 실습"}>
        <ConfigImagesFormatsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
