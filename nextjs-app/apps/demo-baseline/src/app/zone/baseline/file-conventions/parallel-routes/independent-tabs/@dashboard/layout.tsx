import type { ReactNode } from 'react'
import { SlotShell } from '../components/SlotShell'
import { DASHBOARD_TABS } from '../lib/constants'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SlotShell slot="dashboard" title="@dashboard" tabs={DASHBOARD_TABS}>{children}</SlotShell>
}
