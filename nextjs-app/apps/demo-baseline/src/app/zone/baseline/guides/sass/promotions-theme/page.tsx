import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SassThemeDemo } from './components/SassThemeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Sass(SCSS) 모듈을 활용한 프로모션 테마 스타일링"}
        concept={"Sass CSS Modules(.module.scss)의 변수, 믹스인, 중첩 규칙을 활용하여 클래스 이름 충돌 없는 프로모션 배너 및 테마 스타일을 컴포넌트 단위로 격리 렌더링합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "SCSS 테마가 적용된 상품 카드 목록에서 대상 품목을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 주문 수량 조절",
            description: "테마 버튼 스타일을 조작하며 수량 변경 이벤트를 트리거합니다.",
            actionBadge: "수량 조절",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 테마 적용 액션 실행",
            description: "Sass 모듈로 스타일링된 알림 로그에 작업 내역을 추가합니다.",
            actionBadge: "동작 실행",
          },
          {
            step: 4,
            title: "SCSS 모듈 클래스 격리 및 반응형 테마 UI 렌더링 관찰",
            description: "컴포넌트 스코프 내에서 Sass 스타일이 다른 UI에 영향 없이 완벽히 격리 적용되는지 확인합니다.",
            actionBadge: "테마 검증",
            observe: "Sass(.module.scss) 변수 및 믹스인이 적용된 프로모션 테마 카드와 로그 동기화 렌더링 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Sass 변수/mixin 활용 프로모션 스타일링 실습"}>
        <SassThemeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
