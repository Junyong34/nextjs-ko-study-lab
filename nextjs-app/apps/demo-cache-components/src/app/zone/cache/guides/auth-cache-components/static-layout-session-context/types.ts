/** 클라이언트에 노출하는 최소 사용자 객체 — 원시 세션·이메일은 넘기지 않는다. */
export interface SessionUser {
  id: string
  name: string
  tier: string
  points: number
}

/** getCurrentUser()가 요청마다 만드는 결과 */
export interface CurrentUserResult {
  /** 세션 쿠키가 없거나 알 수 없는 ID면 null (게스트) */
  user: SessionUser | null
  /** 이 요청에서 세션을 읽을 때 생성한 ID — 요청마다 달라야 한다 */
  requestId: string
  /** 세션을 읽은 서버 시각 (ISO) */
  readAt: string
}

/** 초기 HTML 응답을 직접 읽어 측정한 한 번의 결과 */
export interface StreamProbeRun {
  runNo: number
  status: number
  totalChunks: number
  totalMs: number
  /** 마커가 처음 등장한 청크 번호(1부터), 도착 시각(ms), HTML 내 위치(문자 오프셋) */
  shellAt: MarkerHit | null
  fallbackAt: MarkerHit | null
  sessionAt: MarkerHit | null
  /** 세션 마크업이 React 스트리밍 세그먼트(<div hidden id="S:n">) 안에 도착했는가 */
  sessionInStreamSegment: boolean
  shellRenderId: string | null
  sessionRequestId: string | null
  sessionUser: string | null
}

export interface MarkerHit {
  chunk: number
  ms: number
  offset: number
}
