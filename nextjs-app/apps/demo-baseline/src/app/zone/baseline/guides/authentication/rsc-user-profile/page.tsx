import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RscUserProfileDemo } from './components/RscUserProfileDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"서버 컴포넌트(RSC) 내 안전한 회원 프로필 조회"}
        concept={"클라이언트 노출 위험이 있는 localStorage 대신 서버 컴포넌트에서 cookies()를 직접 읽어 DB에서 VIP 회원 정보(적립금 15,200 P, 쿠폰 3장)를 0 KB 클라이언트 번들로 안전하게 렌더링합니다."}
        steps={[
          {
            step: 1,
            title: "서버 렌더링 회원명(홍길동 VIP) 및 적립금(15,200 P) 확인",
            description: "서버 사이드에서 쿠키를 검증하여 즉시 생성된 사용자 프로필 데이터를 확인합니다.",
            actionBadge: "RSC 프로필 확인",
          },
          {
            step: 2,
            title: "클라이언트 JS 번들 내 민감 개인정보 배제 상태 검사",
            description: "회원 정보 조회 로직이 클라이언트 번들에 노출되지 않는 보안성을 점검합니다.",
            actionBadge: "보안성 점검",
          },
          {
            step: 3,
            title: "쿠폰(3장) 및 등급 혜택의 100% 서버 사이드 렌더링 관찰",
            description: "하이드레이션 지연 없이 첫 HTML 응답에 개인화 데이터가 완벽히 포함되는지 검증합니다.",
            actionBadge: "프로필 렌더링 검증",
            observe: "RSC 서버 사이드 렌더링을 통한 회원 정보(홍길동 VIP, 15,200 P, 쿠폰 3장) 무결성 렌더링 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Server Component 세션 프로필 렌더링 실습"}>
        <RscUserProfileDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
