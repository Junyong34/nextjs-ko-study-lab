import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TanstackSsrDemo } from './components/TanstackSsrDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"TanStack Query 서버 사전 패칭 및 HydrationBoundary"}
        concept={"서버 컴포넌트에서 prefetchQuery()로 데이터를 사전 패칭한 후 HydrationBoundary(dehydratedState)로 직렬화 전달하여 클라이언트에서 0ms 즉각 하이드레이션을 완성합니다."}
        steps={[
          {
            step: 1,
            title: "서버 사전 패칭 데이터(0ms 하이드레이션) 확인",
            description: "클라이언트 추가 패칭 없이 서버에서 주입된 쿼리 캐시 상태(Hydration Time: 0ms)를 확인합니다.",
            actionBadge: "초기 SSR 확인",
          },
          {
            step: 2,
            title: "카테고리 탭 전환 인터랙션 실행",
            description: "클라이언트 사이드에서 카테고리 필터를 변경하여 캐시 조회 및 백그라운드 리패칭을 테스트합니다.",
            actionBadge: "클라이언트 쿼리",
          },
          {
            step: 3,
            title: "Query Client 캐시 재사용(Cache Hit) 및 깜빡임 없는 전환 관찰",
            description: "이미 서버에서 채워진 데이터는 캐시에서 즉시 반환되고 새 카테고리만 동적으로 패칭되는지 확인합니다.",
            actionBadge: "하이드레이션 검증",
            observe: "초기 0ms 하이드레이션 완료 및 카테고리 변경 시 Query Cache HIT를 통한 부드러운 렌더링 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"TanStack Query prefetchQuery와 서버 Hydration 실습"}>
        <TanstackSsrDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
