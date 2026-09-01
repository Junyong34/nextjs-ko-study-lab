import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SwrFlowDemo } from './components/SwrFlowDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Cache Components SWR 백그라운드 revalidation 수명 주기"}
        concept={"Cache Components의 stale-while-revalidate 메커니즘을 통해 staleTime(5초) 경과 후 첫 요청에 Stale 캐시를 0ms 즉시 반환하고, 백그라운드 워커에서 새 데이터를 패치하여 다음 요청에 반영합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "[1단계: Stale 응답 (0ms)] 클릭",
                    "description": "캐시된 기존 Stale 데이터를 0ms 즉시 반환받아 화면에 표시합니다.",
                    "actionBadge": "Stale 응답"
          },
          {
                    "step": 2,
                    "title": "[2단계: 백그라운드 revalidation] 클릭",
                    "description": "백그라운드에서 비동기 fetch를 실행하여 최신 데이터를 조회합니다.",
                    "actionBadge": "revalidation 트리거"
          },
          {
                    "step": 3,
                    "title": "[3단계: 최신 캐시 전파] 클릭",
                    "description": "새로 수신된 데이터로 캐시 엔트리를 교체하고 UI에 반영합니다.",
                    "actionBadge": "캐시 전파"
          },
          {
                    "step": 4,
                    "title": "SWR 라이프사이클 및 타임스탬프 동기화 관찰",
                    "description": "Stale-While-Revalidate 수명 주기 동안 사용자 대기 시간 0ms와 최신 데이터 동기화 결과를 관찰합니다.",
                    "actionBadge": "SWR 완료 관찰",
                    "observe": "Stale 데이터가 0ms로 선제 반환된 후 백그라운드 revalidation으로 최신 타임스탬프가 갱신됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Stale-While-Revalidate 백그라운드 갱신 흐름 실습"}>
        <SwrFlowDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
