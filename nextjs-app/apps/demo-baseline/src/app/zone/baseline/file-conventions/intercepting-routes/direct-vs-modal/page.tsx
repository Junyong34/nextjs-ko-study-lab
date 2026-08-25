import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InterceptingDirectVsModalDemo } from './components/InterceptingDirectVsModalDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="가로채기 라우트 직접 URL 접근 vs 모달 대조"
        concept="피드 내 클릭 시에는 (.)photos/[id]가 모달로 가로채어 열리고, URL을 복사하여 새 탭에서 직접 열거나 새로고침 시에는 photos/[id]/page.tsx 전체 화면(200 OK)으로 렌더링됩니다."
        steps={[
          {
            step: 1,
            title: "[소프트 네비게이션 (모달 가로채기)] 버튼 클릭",
            description: "상품 피드에서 상세 링크를 클릭하여 모달 가로채기(.) 라우트를 실행하고 피드 컨텍스트를 유지합니다.",
            actionBadge: "모달 가로채기",
          },
          {
            step: 2,
            title: "[하드 네비게이션 (새로고침/직접 진입)] 버튼 클릭",
            description: "브라우저 주소창에 직접 URL을 입력하여 독립 전체 페이지 렌더링을 유도합니다.",
            actionBadge: "단독 페이지",
          },
          {
            step: 3,
            title: "진입 방식별 렌더링 결과 대조 관찰",
            description: "동일한 URL 경로(/photos/101)가 진입 방식(소프트 vs 하드)에 따라 모달 또는 독립 페이지로 분기되는 것을 확인합니다.",
            actionBadge: "결과 대조",
            observe: "동일한 URL에 대해 클라이언트 내비게이션은 모달 오버레이로, 직접 접근은 단독 전체 페이지로 분기 렌더링됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="직접 진입 vs 모달 대조 (Intercepting Routes) 실습">
        <InterceptingDirectVsModalDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
