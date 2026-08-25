import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SwrMutationDemo } from './components/SwrMutationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"SWR 낙관적 업데이트(Optimistic UI) 및 롤백"}
        concept={"useSWR mutate()의 optimisticData 옵션을 사용하여 서버 통신(800ms) 대기 없이 UI 수량을 0ms로 즉시 갱신하고, 서버 에러 발생 시 rollbackOnError로 이전 상태를 자동 복원합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "[+1 증가 (mutate 즉시 반영)] 클릭",
                    "description": "수량 증가 버튼을 눌러 SWR mutate를 즉시 트리거합니다.",
                    "actionBadge": "낙관적 증가"
          },
          {
                    "step": 2,
                    "title": "[-1 감소] 클릭",
                    "description": "수량 감소 버튼을 눌러 로컬 캐시를 0ms 즉각 차감합니다.",
                    "actionBadge": "낙관적 감소"
          },
          {
                    "step": 3,
                    "title": "백그라운드 서버 API 통신 및 동기화 대기",
                    "description": "로컬 캐시 선반영 후 백그라운드 PATCH API가 완료될 때까지 대기합니다.",
                    "actionBadge": "서버 동기화"
          },
          {
                    "step": 4,
                    "title": "낙관적 UI 반영 및 최종 서버 상태 동기화 관찰",
                    "description": "네트워크 지연 중에도 0ms 즉각 반응하고 통신 완료 후 확정 데이터로 전환되는지 관찰합니다.",
                    "actionBadge": "결과 관찰",
                    "observe": "SWR optimisticData에 의해 0ms로 UI가 갱신되고 서버 응답 후 최종 상태로 확정됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"SWR mutate()를 활용한 낙관적 장바구니 갱신 실습"}>
        <SwrMutationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
