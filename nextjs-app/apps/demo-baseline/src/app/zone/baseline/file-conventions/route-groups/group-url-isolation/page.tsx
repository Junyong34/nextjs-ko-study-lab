import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouteGroupIsolationDemo } from './components/RouteGroupIsolationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Route Groups ((folder)) URL 경로 격리"}
        concept={"폴더명을 괄호로 감싸면 그 폴더는 URL 경로에서 빠집니다. (shop)/products와 (marketing)/about은 파일 트리에서는 분리돼 있지만 실제 주소는 /products, /about이 됩니다."}
        steps={[
          {
            step: 1,
            title: "[(shop)/products 진입 →] 클릭",
            description: "쇼핑 그룹의 상품 페이지로 이동합니다.",
            actionBadge: "(shop) 그룹",
          },
          {
            step: 2,
            title: "주소창에서 (shop) 누락 확인",
            description: "URL에 괄호 폴더명이 나타나지 않습니다. 그룹은 조직화 용도일 뿐 경로에 기여하지 않습니다.",
            actionBadge: "URL 격리",
          },
          {
            step: 3,
            title: "[(marketing)/about 페이지로 이동 →] 클릭",
            description: "다른 그룹으로 건너뜁니다. 두 그룹은 서로 다른 레이아웃을 가질 수 있습니다.",
            actionBadge: "그룹 전환",
            observe: "파일 경로에는 (shop)·(marketing)이 있는데 브라우저 주소에는 없는지, 그룹별로 다른 레이아웃이 적용되는지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"URL 영향 없는 라우트 그룹 분리 (route-groups) 실습"}>
        <RouteGroupIsolationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
