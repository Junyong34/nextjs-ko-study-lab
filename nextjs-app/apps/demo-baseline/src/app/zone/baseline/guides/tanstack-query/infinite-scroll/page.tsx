import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TanstackQueryDemo } from './components/TanstackQueryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"TanStack Query useInfiniteQuery 무한 스크롤"}
        concept={"TanStack Query의 useInfiniteQuery 훅과 getNextPageParam 커서를 활용하여 상품 목록 페이지(3개 단위, 총 9개)를 연속 fetch하고 캐시된 이전 페이지 데이터를 보존하면서 리스트를 확장합니다."}
        steps={[
          {
            step: 1,
            title: "초기 1페이지 상품 3건 로드 상태 확인",
            description: "초기 쿼리가 완료되어 첫 번째 페이지 상품 목록과 커서 위치를 확인합니다.",
            actionBadge: "초기 목록 확인",
          },
          {
            step: 2,
            title: "[+ 다음 페이지 로드] 버튼 클릭",
            description: "fetchNextPage()를 호출하여 다음 페이지 상품 3건을 비동기 패칭합니다.",
            actionBadge: "다음 페이지 패치",
          },
          {
            step: 3,
            title: "누적 상품 목록(총 6건, 9건) 및 커서 페이지네이션 관찰",
            description: "이전 페이지의 스크롤 상태가 유지된 채 새 아이템이 하단에 누적 렌더링되는지 검증합니다.",
            actionBadge: "목록 확장 검증",
            observe: "+ 다음 페이지 로드 클릭 시 상품 목록이 3개 단위로 확장 누적되는 무한 스크롤 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"TanStack Query useInfiniteQuery 상품 목록 무한 스크롤 실습"}>
        <TanstackQueryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
