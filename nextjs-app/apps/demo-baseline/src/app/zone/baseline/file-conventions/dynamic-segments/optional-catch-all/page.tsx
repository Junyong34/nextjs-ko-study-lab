import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/dynamic-segments/optional-catch-all')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OptionalCatchAllDemo } from './components/OptionalCatchAllDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"[[...slug]] 선택적 포괄 세그먼트 (Optional Catch-all)"}
        concept={"docs/[[...slug]]/page.tsx는 이중 대괄호를 사용하여 파라미터가 없는 루트(/docs, slug: undefined)와 다단계 경로(/docs/routing/dynamic-routes)를 단일 파일에서 모두 처리합니다."}
        steps={[
        {
        "step": 1,
        "title": "[/docs (루트 인덱스)] 이동",
        "description": "slug 파라미터 없이 진입하여 404가 아닌 기본 개발자 문서 홈(slug: undefined)이 렌더링되는 것을 확인합니다.",
        "actionBadge": "루트 인덱스"
        },
        {
        "step": 2,
        "title": "[/docs/installation (1단계)] 이동",
        "description": "1단계 문서로 이동하여 slug: ['installation'] 배열이 정상 전달되는지 확인합니다.",
        "actionBadge": "1단계"
        },
        {
        "step": 3,
        "title": "[/docs/routing/dynamic-routes (2단계)] 이동",
        "description": "2단계 경로로 이동하여 동일한 page.tsx가 다단계 문서 뷰어로 전환되는 것을 확인합니다.",
        "actionBadge": "2단계",
        "observe": "slug가 undefined일 때(루트)와 배열일 때(다단계) 모두 404 없이 같은 page.tsx가 응답하는지 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"[[...slug]] Optional Catch-all 동적 세그먼트 실습"}>
        <OptionalCatchAllDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
