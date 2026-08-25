import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigImagesRemoteDemo } from './components/ConfigImagesRemoteDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="images.remotePatterns 외부 이미지 도메인 허용 및 보안"
        concept="next.config.ts images.remotePatterns에 신뢰할 수 있는 CDN 호스트와 프로토콜(https)을 화이트리스트로 선언하여 무분별한 외부 이미지 최적화 악용(SSRF)을 차단합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "외부 CDN 이미지 소스를 가진 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "remotePatterns 화이트리스트 검증을 통과하는 이미지 최적화 요청을 실행합니다.",
            actionBadge: "이미지 요청",
          },
          {
            step: 3,
            title: "도메인 보안 화이트리스트 검증 로그 관찰",
            description: "허용된 도메인의 에셋만 next/image 최적화 파이프라인에서 정상 처리되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "remotePatterns에 선언된 외부 도메인 이미지만 안전하게 최적화되어 서빙됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"images.remotePatterns 외부 이미지 도메인 허용 및 보안 실습"}>
        <ConfigImagesRemoteDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
