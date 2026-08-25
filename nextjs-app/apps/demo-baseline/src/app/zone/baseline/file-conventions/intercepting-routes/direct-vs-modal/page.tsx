import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InterceptingDirectVsModalDemo } from './components/InterceptingDirectVsModalDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"가로채기 라우트 직접 URL 접근 vs 모달 대조"}
        concept={"피드 내 클릭 시에는 (.)item/[id]가 모달로 가로채어 열리고, URL을 복사하여 새 탭에서 직접 열거나 새로고침 시에는 item/[id]/page.tsx 전체 화면(200 OK)으로 렌더링됩니다."}
        steps={[
          {
                    "step": 1,
                    "title": "피드 내 소프트 네비게이션 진입 및 직접 URL 하드 네비게이션 진입",
                    "description": "상품 피드에서 상세 링크를 클릭하여 모달 가로채기(.) 라우트를 실행합니다. 브라우저 주소창에 직접 URL을 입력하여 독립 전체 페이지 렌더링을 유도합니다.",
                    "actionBadge": "모달 가로채기"
          },
          {
                    "step": 2,
                    "title": "진입 방식별 렌더링 결과 대조",
                    "description": "동일한 URL 경로가 진입 방식(소프트 vs 하드)에 따라 모달 또는 독립 페이지로 분기되는 것을 확인합니다.",
                    "actionBadge": "결과 대조",
                    "observe": "3단 검증 패널에서 가로채기 모달과 직접 접근 페이지의 렌더링 모드 차이 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"직접 진입 vs 모달 대조 (Intercepting Routes) 실습"}>
        <InterceptingDirectVsModalDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
