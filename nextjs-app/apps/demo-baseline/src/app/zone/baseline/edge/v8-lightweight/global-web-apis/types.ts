// 이 파일은 edge Route Handler와 브라우저 컴포넌트가 함께 쓰는 타입만 둔다(런타임 코드 없음).

/** 공식 문서(Edge Runtime → Reference)의 API 분류 */
export type ApiGroup = 'Network' | 'Encoding' | 'Crypto' | 'Streams' | 'Web Standard'

/** edge 라우트 안에서 실제로 호출한 Web API 하나의 결과 */
export interface ApiCheck {
  api: string
  group: ApiGroup
  /** 실제로 실행한 호출식 */
  call: string
  /** 호출이 돌려준 값(요약) */
  value: string
  /** 라우트가 스스로 검사한 성공 여부(왕복 일치, 형식 일치 등) */
  ok: boolean
}

/** probe/route.ts 응답 본문 */
export interface ProbeResponse {
  nextRuntime: string | null
  edgeRuntimeGlobal: string
  input: string
  sha256Hex: string
  utf8ByteLength: number
  base64: string
  checks: ApiCheck[]
  handlerMs: number
  measuredAt: string
}

/** stream/route.ts가 한 줄(NDJSON)씩 흘려보내는 청크 */
export interface StreamChunk {
  seq: number
  total: number
  part: string
  transformed: string
  serverElapsedMs: number
}

/** 브라우저가 청크를 받은 시점까지 붙인 관측값 */
export interface ObservedChunk extends StreamChunk {
  arrivedMs: number
}

export const STREAM_CHUNKS = 5
export const STREAM_INTERVAL_MS = 400
