import React from 'react'
import { DemoContainer, DemoPlaygroundCard } from '@study/demo-kit'
import { SubRouteProbe } from '../components/SubRouteProbe'

/** strategy-order의 실제 하위 라우트. campaign/layout.tsx의 campaign-pixel이 이 세그먼트에서만 로드된다. */
export default function CampaignPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoPlaygroundCard title="campaign (세그먼트 전용 스크립트가 있는 하위 라우트)">
        <SubRouteProbe note="campaign/layout.tsx에 둔 campaign-pixel은 여기서 처음 요청·실행됩니다. 상위 layout의 layout-analytics는 다시 실행되지 않아야 합니다." />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
