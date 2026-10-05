export type ProbeTarget = 'inside' | 'outside'

export interface MarkerHit {
  chunk: number
  ms: number
  offset: number
}

/** 하위 라우트의 HTML 응답을 직접 읽어 측정한 한 번의 결과 */
export interface StreamRun {
  runNo: number
  target: ProbeTarget
  /** 측정 시점에 학습자가 발급해 둔 쿠키 상태 ('kim-shopping' | null) */
  cookieSent: string | null
  status: number
  /** 응답 헤더가 도착한 시각 (TTFB에 해당) */
  headersMs: number
  totalMs: number
  totalChunks: number
  staticAt: MarkerHit | null
  fallbackAt: MarkerHit | null
  sessionAt: MarkerHit | null
  /** 서버가 읽어 HTML에 박은 쿠키 값 ('none' 포함) */
  sessionUser: string | null
  /** 쿠키 영역이 스트리밍 세그먼트(<div hidden id="S:n">)로 도착했는가 */
  sessionInStreamSegment: boolean
}
