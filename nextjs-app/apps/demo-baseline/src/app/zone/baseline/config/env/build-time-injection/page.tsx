import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/env/build-time-injection')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigEnvInjectionDemo } from './components/ConfigEnvInjectionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="env 필드를 통한 빌드 타임 환경변수 주입"
        concept="next.config.ts의 env 객체는 빌드 시점에 process.env.KEY 참조를 정적 문자열로 직접 치환(Inlining)하여 클라이언트 및 서버 번들에 일괄 주입하므로 시크릿 키는 절대 선언해서는 안 됩니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "빌드 타임 환경변수가 주입된 컴포넌트를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "next.config.ts env 필드를 통해 컴파일 타임에 인라인 치환된 상수를 호출합니다.",
            actionBadge: "환경변수 호출",
          },
          {
            step: 3,
            title: "빌드 타임 인라인 주입 결과 및 보안 원칙 관찰",
            description: "클라이언트 번들에 공개 상수가 정상 주입되고 시크릿이 분리되었는지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "next.config.ts env 설정으로 정의된 공개 상수가 번들에 빌드 타임 인라인 주입됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"env 필드를 통한 빌드 타임 환경변수 주입 실습"}>
        <ConfigEnvInjectionDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
