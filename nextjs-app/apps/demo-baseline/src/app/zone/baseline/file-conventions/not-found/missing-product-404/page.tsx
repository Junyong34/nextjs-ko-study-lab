import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NotFoundDemo } from './components/NotFoundDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"not-found.tsx 및 notFound() 프로그래밍 404 트리거"}
        concept={"items/[id]/page.tsx가 VALID_PRODUCTS에 없는 id를 받으면 notFound()를 호출합니다. 이 호출은 예외를 던져 렌더링을 중단하고, 같은 세그먼트의 not-found.tsx로 화면을 교체합니다."}
        steps={[
          {
            step: 1,
            title: "[/items/PROD-101 진입 →] 클릭",
            description: "DB에 등록된 ID라 notFound()가 호출되지 않고 상품 상세가 200 OK로 렌더링됩니다.",
            actionBadge: "정상 경로",
          },
          {
            step: 2,
            title: "[← 목록으로 복귀] 후 반대 경로 시도",
            description: "상품 목록으로 돌아와 미등록 ID 링크를 준비합니다.",
            actionBadge: "경로 복귀",
          },
          {
            step: 3,
            title: "[/items/PROD-999 진입 (404 확인) →] 클릭",
            description: "VALID_PRODUCTS 조회에 실패해 notFound()가 발동하고 items/[id]/not-found.tsx가 대신 마운트됩니다.",
            actionBadge: "notFound()",
            observe: "같은 [id] 라우트 파일이 ID 값에 따라 상품 상세와 404 화면으로 갈리는지, 그리고 404일 때 레이아웃은 유지되는지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"not-found.tsx 및 notFound() 프로그래밍 404 트리거 실습"}>
        <NotFoundDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
