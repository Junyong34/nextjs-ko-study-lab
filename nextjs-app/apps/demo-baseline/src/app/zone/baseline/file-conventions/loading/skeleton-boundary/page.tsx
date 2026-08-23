import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LoadingSkeletonDemo } from './components/LoadingSkeletonDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"loading.tsx 스켈레톤 UI 자동 래핑 및 Suspense"}
        concept={"slow-catalog 세그먼트에 loading.tsx를 두면 Next.js가 그 세그먼트를 Suspense로 자동 래핑합니다. 서버가 1.2초 지연 페칭을 하는 동안 빈 화면 대신 스켈레톤이 먼저 스트리밍됩니다."}
        steps={[
          {
            step: 1,
            title: "[slow-catalog 진입 (스켈레톤 관찰) →] 클릭",
            description: "force-dynamic으로 선언된 서브 라우트로 이동합니다.",
            actionBadge: "라우트 이동",
          },
          {
            step: 2,
            title: "스켈레톤 즉시 노출 확인",
            description: "getDelayedCatalog()가 1200ms 대기하는 동안 loading.tsx의 animate-pulse 카드 3개가 먼저 표시됩니다.",
            actionBadge: "1200ms 대기",
          },
          {
            step: 3,
            title: "본문 교체 및 [← 데모 홈으로 복귀]",
            description: "데이터가 준비되면 스켈레톤이 실제 상품 3건(하이드로 플로우 러닝화 등)으로 교체됩니다.",
            actionBadge: "스트리밍 완료",
            observe: "스켈레톤 → 실제 카탈로그 전환 시점과 페이지가 표시하는 서버 소요 시간(약 1200ms)이 일치하는지 대조",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"loading.tsx 스켈레톤 UI 자동 래핑 및 Suspense 실습"}>
        <LoadingSkeletonDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
