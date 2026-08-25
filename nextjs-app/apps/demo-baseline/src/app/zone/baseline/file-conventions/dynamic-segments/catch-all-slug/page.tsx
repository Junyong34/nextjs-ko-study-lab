import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CatchAllSlugDemo } from './components/CatchAllSlugDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"[...slug] 포괄적 동적 세그먼트 (Catch-all)"}
        concept={"shop/[...slug]/page.tsx는 1단계(/shop/fashion)부터 3단계(/shop/fashion/shoes/running)까지 임의 깊이의 중첩 경로를 slug 배열로 일괄 캡처합니다."}
        steps={[
        {
        "step": 1,
        "title": "[/shop/fashion (1단계)] 클릭",
        "description": "1단계 깊이 경로로 진입하여 params.slug가 ['fashion'] 배열로 주입되는 것을 확인합니다.",
        "actionBadge": "1단계 slug"
        },
        {
        "step": 2,
        "title": "[/shop/fashion/shoes/running (3단계)] 클릭",
        "description": "3단계 깊이 경로로 진입하여 params.slug가 ['fashion', 'shoes', 'running']으로 확장되는 것을 확인합니다.",
        "actionBadge": "3단계 slug"
        },
        {
        "step": 3,
        "title": "[← 최상위 목록 복귀] 또는 [홈] 클릭",
        "description": "중첩된 모든 하위 경로가 단일 [...slug] 파일에서 처리되는 포괄적 매핑 원리를 검증합니다.",
        "actionBadge": "복귀",
        "observe": "URL 세그먼트 깊이에 따라 params.slug 배열 길이가 1개에서 3개로 변환되는지 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"[...slug] Catch-all 동적 세그먼트 실습"}>
        <CatchAllSlugDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
