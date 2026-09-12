import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-groups/group-url-isolation')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouteGroupIsolationDemo } from './components/RouteGroupIsolationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"(group) 라우트 그룹 — 폴더명은 URL에 나타나지 않는다"}
        concept={"디스크상 폴더 경로는 (shop)/products/page.tsx와 (marketing)/about/page.tsx이지만, `layout.tsx`가 적용되는 범위만 나눌 뿐 URL 세그먼트에는 전혀 반영되지 않아 실제 요청 경로는 /products, /about으로 끝난다."}
        steps={[
          {
            step: 1,
            title: "[(shop)/products 페이지로 이동 →] 클릭",
            description: "폴더 경로에는 (shop)이 있지만, 이동 후 3단 검증 패널의 usePathname() 값에는 (shop) 문자열이 없는지 확인합니다.",
            actionBadge: "(shop) 이동",
          },
          {
            step: 2,
            title: "[(marketing)/about 페이지로 이동 →] 클릭",
            description: "이번에는 (marketing) 폴더로 이동합니다. 그룹 이름이 바뀌어도 URL에서 괄호 폴더명이 생략된다는 규칙은 동일하게 적용됩니다.",
            actionBadge: "(marketing) 이동",
          },
          {
            step: 3,
            title: "[홈으로 복귀] 클릭",
            description: "최상위 인덱스로 돌아와, 두 그룹 폴더를 오가는 동안 URL 세그먼트 개수가 한 번도 늘어나지 않았음을 정리합니다.",
            actionBadge: "홈 복귀",
            observe: "usePathname()이 반환한 실제 문자열에 (shop) / (marketing) 괄호 폴더명이 한 번도 포함되지 않았는지",
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
