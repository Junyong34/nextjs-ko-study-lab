import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SegmentRevalidateDemo } from './components/SegmentRevalidateDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"라우트 세그먼트 레벨 revalidate 설정"}
        concept={"페이지 세그먼트 상단에 export const revalidate = 30을 선언하여 해당 라우트의 모든 하위 fetch 요청의 기본 캐시 유효 시간을 30초로 일괄 지정합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "[러닝화 (#001)] 상품 선택",
                    "description": "1번 상품 카드를 선택하여 해당 세그먼트의 캐시 상태를 확인합니다.",
                    "actionBadge": "상품 1 선택"
          },
          {
                    "step": 2,
                    "title": "[윈드브레이커 (#002)] 상품 선택",
                    "description": "2번 상품 카드를 선택하여 독립된 세그먼트 캐시 상태를 대조합니다.",
                    "actionBadge": "상품 2 선택"
          },
          {
                    "step": 3,
                    "title": "[+], [-] 수량 변경 조작",
                    "description": "수량을 변경하여 세그먼트별 데이터 갱신을 트리거합니다.",
                    "actionBadge": "수량 변경"
          },
          {
                    "step": 4,
                    "title": "세그먼트별 독립 캐시 유효기간 및 재검증 관찰",
                    "description": "각 상품 세그먼트가 독립적인 revalidate 주기를 유지하며 갱신되는지 관찰합니다.",
                    "actionBadge": "세그먼트 캐시 관찰",
                    "observe": "각 세그먼트별로 독립된 revalidate 수명 주기가 적용되어 변경된 세그먼트만 선별 갱신됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Route Segment revalidate 설정 실습"}>
        <SegmentRevalidateDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
