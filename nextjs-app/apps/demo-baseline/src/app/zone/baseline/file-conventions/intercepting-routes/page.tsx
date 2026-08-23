import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ModalInterceptionClient } from './components/ModalInterceptionClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function InterceptingRoutesDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title={"Intercepting Routes ((.)segment) 라우트 인터셉트"}
        concept={"@modal/(.)photos/[id]/page.tsx가 같은 레벨의 /photos/[id] 경로를 가로챕니다. 갤러리에서 소프트 내비게이션으로 진입하면 모달이 뜨고, 같은 URL을 새로고침하면 가로채기가 풀려 photos/[id]/page.tsx 전체 화면이 뜹니다."}
        steps={[
          {
            step: 1,
            title: "[모달 열기 →] 클릭",
            description: "갤러리 피드에서 사진 상세로 소프트 내비게이션합니다. URL이 /photos/[id]로 바뀝니다.",
            actionBadge: "인터셉트 진입",
          },
          {
            step: 2,
            title: "모달 오버레이 확인",
            description: "URL은 상세 경로인데 화면은 갤러리 위에 얹힌 모달입니다. @modal 슬롯이 경로를 가로챈 결과입니다.",
            actionBadge: "(.) 규칙",
          },
          {
            step: 3,
            title: "같은 URL에서 새로고침",
            description: "브라우저를 새로고침하면 인터셉트가 적용되지 않아 photos/[id]/page.tsx 원본 전체 화면이 렌더링됩니다.",
            actionBadge: "하드 내비게이션",
            observe: "동일한 URL이 진입 경로에 따라 모달과 전체 페이지로 다르게 렌더링됨 — 소프트 내비게이션일 때만 (.) 인터셉트가 동작",
            observeAt: "playground",
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 상품 갤러리 & 인터셉트 상세 모달" className="space-y-4">
        <ModalInterceptionClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
