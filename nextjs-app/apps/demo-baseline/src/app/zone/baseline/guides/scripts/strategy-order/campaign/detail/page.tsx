import React from 'react'
import { DemoContainer, DemoPlaygroundCard } from '@study/demo-kit'
import { SubRouteProbe } from '../../components/SubRouteProbe'

/** campaign 아래 한 단계 더 깊은 하위 라우트. 같은 campaign layout을 공유하므로 campaign-pixel은 다시 실행되지 않아야 한다. */
export default function CampaignDetailPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoPlaygroundCard title="campaign/detail (같은 layout을 공유하는 하위 라우트)">
        <SubRouteProbe note="campaign → campaign/detail 이동은 campaign layout을 유지하므로 campaign-pixel 실행 횟수가 그대로여야 합니다." />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
