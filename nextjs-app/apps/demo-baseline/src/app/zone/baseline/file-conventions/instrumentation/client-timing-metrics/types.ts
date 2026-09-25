export type StationId = 'dashboard' | 'report'

export const CLIENT_TIMING_BASE_PATH =
  '/zone/baseline/file-conventions/instrumentation/client-timing-metrics'

export const STATION_PATHS: Record<StationId, string> = {
  dashboard: CLIENT_TIMING_BASE_PATH,
  report: `${CLIENT_TIMING_BASE_PATH}/station-b`,
}

export const STATION_LABELS: Record<StationId, string> = {
  dashboard: '성능 대시보드',
  report: '상세 리포트',
}
