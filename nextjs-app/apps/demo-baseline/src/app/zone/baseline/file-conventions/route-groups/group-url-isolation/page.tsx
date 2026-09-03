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
        title={"(group) 라우트 그룹 URL 경로 격리"}
        concept={"소괄호로 감싼 (shop)과 (marketing) 폴더는 URL 경로 구조에 영향을 주지 않으면서(URL 세그먼트 생략) 독립된 레이아웃 계층을 구성합니다."}
        steps={[
        {
        "step": 1,
        "title": "[(shop)/products 진입 →] 또는 [(shop)/products 페이지로 이동 →] 클릭",
        "description": "URL에 (shop)이 포함되지 않고 /products 경로로 깔끔하게 매핑되는 것을 확인합니다.",
        "actionBadge": "(shop) 이동"
        },
        {
        "step": 2,
        "title": "[(marketing)/about 진입 →] 또는 [(marketing)/about 페이지로 이동 →] 클릭",
        "description": "마찬가지로 (marketing)이 생략된 /about 경로로 이동하며 다른 레이아웃 테마가 적용되는 것을 확인합니다.",
        "actionBadge": "(marketing) 이동"
        },
        {
        "step": 3,
        "title": "[홈으로 복귀] 클릭",
        "description": "서로 다른 라우트 그룹 간에 URL 세그먼트 노출 없이 독립 레이아웃이 전환되는 전체 흐름을 확인합니다.",
        "actionBadge": "홈 복귀",
        "observe": "브라우저 URL 경로에서 괄호 폴더명 생략 여부와 각 라우트 그룹의 레이아웃 격리 상태 확인",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"URL 영향 없는 라우트 그룹 분리 (route-groups) 실습"}>
        <RouteGroupIsolationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
