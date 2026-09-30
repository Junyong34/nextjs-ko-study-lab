'use client'
import { DemoResetButton } from '@study/demo-kit'
import { BASE, DASHBOARD_TABS, METRICS_TABS } from '../lib/constants'

/** 비교용 일반 <a> 이동과 초기화. 슬롯 탭 자체는 각 슬롯 layout의 Link다. */
export function TabsControls() {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <a data-hard href={`${BASE}/${DASHBOARD_TABS[1].segment}`} className="rounded border px-3 py-1.5">일반 &lt;a&gt;로 매출 추이 이동 (비교용)</a>
      <a data-hard href={`${BASE}/${METRICS_TABS[2].segment}`} className="rounded border px-3 py-1.5">일반 &lt;a&gt;로 월간 이동 (비교용)</a>
      <DemoResetButton label="처음 상태로" onReset={() => window.location.assign(BASE)} />
    </div>
  )
}
