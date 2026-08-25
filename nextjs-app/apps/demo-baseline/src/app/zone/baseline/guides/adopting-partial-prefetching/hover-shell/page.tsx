import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PartialPrefetchDemo } from './components/PartialPrefetchDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"PPR 부분 프리페칭 및 호버 시점 정적 셸 로딩"}
        concept={"Partial Prerendering(PPR) 환경에서 링크에 마우스를 올렸을 때 정적 셸(0ms)만 먼저 프리페치하고, 실제 클릭 시점에 동적 데이터를 스트리밍 결합하여 대역폭을 최적화합니다."}
        steps={[
          {
            step: 1,
            title: "[상품 링크]에 마우스 호버하여 부분 프리페치 트리거",
            description: "링크 호버 이벤트를 발생시켜 정적 레이아웃 셸만 선택적으로 프리페치합니다.",
            actionBadge: "호버 프리페치",
          },
          {
            step: 2,
            title: "정적 셸 프리페치 데이터 크기(저용량) 확인",
            description: "동적 데이터 제외로 인해 불필요한 네트워크 대역폭 소모가 방지되는 것을 확인합니다.",
            actionBadge: "대역폭 절감 확인",
          },
          {
            step: 3,
            title: "링크 클릭 시 0ms 셸 즉각 표시 및 동적 데이터 스트리밍 관찰",
            description: "네비게이션 즉시 정적 셸이 뜨고 동적 블록이 백그라운드에서 스트리밍 합체되는 과정을 검증합니다.",
            actionBadge: "PPR 내비게이션 검증",
            observe: "호버 시점 정적 셸 프리페치 완료 및 클릭 시 0ms 즉각 화면 전환 후 동적 청크 결합 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"링크 호버 시 정적 셸만 사전 패칭 (Partial Prefetching) 실습"}>
        <PartialPrefetchDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
