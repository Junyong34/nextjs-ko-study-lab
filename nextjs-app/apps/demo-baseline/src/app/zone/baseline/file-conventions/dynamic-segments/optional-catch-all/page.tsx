import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/dynamic-segments/optional-catch-all')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ShopRouteNav } from './components/ShopRouteNav'
import { SlugVerificationPanel } from './components/SlugVerificationPanel'
import { OptionalCatchAllDeepDive } from './components/OptionalCatchAllDeepDive'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"[[...slug]] Optional Catch-all 다이나믹 세그먼트"}
        concept={"shop/[[...slug]]/page.tsx 하나가 세그먼트 0개인 /shop까지 받습니다. 0개면 await params의 slug는 typeof 'undefined', 1개 이상이면 Array.isArray(slug) === true인 string[]입니다."}
        steps={[
        {
        "step": 1,
        "title": "[세그먼트 0개] 이동",
        "description": "/shop으로 이동해 404 없이 같은 page가 렌더링되고, 실측 표에서 typeof slug가 'undefined', Array.isArray(slug)가 false로 찍히는지 봅니다.",
        "actionBadge": "0개 매칭"
        },
        {
        "step": 2,
        "title": "[세그먼트 1개] → [세그먼트 3개] 이동",
        "description": "/shop/clothes, /shop/clothes/tops/t-shirts로 이동하며 slug가 string[]로 바뀌고 length가 1, 3으로 늘어나는지 확인합니다.",
        "actionBadge": "string[]"
        },
        {
        "step": 3,
        "title": "[한글·공백 세그먼트] 이동",
        "description": "퍼센트 인코딩된 주소(%EC%97%AC... %20)로 이동해 slug[i]에 어떤 문자열이 들어오는지 실측 표에서 확인합니다.",
        "actionBadge": "인코딩"
        },
        {
        "step": 4,
        "title": "[실습 첫 화면으로] 복귀 후 [...slug] 형제 실습과 대조",
        "description": "개념 정리의 형제 실습 링크를 열어, 같은 /shop 경로가 필수 catch-all에서는 404가 되는 것을 실제 요청 결과로 비교합니다.",
        "actionBadge": "404 대조",
        "observe": "각 경로에서 검증 패널의 기대값(주소에서 계산)과 실제값(await params)이 일치하는지, 0개 경로에서만 slug가 undefined인지 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"shop/[[...slug]]/page.tsx로 이동"}>
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            아래 링크는 모두 같은 파일 <code className="font-mono">shop/[[...slug]]/page.tsx</code>로 연결됩니다. 이동한 뒤 서버가 실제로 받은{' '}
            <code className="font-mono">params</code> 값이 표로 표시됩니다.
          </p>
          <ShopRouteNav />
        </div>
      </DemoPlaygroundCard>
      <SlugVerificationPanel />
      <OptionalCatchAllDeepDive />
    </DemoContainer>
  )
}
