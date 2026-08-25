import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UsePathnameActiveDemo } from './components/UsePathnameActiveDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="usePathname() 기반 GNB 활성 메뉴 하이라이트"
        concept="usePathname() 훅으로 현재 브라우저 URL 경로(/shop/deals, /shop/best)를 실시간 감지하여 GNB 및 네비게이션 링크의 활성 탭 하이라이트 스타일을 동적으로 적용합니다."
        steps={[
          {
            step: 1,
            title: "[신상품 (New)] 또는 [타임특가 (Deals)] 탭 클릭",
            description: "GNB 상단의 네비게이션 링크 버튼을 클릭하여 라우트 경로를 전환합니다.",
            actionBadge: "탭 전환",
          },
          {
            step: 2,
            title: "[베스트 (Best 100)] 또는 [기획전 (Events)] 탭 전환",
            description: "usePathname() 훅이 변경된 pathname 문자열을 읽어 활성 메뉴 키를 실시간 추출합니다.",
            actionBadge: "경로 추출",
          },
          {
            step: 3,
            title: "활성 탭 하이라이트 스타일 및 뱃지 관찰",
            description: "현재 경로와 일치하는 메뉴에 파란색 강조 뱃지 및 볼드 스타일이 즉시 렌더링되는지 확인합니다.",
            actionBadge: "UI 검증",
            observe: "선택된 pathname과 일치하는 탭 버튼에 활성 테마 스타일과 녹색 펄스 뱃지가 동기화됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"usePathname() 기반 GNB 활성 메뉴 하이라이트 실습"}>
        <UsePathnameActiveDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
