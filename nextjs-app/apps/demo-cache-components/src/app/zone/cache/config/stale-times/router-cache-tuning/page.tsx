import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigStaleTimesDemo } from './components/ConfigStaleTimesDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="experimental.staleTimes 클라이언트 라우터 캐시 시간 제어"
        concept="next.config.ts experimental.staleTimes.dynamic (0초~30초) 및 static (5분) 설정을 통해 브라우저 클라이언트 Router Cache의 유효 시간을 제어합니다."
        steps={[
          {
                    "step": 1,
                    "title": "staleTimes 다이나믹·정적 기본 설정 점검 및 클라이언트 뒤로가기·앞으로가기 내비게이션 검증",
                    "description": "다이나믹 라우트(0초)와 정적 라우트(300초)의 클라이언트 라우터 캐시 유지 시간을 확인합니다. staleTime 이내에 다시 방문하면 클라이언트 메모리에서 복원되는 방식을 확인합니다.",
                    "actionBadge": "설정값 점검"
          },
          {
                    "step": 2,
                    "title": "staleTime 만료 후 서버 캐시 갱신 동작 관찰",
                    "description": "staleTime이 경과한 후 서버에 다시 요청해 최신 RSC 데이터를 가져오는지 확인합니다.",
                    "actionBadge": "캐시 갱신 확인",
                    "observe": "experimental.staleTimes 설정에 따라 클라이언트 라우터 캐시의 재사용 주기가 제어됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"experimental.staleTimes 클라이언트 라우터 캐시 시간 제어 실습"}>
        <ConfigStaleTimesDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
