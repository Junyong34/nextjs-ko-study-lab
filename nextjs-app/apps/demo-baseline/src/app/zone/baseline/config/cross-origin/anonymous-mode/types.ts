/** <Script crossOrigin>에 넣는 값. undefined면 속성을 붙이지 않는다. */
export type CrossOriginMode = 'anonymous' | 'use-credentials'

/** probe Route Handler가 응답에 붙이는 CORS 헤더 정책 */
export type CorsPolicy = 'none' | 'star' | 'echo'

export interface TrialSpec {
  id: string
  label: string
  crossOrigin?: CrossOriginMode
  cors: CorsPolicy
  /** 브라우저가 스크립트를 로드·실행해야 하면 true, CORS 검사로 차단해야 하면 false */
  expectLoaded: boolean
  /** 로드된 경우 window error 이벤트에 상세 메시지가 보여야 하면 true, 'Script error.'로 가려져야 하면 false */
  expectDetailed: boolean | null
  why: string
}

/** 스크립트가 실행됐을 때 서버가 받은 요청 헤더를 스크립트 본문에 담아 돌려준 값 */
export interface ServerEcho {
  origin: string | null
  secFetchMode: string | null
  cors: CorsPolicy
}

export type TrialOutcome = 'load' | 'error' | 'timeout'

export interface TrialResult {
  specId: string
  url: string
  outcome: TrialOutcome
  /** DOM에 실제로 붙은 crossorigin 속성값 (없으면 null) */
  attr: string | null
  /** HTMLScriptElement.crossOrigin 프로퍼티 값 */
  prop: string | null
  echo: ServerEcho | null
  errorMessage: string | null
  errorFilename: string | null
  durationMs: number
  measuredAt: string
}

export interface AssetGroup {
  total: number
  /** crossorigin 속성이 붙은 태그의 경로와 값 */
  withCrossOrigin: { url: string; value: string }[]
}

export interface AssetScan {
  /** 부트스트랩 <script defer>와 CSS <link> — next.config crossOrigin이 값을 넘기는 태그 */
  bootstrap: AssetGroup
  /** client 컴포넌트 청크 <script async> — React Flight가 preinit으로 넣은 태그 */
  chunks: AssetGroup
  scannedAt: string
}

export interface Verdict {
  isMatched: boolean | undefined
  reasons: string[]
}
