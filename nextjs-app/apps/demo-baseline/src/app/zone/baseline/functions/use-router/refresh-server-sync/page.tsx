import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseRouterRefreshDemo } from './components/UseRouterRefreshDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="router.refresh() 서버 데이터 강제 재검증 동기화"
        concept="router.refresh()를 호출하여 클라이언트 React state(입력 폼/스크롤)를 100% 보존한 채 현재 라우트의 서버 컴포넌트 페칭을 강제 재트리거하고 동기화합니다."
        steps={[
          {
            step: 1,
            title: "[router.refresh() 실행] 버튼 클릭",
            description: "router.refresh()를 실행하여 클라이언트 React state를 보존한 채 서버 컴포넌트 데이터를 다시 요청합니다.",
            actionBadge: "RSC 갱신",
          },
          {
            step: 2,
            title: "RSC 서버 동기화 횟수 카운터 및 상태 보존 관찰",
            description: "화면 깜빡임 없이 'RSC 서버 동기화 횟수'가 1회 증가하며 클라이언트 상태가 유지되는지 확인합니다.",
            actionBadge: "동기화 검증",
            observe: "RSC 서버 동기화 횟수가 1회씩 증가하고 클라이언트 상태 유실 없이 서버 최신 데이터가 반영됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"router.refresh() 서버 데이터 강제 재검증 동기화 실습"}>
        <UseRouterRefreshDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
