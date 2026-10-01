// hover-shell 데모 공용 타입. fetch 관측 결과(RscRequest)가 검증 패널의 판정 근거다.

export type RequestKind = 'prefetch' | 'navigation'

/** window.fetch를 감싸 잡아낸 RSC 요청 한 건 (`RSC: 1` 헤더가 있는 요청만). */
export interface RscRequest {
  id: number
  kind: RequestKind
  /** `_rsc` 쿼리를 뺀 pathname */
  path: string
  /** URL에 `_rsc` 캐시 버스팅 쿼리가 붙었는가 */
  hasRscParam: boolean
  /** `Next-Router-Prefetch` 요청 헤더 값 */
  prefetchHeader: string | null
  /** `Next-Router-Segment-Prefetch` 요청 헤더 값 (세그먼트 단위 prefetch) */
  segmentPrefetch: string | null
  startedAt: number
  /** 응답 헤더가 도착한 시점까지 걸린 ms */
  headersMs: number | null
  /** 응답 body 스트림이 끝날 때까지 걸린 ms */
  bodyMs: number | null
  status: number | null
}

export interface HoverEvent {
  at: number
  label: string
}

/** Resource Timing에 잡힌 `_rsc` 요청 */
export interface ResourceEntry {
  name: string
  startTime: number
  duration: number
}

export interface ProbeState {
  requests: RscRequest[]
  hovers: HoverEvent[]
  resources: ResourceEntry[]
  since: number
  recordHover: (label: string) => void
  reset: () => void
}

export interface CheckLine {
  /** true 통과 / false 실패 / null 아직 판단 불가 */
  ok: boolean | null
  text: string
}

export interface Judgement {
  isMatched: boolean | undefined
  checks: CheckLine[]
  info: string[]
}
