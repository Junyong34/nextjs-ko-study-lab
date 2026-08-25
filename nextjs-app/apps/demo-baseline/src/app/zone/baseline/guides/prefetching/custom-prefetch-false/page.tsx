import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PrefetchFalseDemo } from './components/PrefetchFalseDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"prefetch={false} 선언을 통한 불필요한 백그라운드 프리페치 방지"}
        concept={"<Link prefetch={false}>를 명시하여 사용자가 많은 모바일 환경에서 수십 개의 링크가 동시에 뷰포트에 들어올 때 발생하는 불필요한 RSC 페이로드 다운로드를 0건으로 차단합니다."}
        steps={[
          {
            step: 1,
            title: "[prefetch=false] 모드 확인",
            description: "자동 프리페치가 비활성화된 링크 목록의 초기 네트워크 리스너 상태를 점검합니다.",
            actionBadge: "모드 확인",
          },
          {
            step: 2,
            title: "[상품 상세로 이동] 링크 위로 마우스 호버(Hover) 실행",
            description: "호버 카운터를 증가시키며 prefetch={false} 상태에서 사전 요청이 차단되는지 테스트합니다.",
            actionBadge: "호버 테스트",
          },
          {
            step: 3,
            title: "네트워크 요청 차단 및 클릭 시 온디맨드 패칭 관찰",
            description: "불필요한 백그라운드 네트워크 트래픽이 0건으로 억제되고 실제 클릭 시점에만 패칭되는지 검증합니다.",
            actionBadge: "대역폭 최적화 검증",
            observe: "prefetch={false} 적용 시 뷰포트 진입 자동 다운로드 차단 및 클릭 시점 온디맨드 패칭 동작 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"prefetch={false} 명시적 프리패치 차단 실습"}>
        <PrefetchFalseDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
