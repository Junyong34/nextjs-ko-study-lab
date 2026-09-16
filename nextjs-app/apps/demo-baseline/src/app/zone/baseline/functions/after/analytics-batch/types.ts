export type BatchMode = 'sequential' | 'parallel'

/** batch-store.ts의 EVENT_LABELS 길이와 반드시 일치해야 한다. */
export const ANALYTICS_EVENT_COUNT = 3

export type AnalyticsEventState = 'pending' | 'running' | 'done'

export interface AnalyticsEventStatus {
  name: string
  status: AnalyticsEventState
  startedAt: number | null
  completedAt: number | null
  durationMs: number | null
}

export interface BatchStatusResponse {
  batchId: string
  mode: BatchMode
  responseReturnedAt: number
  batchStartedAt: number | null
  batchCompletedAt: number | null
  isComplete: boolean
  events: AnalyticsEventStatus[]
}

export interface RunAnalyticsBatchResult {
  batchId: string
  mode: BatchMode
  responseReturnedAt: number
}
