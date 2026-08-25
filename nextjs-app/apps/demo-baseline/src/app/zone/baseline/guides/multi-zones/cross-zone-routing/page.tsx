import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MultiZonesDemo } from './components/MultiZonesDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Multi-zones 마이크로 프론트엔드 rewrites 크로스 라우팅"}
        concept={"독립 배포되는 메인 셸 앱(nextjs-app)과 하위 존 앱(demo-cache-components) 간을 next.config.ts의 rewrites() 규칙으로 연결하여 사용자에게 단일 통합 서비스 경험을 제공합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "존(Zone) 분기 규칙이 설정된 멀티 존 라우팅 환경에서 품목을 선택합니다.",
            actionBadge: "품목 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조작으로 크로스 존 요청 준비",
            description: "서로 다른 Next.js 앱 간 데이터 전달 파라미터를 구성합니다.",
            actionBadge: "수량 설정",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 존 간 프록시 통신 실행",
            description: "메인 셸에서 하위 존 백엔드로의 rewrites 프록시 요청을 전송합니다.",
            actionBadge: "존 통신 실행",
          },
          {
            step: 4,
            title: "크로스 존 리라이트 및 독립 빌드 앱 간 통합 렌더링 관찰",
            description: "도메인은 유지된 채 백그라운드에서 별도 배포 앱의 응답이 결합되는 Multi-zones 구조를 검증합니다.",
            actionBadge: "멀티존 검증",
            observe: "next.config.ts rewrites를 통한 마이크로 프론트엔드 존 간 seamless 라우팅 및 로그 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"셸에서 존으로의 rewrites 라우팅 (Multi-zones) 실습"}>
        <MultiZonesDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
