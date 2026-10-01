/** 이 데모의 내부 라우트 경로. 영상은 public/ 대신 Route Handler(video)가 바이너리로 서빙한다. */
export const DEMO_BASE_PATH = '/zone/baseline/guides/videos/lazy-video-player'
export const VIDEO_ROUTE = `${DEMO_BASE_PATH}/video`
export const LOG_ROUTE = `${DEMO_BASE_PATH}/log`

/** 서버(Route Handler)가 영상 요청마다 남기는 기록 */
export interface RequestRecord {
  at: number
  /** 요청의 Range 헤더 원문 (없으면 null) */
  range: string | null
  /** 응답 status: 전체 200, 부분 206, 범위 오류 416 */
  status: number
  bytes: number
}

export type SnapshotPhase = 'before' | 'after'

/** 한 시점의 실측값: 브라우저 DOM·Resource Timing과 서버 요청 기록을 함께 읽는다 */
export interface Snapshot {
  seq: number
  /** 측정 시점에 <video>에 src가 이미 부여돼 있었는가 (= 뷰포트 진입 후) */
  phase: SnapshotPhase
  measuredAt: string
  hasSrc: boolean
  preload: string
  readyState: number
  networkState: number
  paused: boolean | null
  muted: boolean | null
  currentTime: number
  /** video.played 범위의 누적 재생 시간(초). loop로 currentTime이 되감겨도 줄지 않는다 */
  playedSeconds: number
  /** Resource Timing에서 이 영상 URL로 잡힌 요청 수 */
  browserRequests: number
  /** Route Handler가 직접 센 요청 수 */
  serverRequests: number
  serverStatuses: number[]
  rangeRequests: number
}

export interface VideoEvent {
  name: string
  /** 뷰포트 진입 후 경과 시간(ms) */
  at: number
}
