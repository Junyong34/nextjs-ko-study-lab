export const BASE = '/zone/baseline/file-conventions/parallel-routes/independent-tabs'
export const SNAPSHOT_KEY = 'independent-tabs:last-snapshot'
export const INTENT_KEY = 'independent-tabs:anchor-intent'

export const DASHBOARD_TABS = [
  { segment: 'summary', label: '요약 지표' },
  { segment: 'sales', label: '매출 추이' },
  { segment: 'alerts', label: '재고 알림' },
] as const

export const METRICS_TABS = [
  { segment: '24h', label: '일간 (24h)' },
  { segment: '7d', label: '주간 (7d)' },
  { segment: '30d', label: '월간 (30d)' },
] as const

export type SlotName = 'dashboard' | 'metrics'
export const SLOT_SEGMENTS: Record<SlotName, readonly string[]> = {
  dashboard: DASHBOARD_TABS.map(t => t.segment),
  metrics: METRICS_TABS.map(t => t.segment),
}
