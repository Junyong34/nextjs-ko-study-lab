import { SlotShell } from '../components/SlotShell'
import { METRICS_TABS } from '../lib/constants'

// default.tsx는 슬롯 layout.tsx로 감싸지지 않으므로 같은 셸을 직접 그린다.
export default function Default() {
  return (
    <SlotShell slot="metrics" title="@metrics" tabs={METRICS_TABS}>
      <div data-screen="default">
        <p className="font-bold text-amber-600 dark:text-amber-400">@metrics/default.tsx</p>
        <p className="mt-1 text-zinc-500">현재 URL과 맞는 @metrics 화면이 없어 기본 화면을 표시합니다.</p>
      </div>
    </SlotShell>
  )
}
