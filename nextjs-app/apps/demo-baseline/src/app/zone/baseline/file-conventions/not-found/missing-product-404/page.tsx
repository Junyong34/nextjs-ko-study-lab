import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NotFoundDemo } from './components/NotFoundDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"not-found.tsx 404 바운더리 및 UI 복원"}
        concept={"존재하지 않는 상품 ID(PROD-999) 진입 시 notFound()가 호출되어 가장 가까운 not-found.tsx를 마운트하고 404 상태 코드를 반환합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "[/items/PROD-101 진입 →] 클릭",
                    "description": "존재하는 정상 상품 페이지(PROD-101)로 이동하여 200 OK 렌더링을 확인합니다.",
                    "actionBadge": "정상 상품 진입"
          },
          {
                    "step": 2,
                    "title": "[/items/PROD-999 진입 (404 확인) →] 클릭",
                    "description": "존재하지 않는 상품 ID로 접근하여 서버에서 notFound()가 호출되도록 유도합니다.",
                    "actionBadge": "404 유도"
          },
          {
                    "step": 3,
                    "title": "[← 상품 목록으로 돌아가기], [← 목록으로 복귀] 클릭",
                    "description": "404 화면에서 복귀 링크를 클릭하여 이전 카탈로그 목록으로 안전하게 복귀합니다.",
                    "actionBadge": "목록 복귀"
          },
          {
                    "step": 4,
                    "title": "404 Not Found 전용 UI 렌더링 및 상태 코드 관찰",
                    "description": "not-found.tsx가 상위 레이아웃을 유지한 채 404 전용 화면을 렌더링하고 상태 코드를 반환하는지 관찰합니다.",
                    "actionBadge": "404 격리 관찰",
                    "observe": "notFound() 호출 시 상위 레이아웃은 유지된 채 not-found.tsx 컴포넌트가 404 상태로 렌더링됨",
                    "observeAt": "playground"
          }
]}
        />
      <DemoPlaygroundCard title={"not-found.tsx 및 notFound() 프로그래밍 404 트리거 실습"}>
        <NotFoundDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
