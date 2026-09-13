import type { useReportWebVitals } from 'next/web-vitals'

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0]

/** useReportWebVitals 콜백으로 전달되는 실측 지표 하나의 형태 (공식 타입 재사용) */
export type WebVitalMetric = Parameters<ReportWebVitalsCallback>[0]

/** 화면에 쌓아 보여주기 위해 수신 시각을 덧붙인 로그 항목 */
export interface WebVitalLogEntry {
  metric: WebVitalMetric
  receivedAt: number
}
