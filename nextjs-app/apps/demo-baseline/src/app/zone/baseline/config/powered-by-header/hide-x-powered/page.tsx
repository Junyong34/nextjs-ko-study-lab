import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigPoweredByDemo } from './components/ConfigPoweredByDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="poweredByHeader: false 서버 정보 은닉 보안"
        concept="next.config.ts의 poweredByHeader: false 설정을 통해 HTTP 응답 헤더에서 X-Powered-By: Next.js를 완전히 제거하여 서버 기술 스택 정보 노출을 차단합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "헤더 은닉이 적용된 엔드포인트를 선택합니다.",
            actionBadge: "엔드포인트 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "poweredByHeader 비활성화 설정이 적용된 응답을 요청합니다.",
            actionBadge: "요청 실행",
          },
          {
            step: 3,
            title: "X-Powered-By 헤더 제거 및 정보 은닉 관찰",
            description: "응답 헤더에 프레임워크 식별 정보가 노출되지 않고 안전하게 은닉되었는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "poweredByHeader: false 설정에 따라 X-Powered-By 응답 헤더가 완전히 제거됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"poweredByHeader: false 서버 정보 은닉 보안 실습"}>
        <ConfigPoweredByDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
