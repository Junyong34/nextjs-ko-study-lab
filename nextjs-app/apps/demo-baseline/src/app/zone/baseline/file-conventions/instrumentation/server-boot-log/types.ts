import type { ServerBootLogSnapshot } from '@/instrumentation'

/**
 * `GET /.../server-boot-log/api/boot-snapshot` 응답 페이로드.
 * `ServerBootLogSnapshot`(register()가 기록한, 부팅 시 고정되는 값)에
 * 요청별로 달라지는 값(requestReceivedAt, requestCount)을 더한 것이다.
 */
export interface BootSnapshotResponse extends ServerBootLogSnapshot {
  /** 이 API 요청을 서버가 수신한 시각(ISO) — 호출마다 달라진다 */
  requestReceivedAt: string
  /** 이 Route Handler 모듈이 같은 서버 프로세스에서 처리한 누적 요청 수 */
  requestCount: number
}

export type { ServerBootLogSnapshot }
