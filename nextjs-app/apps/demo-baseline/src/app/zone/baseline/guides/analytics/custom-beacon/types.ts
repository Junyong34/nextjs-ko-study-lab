export const BEACON_ENDPOINT = '/zone/baseline/guides/analytics/custom-beacon/api'
// 존재하지 않는 경로: sendBeacon은 큐 등록에 성공(true)해도 서버는 404로 응답한다.
export const MISSING_ENDPOINT = '/zone/baseline/guides/analytics/custom-beacon/api-missing'

/** 서버 Route Handler가 실제로 받아 저장한 이벤트 */
export interface ReceivedBeacon {
  id: string
  event: string
  productId: string
  contentType: string
  method: string
  receivedAt: string
}

export type BeaconTarget = 'ok' | 'missing'

/** 클라이언트가 마지막으로 보낸 시도 */
export interface BeaconAttempt {
  id: string
  target: BeaconTarget
  /** navigator.sendBeacon()의 반환값: 브라우저 전송 큐에 등록됐는지만 알려 준다 */
  queued: boolean
}

export type CheckPhase = 'idle' | 'checking' | 'done'
