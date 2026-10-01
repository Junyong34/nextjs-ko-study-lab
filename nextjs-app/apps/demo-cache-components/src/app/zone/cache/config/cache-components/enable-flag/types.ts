/** 응답 스트림 측정 대상 하위 라우트 */
export type ProbeTarget = 'probe' | 'blocking'

/** 마커가 처음 등장한 청크 번호(1부터), 도착 시각(ms), HTML 내 위치(문자 오프셋) */
export interface MarkerHit {
  chunk: number
  ms: number
  offset: number
}

/** 하위 라우트의 HTML 응답을 직접 읽어 측정한 한 번의 결과 */
export interface StreamRun {
  runNo: number
  target: ProbeTarget
  status: number
  /** fetch가 resolve된 시각 = 응답 헤더가 도착한 시각 (TTFB에 해당) */
  headersMs: number
  totalMs: number
  totalChunks: number
  staticAt: MarkerHit | null
  cachedAt: MarkerHit | null
  fallbackAt: MarkerHit | null
  requestAt: MarkerHit | null
  /** 요청 시점 마크업이 React 스트리밍 세그먼트(<div hidden id="S:n">) 안에 도착했는가 */
  requestInStreamSegment: boolean
  cachedId: string | null
  requestId: string | null
}

/** away 페이지가 마운트될 때 문서에 남아 있는 이전 라우트 DOM을 직접 조사한 결과 */
export interface AwayObservation {
  seq: number
  /** 실습 화면의 Activity 실습 영역이 문서에 남아 있는가 */
  foundLab: boolean
  /** 그 영역 또는 조상 중 display: none인 요소가 있는가 (Activity가 숨긴 상태) */
  hiddenByDisplayNone: boolean
  /** 숨겨진 DOM의 입력창에 남아 있던 값 */
  draftSeen: string | null
  /** 숨겨진 DOM에 기록된 컴포넌트 인스턴스 ID */
  instanceId: string | null
  at: string
}

/** 실습 화면이 다시 보이게 된 순간의 기록 */
export interface ActivityReturn {
  obs: AwayObservation
  /** 복귀 시점의 컴포넌트 state — away에서 본 값과 같으면 언마운트되지 않은 것 */
  instanceAtReturn: string
  draftAtReturn: string
}

/** 판정 한 줄 — pass가 undefined면 아직 측정 전 */
export interface CheckResult {
  key: 'flag' | 'stream' | 'useCache' | 'blocking' | 'activity'
  label: string
  pass: boolean | undefined
  detail: string
}
