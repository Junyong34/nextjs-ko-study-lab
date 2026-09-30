import type { ReactNode } from 'react'
import { SlotShell } from '../components/SlotShell'
import { METRICS_TABS } from '../lib/constants'

export default function MetricsLayout({ children }: { children: ReactNode }) {
  return <SlotShell slot="metrics" title="@metrics" tabs={METRICS_TABS}>{children}</SlotShell>
}
