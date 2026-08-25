import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { IsolatedBrandingDemo } from './components/IsolatedBrandingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"테넌트별 로고 및 디자인 토큰(CSS Variables) 동적 주입"}
        concept={"서버 컴포넌트에서 테넌트 설정을 로드하여 HTML <html> 또는 최상위 래퍼에 CSS 변수(--primary-color, --logo-url)를 동적 주입하여 런타임 오버헤드 없는 화이트라벨 브랜딩을 제공합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "동적 브랜딩 토큰이 적용된 테넌트 콘솔의 카탈로그 품목을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 주문 수량 설정",
            description: "테넌트 브랜드 컬러가 입혀진 버튼으로 수량 변경 인터랙션을 실행합니다.",
            actionBadge: "수량 설정",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 테넌트 맞춤형 API 트리거",
            description: "선택된 테넌트 브랜딩 컨텍스트 하에서 주문 동기화를 실행합니다.",
            actionBadge: "동작 실행",
          },
          {
            step: 4,
            title: "테넌트 전용 로고 및 테마 토큰 격리 렌더링 관찰",
            description: "서로 다른 테넌트 간 디자인 충돌 없이 브랜드 정체성이 완벽히 분리되는지 확인합니다.",
            actionBadge: "브랜딩 검증",
            observe: "테넌트별 CSS 토큰 주입을 통한 맞춤형 테마 및 상품 액션 로그 동기화 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"테넌트별 로고/컬러 동적 주입 실습"}>
        <IsolatedBrandingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
